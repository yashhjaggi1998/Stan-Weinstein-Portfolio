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
import { SlArrowRight } from "react-icons/sl";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger
} from "@/components/ui/drawer";
import { useState } from "react";

interface ActiveHoldingsTabProps {
    activeHoldings: any;
    selectedFinancialYear: FinancialYear;
}

function formatAmount(amount: number) {
    return parseFloat((amount).toFixed(2)).toLocaleString();
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
                                    {formatAmount(holding.percentPnL)}
                                </TableCell>
                                <TableCell>
                                    {30}
                                </TableCell>
                                <TableCell>
                                    ₹ {formatAmount(holding.pnl)}
                                </TableCell>
                                <TableCell>
                                    ₹ {formatAmount(holding.quantity * holding.buy_price)}
                                </TableCell>
                                <TableCell>
                                    ₹ {holding.cmp}
                                </TableCell>
                                <TableCell>
                                    ₹ {formatAmount(holding.buy_price)}
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

export function MobileActiveTab(props: ActiveHoldingsTabProps) {

    const {activeHoldings, selectedFinancialYear} = props;
    const [openDetailHolding, setOpenDetailHolding] = useState(false);
    const [selectedHolding, setSelecetedHolding] = useState<any | null>(null);
    
    return (
        <>
            {activeHoldings && ( 
                <Table className="text-center">

                    {selectedFinancialYear && (
                        <TableCaption className="font-bold text-sm mt-5">
                            List of Active holdings for {selectedFinancialYear.year}
                        </TableCaption>
                    )}

                    <TableHeader className="border-b-2">
                        <TableRow className="text-md h-12">
                            <TableHead className="text-start"></TableHead>
                            <TableHead>%PnL</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {activeHoldings.map((holding: any) => (
                            <TableRow 
                                key={holding._id}
                                className={`border-0 hover:bg-slate-200 h-14 font-bold text-md align-middle`}
                                onClick={() => {
                                    console.log(holding)
                                    setOpenDetailHolding(true)
                                    setSelecetedHolding(holding)
                                }}
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
                                <TableCell className={`font-bold ${holding.percentPnL >= 25 ? "text-green-700" : holding.percentPnL < -10 ? "text-red-800" : "text-blue-900"} `}>
                                    {formatAmount(holding.percentPnL)}
                                </TableCell>
                                <TableCell>
                                    <SlArrowRight size={20} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            )}

            {selectedHolding && 
                <Drawer open={openDetailHolding} onOpenChange={setOpenDetailHolding}>
                    <DrawerContent>
                        <div className="font-bold flex items-center space-x-4 m-4">
                            <Avatar>
                                <AvatarImage src={selectedHolding.logo_url} alt={selectedHolding.ticker} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p>
                                {selectedHolding.ticker} {" "}
                                <Badge className={`font-bold text-xs ${selectedHolding.percentPnL >= 25 ? "hover:bg-badgesuccess bg-badgesuccess text-green-900" : selectedHolding.percentPnL < -10 ? "hover:bg-badgewarning bg-badgewarning text-red-900" : "hover:bg-badgeinfo bg-badgeinfo text-blue-900"} `}>
                                    {selectedHolding.percentPnL >= 25 ? "STRONG" : selectedHolding.percentPnL < -10 ? "WEAK" : "MODERATE"}
                                </Badge>
                            </p>
                        </div>

                        <Table className="mx-4 my-2">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Percent PnL</TableCell>
                                    <TableCell className={`font-bold ${selectedHolding.percentPnL >= 25 ? "text-green-700" : selectedHolding.percentPnL < -10 ? "text-red-800" : "text-blue-900"}`}>
                                        {formatAmount(selectedHolding.percentPnL)}%
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>PnL</TableCell>
                                    <TableCell className={`font-bold ${selectedHolding.percentPnL >= 25 ? "text-green-700" : selectedHolding.percentPnL < -10 ? "text-red-800" : "text-blue-900"}`}>
                                        ₹ {formatAmount(selectedHolding.pnl)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Market Price</TableCell>
                                    <TableCell>
                                        {selectedHolding.cmp}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>
                                        {formatAmount(selectedHolding.quantity)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="font-bold mx-4 my-2">
                            Buy Info
                        </div>

                        <Table className="mx-4 my-2">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell>{selectedHolding.buy_price}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>{selectedHolding.buy_date}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>{selectedHolding.entry_stage}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DrawerContent>
                </Drawer>
            }
        </>
    );
}