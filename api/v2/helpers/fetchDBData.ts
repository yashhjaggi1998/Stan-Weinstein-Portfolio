import { initializeDatabaseClient } from '@/utils/initializeDbClient';

interface DBHoldings {
    active_positions: any[],
    closed_positions: any[],
}

async function getDBHoldings(financialYear?: string):Promise<DBHoldings> {

    const DbClient = await initializeDatabaseClient();

    const searchQuery = financialYear ? {
        fiscal_year: financialYear
    } : {};

    const active_positions = await DbClient.collection('Active Portfolio').find(searchQuery).toArray();
    const closed_positions = await DbClient.collection('Closed Positions').find(searchQuery).toArray();

    return {active_positions, closed_positions};
}

export {
    getDBHoldings,
};