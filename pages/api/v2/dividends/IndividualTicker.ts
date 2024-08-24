import { NextApiRequest, NextApiResponse } from 'next';
import { getTickerDividend } from '@/api/v2/services/dividends/IndividualTicker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        try {
            const { ticker } = req.query;
            if (!ticker) {
                throw { status: 400, message: "Ticker is required" };
            }
            const result = await getTickerDividend(ticker as string);

            return res.status(200).json({
                dividendData: result
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