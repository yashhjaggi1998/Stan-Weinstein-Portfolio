import {useEffect, useState} from "react";
import Head from 'next/head';

import { useMediaQuery } from "@/hooks/use-media-query";

import { DesktopDrowpdown } from "@/components/custom/DesktopDropdown";
import { MobileDropdown } from "@/components/custom/MobileDropDown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { convertINRToUSD } from "@/utils/ConvertINRToUSD";
import { AnnualOverviewData } from "@/types/AnnualOverviewData";
import { FinancialYear } from "@/types/FinancialYear";
import { OverviewTab } from "@/components/custom/tabs/OverviewTab";
import { ActiveHoldingsTab } from "@/components/custom/tabs/ActiveHoldingsTab";

export default function Portfolio() {

    const isDesktop = useMediaQuery("(min-width: 1080px)");
    
    const [ isDrawerOpen, setDrawerOpen ] = useState(false); 
    const [ selectedFinancialYear, setSelectedFinancialYear ] = useState<FinancialYear | null>(null);
    const [ activeHoldings, setActiveHoldings ] = useState([]);
    const [ totalPnl, setTotalPnl ] = useState<number>(0);
    const [ totalAmountInvested, setTotalAmountInvested ] = useState<number>(0);

    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [annualOverviewData, setAnnualOverviewData] = useState<AnnualOverviewData>({
        percentReturn: 0,
        absoluteReturn: 0,
        absoluteReturnUSD: 0,
        amountInvested: 0,
        amountInvestedUSD: 0,
        currentInvestmentValue: 0,
        currentInvestmentValueUSD: 0,
        numberOfHoldings: 0,
    });

    useEffect(() => {
        async function getExchangeRate() {
            const _exchangeRate = await convertINRToUSD(100);
            if (_exchangeRate.status === 'error') {
                console.error(_exchangeRate.message);
                return;
            }
            setExchangeRate(_exchangeRate.data);
        }
        getExchangeRate();
    }, []);       

    useEffect(() => {
        async function fetchData() {

            if (!selectedFinancialYear) return;

            const _FY = selectedFinancialYear?.year;
            const response = await fetch('/api/v1/holdings/annual?financialYear=' + _FY);

            //Unable to fetch live price. Throw an error or use a different approach to handle this
            if (response.status !== 200) {
                alert('Unable to fetch data. Please try again later');
                return;
            }
            
            const result = await response.json();
            result.absoluteReturnUSD = result.absoluteReturn * exchangeRate;
            result.amountInvestedUSD = result.amountInvested * exchangeRate;
            result.currentInvestmentValueUSD = result.currentInvestmentValue * exchangeRate;

            setActiveHoldings(result.activeHoldings);
            setTotalPnl(result.absoluteReturn);
            setTotalAmountInvested(result.amountInvested);

            setAnnualOverviewData(result);
        }

        fetchData();
    }, [selectedFinancialYear]);

    return (
        <>
            <Head>
                <title>Portfolio</title>
            </Head>
        
            <div className="overflow-hidden border rounded-lg shadow m-8">
                <div className="border-b p-4">
                    {isDesktop ? 
                        <DesktopDrowpdown 
                            selectedFinancialYear={selectedFinancialYear}
                            setSelectedFinancialYear={setSelectedFinancialYear}
                            isDrawerOpen={isDrawerOpen}
                            setDrawerOpen={setDrawerOpen}
                        /> : 
                        <MobileDropdown
                            selectedFinancialYear={selectedFinancialYear}
                            setSelectedFinancialYear={setSelectedFinancialYear}
                            isDrawerOpen={isDrawerOpen}
                            setDrawerOpen={setDrawerOpen}
                        />
                    }
                </div>

                <div className="p-4">
                    <Tabs defaultValue="overview">
                        <TabsList className="grid grid-cols-4 gap-4 w-fit text-sm">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="active_holdings">Active</TabsTrigger>
                            <TabsTrigger value="dividends">Dividends</TabsTrigger>
                            <TabsTrigger value="tax">Tax</TabsTrigger>
                        </TabsList>

                        <OverviewTab 
                            overview_data={annualOverviewData} 
                            exchange_rate={exchangeRate}
                            selected_financial_year={selectedFinancialYear}
                        />

                        {selectedFinancialYear && <ActiveHoldingsTab activeHoldings={activeHoldings} selectedFinancialYear={selectedFinancialYear} />}
                        <TabsContent value="dividends">
                            <div>Dividends</div>
                        </TabsContent>
                        <TabsContent value="tax">
                            <div>Tax</div>
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </>
    );
};