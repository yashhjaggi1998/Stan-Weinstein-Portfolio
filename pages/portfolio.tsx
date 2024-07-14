import {useState} from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { FinancialYear } from "@/utils/types/FinancialYear";
import { DesktopDrowpdown } from "@/components/custom/DesktopDropdown";
import { MobileDropdown } from "@/components/custom/MobileDropDown";

export default function Portfolio() {

    const isDesktop = useMediaQuery("(min-width: 720px)");
    
    const [isDrawerOpen, setDrawerOpen] = useState(false); 
    const [ selectedFinancialYear, setSelectedFinancialYear ] = useState<FinancialYear | null>(null);

    return (
        <div className="overflow-hidden border rounded-md m-8 p-4">
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
    );
};




