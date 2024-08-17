import { getDBHoldings } from '../helpers/fetchDBData';
import { getCMP } from '../helpers/getCMPofTickers';
import { goals as Goals} from "@/types/Goals";
import { formatAmount } from "@/utils/formatAmount";
import { convertINRToUSD } from "@/utils/ConvertINRToUSD";

enum YearlyStatus {
    ACHIEVED = "Achieved",
    FELLSHORT = "Fell Short",
    ONGOING = "On Going",
}

interface YearlyStats {
    year: string,
    currency?: string
    amountInvested?: string,
    pnl?: string,
    target_pnl?: number,
    percent_pnl?: string,
    target_percent_pnl?: number,
    status?: YearlyStatus,
}

const years = ['2023', '2024']

export default async function AllYearStats() {

    let allYearsStats: YearlyStats[] = []; // returnable array
    let annualActivePositions:Map<string, any[] | []> = new Map(); // Stores positions of each year in a map...

    const {active_positions, closed_positions} = await getDBHoldings();

    for (const position of active_positions) {
        const fiscal_year = position.fiscal_year;
        const prevYearArr = annualActivePositions.get(fiscal_year) ?? [];
        position.type = "ACTIVE";

        annualActivePositions.set(fiscal_year, [...prevYearArr, position]);
    }

    for (const position of closed_positions) {
        const fiscal_year = position.fiscal_year;
        const prevYearArr = annualActivePositions.get(fiscal_year) ?? [];
        position.type = "CLOSED";

        annualActivePositions.set(fiscal_year, [...prevYearArr, position]);
    }

    const { cmpList } = await getCMP(active_positions);
    
    for (const year of years) {
    
        const {
            amountInvested,
            pnl,
            percent_pnl,
            target_percent_pnl,
            status,
        } = await getYearlyStats(year, cmpList, [...annualActivePositions.get(year) ?? []]);
        
        allYearsStats.push({
            year,
            status,
            currency: "USD",
            pnl,
            percent_pnl,
            target_percent_pnl,
            amountInvested,            
        });
    }

    return {allYearsStats};
}

async function getYearlyStats(year: string, cmpMap: Map<string, number>, positions: any[]) {
    
    let pnl = 0;
    const amountInvested = Goals[year].targetInvestmentValue;
    const currentYear = new Date().getFullYear();

    for (const position of positions) {
        const ticker = position.ticker;

        if (position.type == "ACTIVE") {
            const cmp = cmpMap.get(ticker)!;
            const l_pnl = (cmp - position.buy_price) * position.quantity;
            pnl += l_pnl;
        }
        else {
            const l_pnl = (position.close_price - position.buy_price) * position.quantity;
            pnl += l_pnl;
        }
    }
    
    let ex_rate_result = await convertINRToUSD(pnl);

    const pnl_usd = pnl*ex_rate_result.data;
    const percent_pnl = (pnl_usd / amountInvested) * 100;

    const status = currentYear.toString() == year ? YearlyStatus.ONGOING : YearlyStatus.ACHIEVED;

    return {
        amountInvested: formatAmount(amountInvested),
        pnl: formatAmount(pnl_usd), 
        percent_pnl: formatAmount(percent_pnl),
        target_percent_pnl: Goals[year].targetRoi,
        status,
    };
}