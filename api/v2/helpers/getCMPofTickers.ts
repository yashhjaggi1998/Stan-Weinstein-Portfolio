import pLimit from 'p-limit';
import { fetchLivePrices } from '@/api/v2/helpers/fetchLivePrice';
import { HTTP_CODES } from '@/utils/constants/htttpCodes';

const limit = pLimit(8);

export async function getCMP(active_positions: any[]) {
    
    // Get SET of tickers
    let active_tickers: string[] = [];
    for(const position of active_positions) {
        if(!active_tickers.includes(position.ticker)) {
            active_tickers.push(position.ticker)
        }
    }

    const cmpList = await getCMPofTickers(active_tickers);

    return { cmpList, active_tickers };
}

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