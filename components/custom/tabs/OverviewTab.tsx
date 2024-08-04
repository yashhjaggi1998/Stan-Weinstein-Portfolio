import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { GiBullseye } from "react-icons/gi";
import { PiChartLine } from "react-icons/pi";
import { AnnualOverviewData, FinancialYear, Goal } from "types";
import { formatAmount } from "@/utils/formatAmount";
import { PerformanceCard } from "./PerformanceCard";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
    overview_data: AnnualOverviewData;
    exchange_rate: number;
    selected_financial_year: FinancialYear | null;
}

const goals: { [key: string]: Goal  } = {
    "2023": {
        targetRoi: 40,
        targetPnL: 400,
        targetInvestmentValue: 1000,
    },
    "2024": {
        targetRoi: 40,
        targetPnL: 5000,
        targetInvestmentValue: 12500,
    },
}

export function OverviewTab(props: OverviewTabProps) {

    const { overview_data, exchange_rate, selected_financial_year } = props;

    return (
        <TabsContent value="overview">

            <div id="performance-container" className="mt-8">
                <h2 className="text-2xl font-bold">
                    Performance <PiChartLine className="inline-block text-4xl font-bolder text-slate-500" stroke="2"/>
                </h2>

                <div id="performance-cards" className="grid md:grid-cols-5 gap-4 mt-2">

                    <PerformanceCard 
                        title="ROI"
                        description="Return on Amount Invested"
                        content={`${formatAmount(overview_data.percentReturn)}%`}
                        textColor={overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}
                    />

                    <PerformanceCard
                        title="PnL"
                        description="Profit and Loss"
                        content={`$ ${formatAmount(overview_data.absoluteReturnUSD)}`}
                        subContent={`(₹ ${formatAmount(overview_data.absoluteReturn)})`}
                        textColor={overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}
                    />

                    <PerformanceCard
                        title="Amount Invested"
                        description="Value of Amount Invested"
                        content={`$ ${formatAmount(overview_data.amountInvestedUSD)}`}
                        subContent={`(₹ ${formatAmount(overview_data.amountInvested)})`}
                        textColor="text-black"
                    />

                    <PerformanceCard
                        title="Current Investment"
                        description="Value of Current Investment"
                        content={`$ ${formatAmount(overview_data.currentInvestmentValueUSD)}`}
                        subContent={`(₹ ${formatAmount(overview_data.currentInvestmentValue)})`}
                        textColor="text-black"
                    />

                    <PerformanceCard
                        title="# Holdings"
                        description="Number of Active Holdings"
                        content={`${overview_data.numberOfHoldings}`}
                        textColor="text-black"
                    />
                </div>
            </div>
            
            {selected_financial_year && 
                <div id="goals" className="mt-8">
               
                    <h2 className="text-2xl font-bold">
                        Goals <GiBullseye className="inline-block text-4xl text-slate-500" /> {" "}
                        <Badge className="bg-badgesuccess text-green-900 font-bold">ACHIEVED</Badge>
                    </h2>

                    <div className="grid md:grid-cols-10 gap-4 mt-2">
                        
                        <div className="grid col-span-2 gap-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-md flex justify-between">
                                        <span>
                                            Percent Returns
                                        </span>
                                        <span className="font-bold text-2xl">
                                            {formatAmount(goals[selected_financial_year.year].targetRoi)}%
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                            </Card> 
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-md flex justify-between">
                                        <div>
                                            Absolute Returns
                                        </div>
                                        <div className="text-end">
                                            <p className={`text-2xl font-bold`}>
                                            $ {formatAmount(goals[selected_financial_year.year].targetPnL)}
                                            </p>
                                            <p className="text-sm">
                                                (₹ {formatAmount(goals[selected_financial_year.year].targetPnL/exchange_rate)})
                                            </p>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                            </Card> 
                        </div>

                        <div className="col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-md">Investment</CardTitle>
                                    <CardDescription className="text-sm">Target Amount To Invest - {selected_financial_year.year}</CardDescription>
                                </CardHeader>
                                { selected_financial_year?.year &&
                                    <CardContent>
                                        <p className="text-xl font-bold text-black">
                                            $ {formatAmount(goals[selected_financial_year.year].targetInvestmentValue)}
                                        </p>
                                        <p className="text-sm">
                                            {exchange_rate !== 0 &&  
                                                `(₹ ${formatAmount(goals[selected_financial_year.year].targetInvestmentValue/exchange_rate)})`
                                            }
                                        </p>
                                    </CardContent>
                                }
                            </Card>
                        </div>
                        
                        <div className="md:col-span-2">
                            <Card className="md:col-span-2">
                                
                                <CardHeader>
                                    <CardTitle className="text-md">Status</CardTitle>
                                </CardHeader>
                                
                                <CardContent>
                                    <Table>
                                        <TableBody> 
                                            <TableRow>
                                                <TableCell>PnL Delta</TableCell>
                                                <TableCell className="font-bold">
                                                    $ {formatAmount(overview_data.absoluteReturnUSD - goals[selected_financial_year.year].targetPnL)}
                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    
                    </div>
                </div>
            }
            
        </TabsContent>
    );
}