import { NextApiRequest, NextApiResponse } from 'next';

import annual from "@/api/v2/services/annual";
import { HTTP_CODES } from '@/utils/constants/htttpCodes';

interface QueryParams {
    financialYear?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        const { financialYear } = req.query as QueryParams;

        try {
            if (!financialYear) {
                throw {
                    status: HTTP_CODES.BAD_REQUEST,
                    message: 'Financial Year not provided',
                };
            }

            const {
                totalPnL, 
                totalAmountInvested, 
                activePositions, 
                closed_positions, 
                active_tickers
            } = await annual(financialYear);

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
            res.status(e?.status || 404).json({
                message: e?.message || "FAILED", 
            });
        }
    }
}

