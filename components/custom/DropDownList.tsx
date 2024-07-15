import { FinancialYear } from "@/types/FinancialYear";

import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";


const financialYears: FinancialYear[] = [
    {year: '2023'},
    {year: '2024'},
];

interface DropdownListProps {
    setListOpen: (listOpen: boolean) => void;
    setSelectedValue: (selectedValue: FinancialYear | null) => void;
}

export function DropdownList(props: DropdownListProps) {
    const {setListOpen, setSelectedValue} = props;

    return (
        <Command className="rounded-lg border shadow-md">
            <CommandList>
                <CommandGroup heading="Financial Years">
                    {financialYears.map((financialYear) => (
                        <div 
                            className="cursor-pointer hover:bg-slate-100 p-2"
                            onClick={(value) => {
                                setSelectedValue(financialYear);
                                setListOpen(false);
                            }}
                        >
                            {financialYear.year}
                        </div>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
