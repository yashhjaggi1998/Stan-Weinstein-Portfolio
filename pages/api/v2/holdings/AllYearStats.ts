import { NextApiRequest, NextApiResponse } from 'next';

import AllYearStats from "@/api/v2/services/AllYearStats";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {

        try {
            const {allYearsStats } = await AllYearStats();

            return res.status(200).json({
                AllYearStats: allYearsStats,
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

