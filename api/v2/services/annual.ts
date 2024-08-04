import { initializeDatabaseClient } from '@/utils/initializeDbClient';
import { structureHoldings } from '@/api/v2/helpers/structureHoldings';
import { HTTP_CODES } from '@/utils/constants/htttpCodes';
import { fetchLivePrices } from '@/api/v2/helpers/fetchLivePrice';
import { getAnnualPositions } from '@/api/v2/helpers/annualPositions'
import pLimit from 'p-limit';
import fs from "fs";

const limit = pLimit(8);

export default async function annual(financialYear: string) {
    
    const DbClient = await initializeDatabaseClient();

    // Read positions from DB
    // PROD CODE
    //const {active_positions, closed_positions} = await getAnnualPositions(DbClient, financialYear);
    
    //fs.writeFileSync('activePositions.json', JSON.stringify(active_positions));
    //fs.writeFileSync('closedPositions.json', JSON.stringify(closed_positions));
    // DEV CODE
    const active_positions: any = JSON.parse(fs.readFileSync('activePositions.json', 'utf8'));
    const closed_positions: any = JSON.parse(fs.readFileSync('closedPositions.json', 'utf8'));

    // Get SET of tickers
    let active_tickers: string[] = [];
    for(const position of active_positions) {
        if(!active_tickers.includes(position.ticker)) {
            active_tickers.push(position.ticker)
        }
    }

    // PROD CODE
    //const cmpList = await getCMPofTickers(active_tickers);
    //fs.writeFileSync('allPrices.json', JSON.stringify(Object.fromEntries(cmpList)));
    // DEV CODE
    let cmpList:any = JSON.parse(fs.readFileSync('allPrices.json', 'utf8'));
    cmpList = new Map(Object.entries(cmpList));

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

    return {totalPnL, totalAmountInvested, activePositions, closed_positions, active_tickers};
}

// ************************* HELPER functions ******************************
async function getCMPofTickers(tickerList: string[]) {
    let cmpList:Map<string, number> = new Map();

    const promises = tickerList.map( ticker => 
        limit(async () => {
            try {
                const price = await fetchLivePrices(ticker.toUpperCase());
                cmpList.set(ticker, price);
            } catch (err: any) {
                throw {
                    status: err?.status || HTTP_CODES.NOT_FOUND,
                    message: err?.message || `Error fetching price from external API for ${ticker.toUpperCase()}`,
                };
            }
        })
    );

    await Promise.all(promises);
    return cmpList;
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