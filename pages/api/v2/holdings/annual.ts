import { NextApiRequest, NextApiResponse } from 'next';
import { fetchLivePrices } from '../../../../api/v2/helpers/fetchLivePrice';
import { initializeDatabaseClient } from '../../../../utils/initializeDbClient';
import { getAnnualPositions } from '@/api/v2/helpers/annualPositions'
import { HTTP_CODES } from '@/utils/constants/htttpCodes';
import { structureHoldings } from '@/api/v2/helpers/structureHoldings';
import pLimit from 'p-limit';

const limit = pLimit(8);

interface QueryParams {
    financialYear?: string,
}

async function getCMPofTickers(tickerList: string[]) {
    let cmpList:Map<string, number> = new Map();

    const promises = tickerList.map( ticker => 
        limit(async () => {
            try {
                const price = await fetchLivePrices(ticker.toUpperCase());
                cmpList.set(ticker, price);
            } catch (err) {
                throw {
                    status: HTTP_CODES.NOT_FOUND,
                    message: `Error fetching price from external API for ${ticker.toUpperCase()}`,
                };
            }
        })
    );

    await Promise.all(promises);
    return cmpList;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        const { financialYear } = req.query as QueryParams;

        try {
            if (!financialYear) {
                throw new Error('Financial Year not provided');
            }

            const DbClient = await initializeDatabaseClient();

            const {active_positions, closed_positions} = await getAnnualPositions(DbClient, financialYear);

            // Get the list of all tickers in active_positions
            let active_tickers: string[] = [];
            for(const position of active_positions) {
                if(!active_tickers.includes(position.ticker)) {
                    active_tickers.push(position.ticker)
                }
            }

            const cmpList = await getCMPofTickers(active_tickers);

            const activePositions = structureHoldings(active_positions, cmpList);

            const { totalPnL, totalAmountInvested } = getAggregateAnalytics(activePositions, closed_positions, cmpList);
            
            if (isNaN(totalAmountInvested) || isNaN(totalPnL)) {
                throw {
                    status: HTTP_CODES.NOT_FOUND,
                    message: 'TotalAmountInvested or TotalPnL are not a valid value',
                };
            }

            //Sort active positions by %PnL
            activePositions.sort((a: any, b: any) => {
                return (100*(b.cmp - b.buy_price)/b.buy_price) - (100*(a.cmp - a.buy_price)/a.buy_price);
            });

            return res.status(200).json({
                percentReturn: totalAmountInvested === 0 ? 0 : parseFloat((100*(totalPnL)/totalAmountInvested).toFixed(2)),
                absoluteReturn: totalPnL,
                amountInvested: totalAmountInvested,
                currentInvestmentValue: totalAmountInvested + totalPnL,
                numberOfHoldings: active_tickers.length,
                activeHoldings: activePositions,
                closedPositions: closed_positions,
            });
        } 
        catch (e: any) {
            console.error("ERROR");
            console.error(e);
            res.status(e.status || 404).json({
                message: e?.message || "FAILED", 
            });
        }
    }
}

function getAggregateAnalytics(activePositions: any[], closedPositions: any[], cmpList: Map<string, number>) {

    let totalPnL = 0;
    let totalAmountInvested = 0;

    for (let position of activePositions) {
        totalAmountInvested += position.quantity * position.buy_price;
        totalPnL += position.pnl;
    }

    for (let position of closedPositions) {
        totalPnL += position.quantity * (position.close_price - position.buy_price);
    }

    totalPnL = parseFloat(totalPnL.toFixed(2));
    totalAmountInvested = parseFloat(totalAmountInvested.toFixed(2));

    return { totalPnL, totalAmountInvested };
}
