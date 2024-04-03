import { 
    VStack, 
    Heading,
    Input,
    Button,
    HStack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { Helmet } from "react-helmet";
//import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Chart } from "react-google-charts";

export default function CompoundInterestCalculator() {

    const [endOfYearNetWorth, setEndOfYearNetWorth] = useState([]);

    const handleSubmit = () => {

        const principal_amount = parseFloat(document.getElementById("principal_amount").value);
        const interest_rate = document.getElementById("interest_rate").value;
        const time_period = document.getElementById("time_period").value;

        let amount = principal_amount;
        let temp_arr = [{year: 0, amount: amount}];

        for (let i = 1; i <= time_period; i++) {
            amount *=  1 + interest_rate/100;
            temp_arr.push({
                year: i,
                amount: amount.toFixed(2),
            });
            amount += principal_amount;
        }
        
        console.log(temp_arr);
        setEndOfYearNetWorth(temp_arr);
    };
    //Data column(s) for axis #0 cannot be of type string
    //Need to solve this issue

    return (
        <>
            <Helmet>
                <title>Compound Interest Calculator</title>
            </Helmet>

            <Center>
            <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                Compound Interest Calculator
            </Heading>
            </Center>
                

            <HStack spacing={8} w={"100%"}>
                
                <VStack spacing={8}>

                    <Input
                        id = "principal_amount"
                        type="number"
                        placeholder="Enter the amount at Year 0" 
                        size="lg" 
                    />

                    <Input
                        id = "interest_rate"
                        type="number"
                        placeholder="Enter the interest rate" 
                        size="lg"
                    />

                    <Input
                        id = "time_period"
                        type="number"
                        placeholder="Enter the time period (in years)" 
                        size="lg"
                    />

                    <Button colorScheme="blue" size="lg" onClick = {handleSubmit}>
                        Calculate
                    </Button>  

                </VStack>

            </HStack>
                    {
                        endOfYearNetWorth.length > 0 ? (
                        <Chart
                            chartType="LineChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Year', 'Amount'],
                                ...endOfYearNetWorth.map((item) => [item.year, parseFloat(item.amount)]),
                            ]}
                        options={{
                            hAxis: {
                                title: 'Year',
                            },
                            vAxis: {
                                title: 'Amount',
                            },
                        }}
                        rootProps={{ 'data-testid': '1' }}
                        />) : null
                    }

        </>
    );
}