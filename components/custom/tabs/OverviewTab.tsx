import { AnnualOverviewData } from "@/types/AnnualOverviewData";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import theme from "@/utils/theme";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
    overview_data: AnnualOverviewData;
}

export function OverviewTab(props: OverviewTabProps) {

    const { overview_data } = props;

    return (
        <TabsContent value="overview" className="mt-8">

            <h2 className="text-2xl font-bold">Performance</h2>

            <div className="grid md:grid-cols-5 gap-4 mt-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">ROI</CardTitle>
                        <CardDescription className="text-sm">Return on Amount Invested</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-2xl font-bold ${overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {overview_data.percentReturn >= 0 ? '+' : '-'} {overview_data.percentReturn.toLocaleString()}%
                        </span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">PnL</CardTitle>
                        <CardDescription className="text-sm">Profit or Loss</CardDescription>
                    </CardHeader>
                    <CardContent className={`text-2xl font-bold ${overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                        <span >
                            {overview_data.absoluteReturn >= 0 ? '+' : '-'} ₹{overview_data.absoluteReturn.toLocaleString()}{" "}
                            <span className="text-sm">(${overview_data.absoluteReturnUSD.toLocaleString()})</span>
                        </span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">Investment</CardTitle>
                        <CardDescription className="text-sm">Total Amount Invested</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-2xl font-bold`}>
                            ₹{overview_data.amountInvested.toLocaleString()}{" "}
                            <span className="text-sm">(${overview_data.amountInvestedUSD.toLocaleString()})</span>
                        </span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">Investment Value</CardTitle>
                        <CardDescription className="text-sm">Current Investment Value</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-2xl font-bold ${overview_data.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ₹{overview_data.currentInvestmentValue.toLocaleString()}{" "}
                            <span className="text-sm">(${overview_data.currentInvestmentValueUSD.toLocaleString()})</span>
                        </span>
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

            <h2 className="text-2xl font-bold mt-8">Goals</h2>

            <div className="grid md:grid-cols-5 gap-4 mt-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">Target</CardTitle>
                        <CardDescription className="text-sm">Target ROI</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-2xl font-bold ${theme.text.black}`}>
                            40%
                        </span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">Target</CardTitle>
                        <CardDescription className="text-sm">Target Investment Value</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-2xl font-bold ${theme.text.black}`}>
                            ₹1,000,000
                        </span>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
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
            </div>
            
        </TabsContent>
    );
}