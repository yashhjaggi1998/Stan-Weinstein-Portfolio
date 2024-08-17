import { structureHoldings } from '@/api/v2/helpers/structureHoldings';
import { getDBHoldings } from '@/api/v2/helpers/fetchDBData'
import { getCMP } from '../helpers/getCMPofTickers';
import { HTTP_CODES } from '@/utils/constants/htttpCodes';

export default async function annual(financialYear: string) {

    // Read positions from DB
    // PROD CODE
    const {active_positions, closed_positions} = await getDBHoldings(financialYear);
    
    //fs.writeFileSync('activePositions.json', JSON.stringify(active_positions));
    //fs.writeFileSync('closedPositions.json', JSON.stringify(closed_positions));
    // DEV CODE
    //const active_positions: any = JSON.parse(fs.readFileSync('activePositions.json', 'utf8'));
    //const closed_positions: any = JSON.parse(fs.readFileSync('closedPositions.json', 'utf8'));

    // PROD CODE
    const { cmpList, active_tickers } = await getCMP(active_positions);
    //fs.writeFileSync('allPrices.json', JSON.stringify(Object.fromEntries(cmpList)));
    // DEV CODE
    //let cmpList:any = JSON.parse(fs.readFileSync('allPrices.json', 'utf8'));
    //cmpList = new Map(Object.entries(cmpList));

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