import { FinancialYear } from "@/types/FinancialYear";
import theme from "@/utils/theme";

import { DropdownList } from "@/components/custom/DropDownList";

import { CaretSortIcon, ShadowInnerIcon } from "@radix-ui/react-icons";

import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface MobileDropdownProps {
    selectedFinancialYear: FinancialYear | null;
    setSelectedFinancialYear: (selectedFinancialYear: FinancialYear | null) => void;
    isDrawerOpen: boolean;
    setDrawerOpen: (isDrawerOpen: boolean) => void;
}

export function MobileDropdown(props: MobileDropdownProps) {
    const {selectedFinancialYear, setSelectedFinancialYear, isDrawerOpen, setDrawerOpen} = props;

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline" 
                    role="combobox"
                    aria-expanded={isDrawerOpen}
                    className={`text-xl ${theme.background.tertiary} ${theme.border.primary} w-[200px] justify-between`}
                    onClick={() => setDrawerOpen(!isDrawerOpen)}
                >
                    <ShadowInnerIcon className="h-4 w-4 shrink-0 opacity-50" />
                    {selectedFinancialYear ? <>{selectedFinancialYear.year}</> : "Choose FY..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DropdownList 
                    setListOpen={setDrawerOpen} 
                    setSelectedValue={setSelectedFinancialYear}
                />
            </DrawerContent>
        </Drawer>
    );
}