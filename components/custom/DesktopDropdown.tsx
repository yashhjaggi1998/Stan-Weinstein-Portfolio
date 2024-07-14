import { FinancialYear } from "@/utils/types/FinancialYear";
import theme from "@/utils/theme";
import { DropdownList } from "@/components/custom/DropDownList";

import { CaretSortIcon, ShadowInnerIcon } from "@radix-ui/react-icons";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DesktopDrowpdownProps {
    selectedFinancialYear: FinancialYear | null;
    setSelectedFinancialYear: (selectedFinancialYear: FinancialYear | null) => void;
    isDrawerOpen: boolean;
    setDrawerOpen: (isDrawerOpen: boolean) => void;
}

export function DesktopDrowpdown(props: DesktopDrowpdownProps) {
    
    const {selectedFinancialYear, setSelectedFinancialYear, isDrawerOpen, setDrawerOpen} = props;

    return (
        <Popover open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline" 
                    role="combobox"
                    aria-expanded={isDrawerOpen}
                    className={`text-xl ${theme.background.tertiary} ${theme.border.primary} w-[150px] justify-between`}
                    onClick={() => setDrawerOpen(!isDrawerOpen)}
                >
                    <ShadowInnerIcon className="h-4 w-4 shrink-0 opacity-50" />
                    {selectedFinancialYear ? <>{selectedFinancialYear.year}</> : "Choose FY..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <DropdownList 
                    setListOpen={setDrawerOpen} 
                    setSelectedValue={setSelectedFinancialYear}
                />
            </PopoverContent>
        </Popover>
    );
}