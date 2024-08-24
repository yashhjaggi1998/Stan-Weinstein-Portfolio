import { initializeDatabaseClient } from '@/utils/initializeDbClient';
import { fetchLivePrices } from '@/api/v2/helpers/fetchLivePrice';

type DividendTransaction = {
    year: string;
    month?: string;
    amount: number;
}

type DividendDocument = {
    ticker: string;
    Company: string;
    received: DividendTransaction[];
}

export type CombinedDividend = {
    ticker: string ;
    company: string;
    currentPrice?: number;
    qualifyForReinvestment: boolean;
    totalReceivedDividend: number;
    annualDividends: { [year: string]: number };
}

export async function getTickerDividend(ticker: string): Promise<CombinedDividend> {

    const tickerData = await getDataFromDb(ticker);
    if (!tickerData) {
        throw {
            status: 404,
            message: `Ticker ${ticker} not found in the database`
        };
    }

    const dividendData = await getStructuredDividendData(tickerData);
    
    return dividendData;
}

async function getDataFromDb(ticker: string) {
    const DbClient = await initializeDatabaseClient();

    const searchQuery = {
        ticker: ticker
    };

    const tickerData: DividendDocument | null = await DbClient.collection('Dividends').findOne(searchQuery) as DividendDocument | null;
    return tickerData;
}

async function getStructuredDividendData(dividendData: DividendDocument | null): Promise<CombinedDividend> {
    const ticker = dividendData?.ticker || "";

    let cmp: number = 0;
    try{
        cmp = await fetchLivePrices(ticker);
        if (cmp) {
            cmp = Number(cmp);
        }
    }
    catch(e) {
        console.error(`Error fetching live price for ${ticker}`);
    }
    
    const combinedDividend = getAnnualAggregateDividend(ticker, cmp, dividendData);

    return combinedDividend;
}

function getAnnualAggregateDividend(ticker: string, cmp: number, dividendData: DividendDocument | null) {
    const combinedDividend: CombinedDividend = {
        ticker,
        company: dividendData?.Company || "",
        qualifyForReinvestment: false,
        totalReceivedDividend: 0,
        annualDividends: {}
    };

    dividendData?.received.map((dividend) => {
        const { year, amount } = dividend;

        combinedDividend.totalReceivedDividend += amount; // Calculate total dividend received

        // Calculate annual dividend
        if (!combinedDividend.annualDividends[year]) {
            combinedDividend.annualDividends[year] = 0;
        }
        combinedDividend.annualDividends[year] += amount;
    });

    combinedDividend.currentPrice = cmp;
    combinedDividend.qualifyForReinvestment = cmp !== undefined && combinedDividend.totalReceivedDividend > cmp;

    return combinedDividend;
}