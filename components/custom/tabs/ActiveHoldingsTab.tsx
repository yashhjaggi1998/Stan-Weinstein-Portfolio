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
                            <p>{selectedHolding.ticker}</p>
                            <Badge className={`font-bold text-xs ${selectedHolding.percentPnL >= 25 ? "hover:bg-badgesuccess bg-badgesuccess text-green-900" : selectedHolding.percentPnL < -10 ? "hover:bg-badgewarning bg-badgewarning text-red-900" : "hover:bg-badgeinfo bg-badgeinfo text-blue-900"} `}>
                                {selectedHolding.percentPnL >= 25 ? "STRONG" : selectedHolding.percentPnL < -10 ? "WEAK" : "MODERATE"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 mx-8 my-2">
                            <div className="grid gap-2">
                                <p>Percent PnL</p>
                                <p>PnL</p>
                                <p>Market Price</p>
                                <p>Quantity</p>
                            </div>
                            <div className="grid gap-2">
                                <p className={`font-bold ${selectedHolding.percentPnL >= 25 ? "text-green-700" : selectedHolding.percentPnL < -10 ? "text-red-800" : "text-blue-900"}`}>
                                    {formatAmount(selectedHolding.percentPnL)}%
                                </p>
                                <p className={`font-bold ${selectedHolding.percentPnL >= 25 ? "text-green-700" : selectedHolding.percentPnL < -10 ? "text-red-800" : "text-blue-900"}`}>
                                    ₹ {formatAmount(selectedHolding.pnl)}
                                </p>
                                <p>{selectedHolding.cmp}</p>
                                <p>{formatAmount(selectedHolding.quantity)}</p>
                            </div>
                        </div>

                        <div className="font-bold mx-6 mt-2">
                            Buy Info
                        </div>

                        <div className="grid grid-cols-2 mx-8 mt-2 mb-4">
                            <div className="grid gap-2">
                                <p>Price</p>
                                <p>Date</p>
                                <p>Reason</p>
                            </div>
                            <div className="grid gap-2">
                                <p>₹ {selectedHolding.buy_price}</p>
                                <p>₹ {selectedHolding.buy_date}</p>
                                <p>{selectedHolding.entry_stage}</p>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            }
        </>
    );
}