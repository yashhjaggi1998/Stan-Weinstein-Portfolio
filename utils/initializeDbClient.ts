import clientPromise from "../lib/mongodb";

export async function initializeDatabaseClient(){
    const client = await clientPromise;
    const _dbClient = client.db('WeeklyTimeFrame');

    return _dbClient;
}