import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { GiBullseye } from "react-icons/gi";
import { PiChartLine } from "react-icons/pi";
import theme from "@/utils/theme";
import { AnnualOverviewData, FinancialYear, Goals } from "types";

interface OverviewTabProps {
    overview_data: AnnualOverviewData;
    exchange_rate: number;
    selected_financial_year: FinancialYear | null;
}

// JSON object to store goals for each financial year
const goals: { [key: string]: Goals  } = {
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

            <div id="performance" className="mt-8">
                <h2 className="text-2xl font-bold">
                    Performance <PiChartLine className="inline-block text-4xl font-bolder text-slate-500" stroke="2"/>
                </h2>

                <div className="grid md:grid-cols-5 gap-4 mt-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">ROI</CardTitle>
                            <CardDescription className="text-sm">Return on Amount Invested</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {formatAmount(overview_data.percentReturn)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">PnL</CardTitle>
                            <CardDescription className="text-sm">Profit and Loss</CardDescription>
                        </CardHeader>
                        <CardContent className={`${overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            <p className="text-2xl font-bold ">
                                ₹{formatAmount(overview_data.absoluteReturn)}{" "}
                            </p>
                            <p className="text-sm">
                                {`($ ${formatAmount(overview_data.absoluteReturnUSD)})`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">Current Investment</CardTitle>
                            <CardDescription className="text-sm">Value of Current Investment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ₹ {formatAmount(overview_data.currentInvestmentValue)}
                            </p>
                            <p className="text-sm">
                                ($ {formatAmount(overview_data.currentInvestmentValueUSD)})
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">Amount Invested</CardTitle>
                            <CardDescription className="text-sm">Value of Amount Invested</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ₹ {formatAmount(overview_data.amountInvested)}
                            </p>
                            <p className="text-sm">
                                ($ {formatAmount(overview_data.amountInvestedUSD)})
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md"># Holdings</CardTitle>
                            <CardDescription className="text-sm">Number of Active Holdings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span className={`text-2xl font-bold ${theme.text.black}`}>
                                {overview_data.numberOfHoldings}
                            </span>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div id="goals" className="mt-8">
               
                <h2 className="text-2xl font-bold">
                    Goals <GiBullseye className="inline-block text-4xl text-slate-500" />
                </h2>

                <div className="grid md:grid-cols-10 gap-4 mt-2">
                    
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-md">Returns</CardTitle>
                            <CardDescription className="text-sm">Target Returns { selected_financial_year && `- ${selected_financial_year.year}`}</CardDescription>
                        </CardHeader>
                        {selected_financial_year ? (
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">
                                        Percent
                                    </span>
                                    <span className="font-bold text-lg">
                                        {formatAmount(goals[selected_financial_year.year].targetRoi)}%
                                    </span>
                                </div>

                                <div className="flex justify-between mt-1">
                                    <span className="text-sm">
                                        Absolute
                                    </span>
                                    <div className="text-end">
                                        <p className="font-bold text-lg">
                                            ₹ {formatAmount(goals[selected_financial_year.year].targetPnL/exchange_rate)}
                                        </p>
                                        <p className="text-sm">
                                            ($ {formatAmount(goals[selected_financial_year.year].targetPnL)})
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                        ) : (
                            `N/A`
                        )}
                    </Card>

                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-md">Investment</CardTitle>
                            <CardDescription className="text-sm">Target Amount To Invest { selected_financial_year && `- ${selected_financial_year.year}`}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-xl font-bold text-black`}>
                                {exchange_rate && 
                                    exchange_rate !== 0 && 
                                    selected_financial_year?.year && 
                                    `₹ ${formatAmount(goals[selected_financial_year.year].targetInvestmentValue/exchange_rate)}`
                                }{" "}
                            </p>
                            <p className="text-sm">
                                {selected_financial_year?.year && `($ ${formatAmount(goals[selected_financial_year.year].targetInvestmentValue)})`}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <StatusCard />
                
                </div>
            
            </div>
            
        </TabsContent>
    );
}

function formatAmount(amount: number) {
    return parseFloat((amount).toFixed(2)).toLocaleString();
}

function StatusCard() {

    return (
        <Card className="md:col-span-3">
            
            <CardHeader>
                <CardTitle className="text-md">Status</CardTitle>
                <CardDescription className="text-sm">Are you on track?</CardDescription>
            </CardHeader>
            
            <CardContent>
                <Table>

                    <TableBody>
                        
                        <TableRow>
                            <TableCell>
                                PnL Delta
                            </TableCell>
                            <TableCell className="font-bold">
                                100
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Start Month
                            </TableCell>
                            <TableCell className="font-bold">
                                Apr 2023
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                End Month
                            </TableCell>
                            <TableCell className="font-bold">
                                Mar 2024
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Current Month
                            </TableCell>
                            <TableCell className="font-bold">
                                July 2024
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}