import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from "../../../../lib/mongodb";
import { fetchPricesFromAPI } from '../../../../api/helpers/fetchLivePrice';
import fs from 'fs';

async function initializeDatabaseClient(){
    const client = await clientPromise;
    const _dbClient = client.db('WeeklyTimeFrame');

    return _dbClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        const { financialYear } = req.query;

        try 
        {
            if (!financialYear) {
                throw new Error('Financial Year not provided');
            }

            const DbClient = await initializeDatabaseClient();

            const active_postions = await DbClient.collection('Active Portfolio').find({
                fiscal_year: financialYear
            }).toArray();

            const closed_positions = await DbClient.collection('Closed Positions').find({
                fiscal_year: financialYear
            }).toArray();

            /*
                Production code should use the below line to fetch live prices
                For testing purposes, we will use a local file to fetch the prices
            */
            const allPrices = await fetchPricesFromAPI();
            fs.writeFileSync('allPrices.json', JSON.stringify(allPrices));
            //let allPrices = fs.readFileSync('allPrices.json', 'utf8');
            //allPrices = JSON.parse(allPrices);
            console.log(allPrices);

            const { holdings, totalPnL, totalAmountInvested } = getAggregateAnalytics(active_postions, closed_positions, allPrices);
            
            if (isNaN(totalAmountInvested) || isNaN(totalPnL)) {
                throw new Error('Invalid data in database');
            }

            const activePositions = structureHoldings(allPrices, active_postions);
            console.log(activePositions);
            //Sort active positions by %PnL
            activePositions.sort((a: any, b: any) => {
                return (100*(b.cmp - b.buy_price)/b.buy_price) - (100*(a.cmp - a.buy_price)/a.buy_price);
            });

            return res.status(200).json({
                percentReturn: totalAmountInvested === 0 ? 0 : 100*(totalPnL)/totalAmountInvested,
                absoluteReturn: totalPnL,
                amountInvested: totalAmountInvested,
                currentInvestmentValue: totalAmountInvested + totalPnL,
                numberOfHoldings: holdings.length,
                activeHoldings: activePositions,
                closedPositions: closed_positions,
            });
        } 
        catch (e: any) {
            console.error("ERROR");
            console.error(e);
            res.status(e.status || 404).json({ 
                status: 'error', 
                message: e?.message || "FAILED", 
            });
        }
    }
}

function structureHoldings(allPrices: any, holdings: any) {

    for(let i = 0; i < holdings.length; i++) {

        const _cmp = getSpecificStockPrice(allPrices, holdings[i].ticker);

        if(_cmp === 0) {
            console.log("Stock price not found for ", holdings[i].ticker);
            throw { status: 404, message: "Stock price not found for " + holdings[i].ticker };
        }
        
        const _pnl = holdings[i].quantity * (_cmp - holdings[i].buy_price); //Limit the float to 2 decimal places
        const pnl = parseFloat(_pnl.toFixed(2));
        
        const _percentPnL = 100 * _pnl / (holdings[i].quantity * holdings[i].buy_price);
        const percentPnL = parseFloat(_percentPnL.toFixed(2));
        
        holdings[i] = {
            ...holdings[i],
            cmp: _cmp,
            pnl: pnl,
            percentPnL: percentPnL,
        }
    }
    return holdings;
}

function getAggregateAnalytics(activePositions: any, closedPositions: any, allPrices: any) {

    let holdings: string[] = [];
    let totalPnL = 0;
    let totalAmountInvested = 0;

    for (let position of activePositions) {

        totalAmountInvested += position.quantity * position.buy_price;
        totalPnL += position.quantity * (getSpecificStockPrice(allPrices, position.ticker) - position.buy_price);

        if(!holdings.includes(position.ticker)) {
            holdings.push(position.ticker);
        }
    }

    for (let position of closedPositions) {
        totalPnL += position.quantity * (position.close_price - position.buy_price);
    }

    return { holdings, totalPnL, totalAmountInvested };
}

function getSpecificStockPrice(allPrices: any, ticker: string) {
    let price = 0;
    for (let stock of allPrices) {
        if (stock["NSE Symbol"] === ticker) {
            price = stock.LTP;
            break;
        }
    }
    return price;
}