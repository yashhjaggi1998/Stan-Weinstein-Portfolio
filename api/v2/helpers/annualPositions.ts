import { Db } from 'mongodb';

interface AnnualPositions {
    active_positions: any[],
    closed_positions: any[],
}

async function getAnnualPositions(DbClient: Db, financialYear: string):Promise<AnnualPositions> {

    const active_positions = await DbClient.collection('Active Portfolio').find({
        fiscal_year: financialYear
    }).toArray();

    const closed_positions = await DbClient.collection('Closed Positions').find({
        fiscal_year: financialYear
    }).toArray();

    return {active_positions, closed_positions};
}

export {
    getAnnualPositions,
};