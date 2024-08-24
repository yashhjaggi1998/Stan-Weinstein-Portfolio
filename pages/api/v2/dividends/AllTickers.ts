import { NextApiRequest, NextApiResponse } from 'next';
import { CombinedDividend, getTickerDividend } from '@/api/v2/services/dividends/IndividualTicker';
import { initializeDatabaseClient } from '@/utils/initializeDbClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        try {
            const DbClient = await initializeDatabaseClient();

            const tickers = await DbClient.collection('Dividends').distinct('ticker');

            let dividends: CombinedDividend[] = [];

            for (const ticker of tickers) {
                const result = await getTickerDividend(ticker as string);
                dividends.push(result);
            };

            return res.status(200).json({
                dividendData: dividends
            });
        } 
        catch (e: any) {
            console.error("ERROR");
            console.error(e);
            res.status(e?.status || 404).json({
                message: e?.message || "FAILED", 
            });
        }
    }
}