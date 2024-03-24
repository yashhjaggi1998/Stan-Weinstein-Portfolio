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
} from "@chakra-ui/react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

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
        
        setEndOfYearNetWorth(temp_arr);
    };
    
    return (
        <>
            <Helmet>
                <title>Compound Interest Calculator</title>
            </Helmet>
                
            <ResponsiveContainer width="100%" aspect={4}>

                <HStack maxW="80%" marginLeft="15%">
                    <VStack spacing={4} maxW={"50%"}>
                        <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                            Compound Interest Calculator
                        </Heading>

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

                    <Table maxW={"50%"}>
                        <Thead>
                            <Tr>
                                <Th>Year</Th>
                                <Th>Amount(Lakhs)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {endOfYearNetWorth.map((item, index) => (
                                <Tr>
                                    <Td>{item.year}</Td>
                                    <Td>{parseFloat(item.amount / 100000).toFixed(2)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </HStack>
                

                <LineChart data={endOfYearNetWorth} width={800} height={400}>
                    <CartesianGrid />
                    <XAxis dataKey="year" interval={"preserveStartEnd"} />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line dataKey="amount" stroke="red" activeDot={{ r: 6 }} />
                </LineChart>

            </ResponsiveContainer>
        </>
    );
}