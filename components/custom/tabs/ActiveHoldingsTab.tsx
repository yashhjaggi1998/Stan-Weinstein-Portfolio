import { 
    Avatar, 
    AvatarImage,
    AvatarFallback, 
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableCaption, 
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell, 
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { FinancialYear } from "@/types";

interface ActiveHoldingsTabProps {
    activeHoldings: any;
    selectedFinancialYear: FinancialYear;
}

export function ActiveHoldingsTab(props: ActiveHoldingsTabProps) {

    const { activeHoldings, selectedFinancialYear } = props;

    return (
        <TabsContent value="active_holdings" className="grid grid-cols-6 gap-4 mt-6">
                            
            <div className="col-span-6">
                <Table className="text-center">
                    
                    {selectedFinancialYear && (
                        <TableCaption className="font-bold text-sm mt-5">
                            List of Active holdings for {selectedFinancialYear.year}
                        </TableCaption>
                    )}

                    <TableHeader className="border-b-2">
                        <TableRow className="text-md h-12">
                            <TableHead className="text-start"></TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>%PnL</TableHead>
                            <TableHead>%Invested</TableHead>
                            <TableHead>Absolute PnL (₹)</TableHead>
                            <TableHead>Invested (₹)</TableHead>
                            <TableHead>Cmp</TableHead>
                            <TableHead>Buy Price</TableHead>
                            <TableHead>Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeHoldings.map((holding: any) => (
                            <TableRow 
                                key={holding._id} 
                                className={`border-0 font-bold text-md font-bold hover:bg-slate-200 h-14`}
                            >
                                <TableCell className="items-center">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={holding.logo_url} alt={holding.ticker} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <span>
                                            {holding.ticker}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        className={`font-bold ${holding.percentPnL >= 25 ? "hover:bg-badgesuccess bg-badgesuccess text-green-900" : holding.percentPnL < -10 ? "hover:bg-badgewarning bg-badgewarning text-red-900" : "hover:bg-badgeinfo bg-badgeinfo text-blue-900"} `}>
                                        {
                                            holding.percentPnL >= 25 ? "STRONG" : 
                                            holding.percentPnL < -10 ? "WEAK" : 
                                            "MODERATE"
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className={`font-bold ${holding.percentPnL >= 25 ? "text-green-700" : holding.percentPnL < -10 ? "text-red-800" : "text-blue-900"} `}
                                >
                                    {holding.percentPnL}
                                </TableCell>
                                <TableCell>
                                    {30}
                                </TableCell>
                                <TableCell>
                                    ₹ {holding.pnl}
                                </TableCell>
                                <TableCell>
                                    ₹ {holding.quantity * holding.buy_price}
                                </TableCell>
                                <TableCell>
                                    ₹ {holding.cmp}
                                </TableCell>
                                <TableCell>
                                    ₹ {holding.buy_price}
                                </TableCell>
                                <TableCell>
                                    {holding.quantity}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </TabsContent>
    )
}