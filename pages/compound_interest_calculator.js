import { Helmet } from "react-helmet";
import { 
    VStack, 
    Heading,
    Input,
    Button,
    HStack,
    Center,
    Flex,
    Container,
    Grid,
    FormControl,
    FormLabel,
    Box,
    Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import LoadingSpinner from "./components/loading-spinner";
import { 
    Navbar,
    Nav,
 } from "react-bootstrap";
 import "bootstrap/dist/css/bootstrap.min.css";

export default function CompoundInterestCalculator() {

    const [endOfYearNetWorth, setEndOfYearNetWorth] = useState([]);

    const chart_options = {
        title: 'Annual Compound Interest',
        legend: { position: 'bottom' },
        hAxis: {
            title: 'Year',
        },
        vAxis: {
            title: 'Amount',
            format: 'short',
        },
    };

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

    return (
        <>
            <Helmet>
                <title>Compound Interest Calculator</title>
            </Helmet>

            <Navbar fixed="top" bg="white" className="ps-4 pt-1 pb-0">

                <Navbar.Brand>
                    <img
                        alt="YJ Brand"
                        src="YJ1.png"
                        width="90"
                        height="100"
                        className="align-top"
                    />
                </Navbar.Brand>
            </Navbar>

            <Flex 
                justifyContent="space-between" 
                alignItems="flex-start" 
                height="100vh" 
                marginTop={"90px"} 
                className="px-5"
            >
                
                <Box w="25%" p="20px" bg="gray.100" className="mx-2">
                    
                    <Heading as="h4" size="sm" color="black.500">
                        Calculate Compound Interest
                    </Heading>

                    <Divider />

                    <FormControl mb="10px">
                        <FormLabel className="text-muted">Principal</FormLabel>
                        <Input id="principal_amount" type="number" placeholder="Amount at Year 0" className="rounded-0 border border-secondary"/>
                    </FormControl>

                    <FormControl mb="10px">
                        <FormLabel className="text-muted">Interest Rate</FormLabel>
                        <Input id="interest_rate" type="number" placeholder="Interest Rate" className="rounded-0 border border-secondary"/>
                    </FormControl>

                    <FormControl mb="10px">
                        <FormLabel className="text-muted">Time Period</FormLabel>
                        <Input id = "time_period" type="number" placeholder="Time Period (in years)" className="rounded-0 border border-secondary"/>
                    </FormControl>

                    <br />

                    <Button colorScheme="blue" size="md" onClick={handleSubmit}>
                        Calculate
                    </Button> 

                </Box>

                <Box w="75%" p="20px" bg="gray.200" className="mx-2">

                    {
                        endOfYearNetWorth.length > 0 ? (
                            <Chart
                                width={'100%'}
                                height={'80vh'}
                                chartType="LineChart"
                                loader={<LoadingSpinner />}
                                data={[
                                    ['Year', 'Amount'],
                                    ...endOfYearNetWorth.map((item) => [item.year, parseFloat(item.amount)]),
                                ]}
                                options={chart_options}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        ) : null
                    }
                </Box>
            </Flex>

        </>
    );
}