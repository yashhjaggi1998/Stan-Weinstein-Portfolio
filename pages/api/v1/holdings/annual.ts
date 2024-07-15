import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from "../../../../lib/mongodb";
import { fetchPricesFromAPI } from '../../../../api/helpers/fetchLivePrice';

async function initializeDatabaseClient(){
    const client = await clientPromise;
    const _dbClient = client.db('WeeklyTimeFrame');

    return _dbClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        let holdings: string[] = [];
        let response = {
            percentReturn: 0,
            absoluteReturn: 0,
            amountInvested: 0,
            numberOfHoldings: 0,
        }; 

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

            const allPrices = await fetchPricesFromAPI();

            const { holdings, totalPnL, totalAmountInvested } = getAggregateAnalytics(active_postions, closed_positions, allPrices);
            
            if (isNaN(totalAmountInvested) || isNaN(totalPnL)) {
                throw new Error('Invalid data in database');
            }

            res.status(200).json({
                percentReturn: totalAmountInvested === 0 ? 0 : 100*(totalPnL)/totalAmountInvested,
                absoluteReturn: totalPnL,
                amountInvested: totalAmountInvested,
                currentInvestmentValue: totalAmountInvested + totalPnL,
                numberOfHoldings: holdings.length,
                activeHoldings: JSON.parse(JSON.stringify(active_postions)),
                closedPositions: JSON.parse(JSON.stringify(closed_positions)),
            });
        } 
        catch (e: any) {
            console.error(e);
            res.status(400).json({ status: 'error', message: e.message });
        }
    }
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
        if (stock.Symbol === ticker) {
            price = stock.LTP;
            break;
        }
    }
    return price;
}