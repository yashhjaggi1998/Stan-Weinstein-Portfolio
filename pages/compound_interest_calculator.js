import { Helmet } from "react-helmet";
import {  
    Heading,
    Input,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Box,
    Divider,
    Text,
} from "@chakra-ui/react";
import { 
    Navbar,
    Nav,
    NavDropdown,
} from "react-bootstrap";import { useState } from "react";
import { Chart } from "react-google-charts";
import LoadingSpinner from "./components/loading-spinner";
import NavBar from "./components/NavBar";

export default function CompoundInterestCalculator() {

    const [endOfYearNetWorth, setEndOfYearNetWorth] = useState([]);
    const nifty_annual_roi = 15;

    const chart_options = {
        title: 'Annual Compound Interest',
        legend: { position: 'top' },
        tooltip: { isHtml: true, trigger: 'focus' },
        hAxis: {
            title: 'Year',
        },
        vAxis: {
            title: 'Net Worth',
            format: 'short',
        },
        series: {
            0: { color: 'green', lineWidth: 2, pointSize: 0, lineDashStyle: [4, 4]},
            1: {color: 'blue', lineWidth: 2, lineDashStyle: [4, 4], pointSize: 0},
        },
    };

    //Format sales in lakhs and Crores
    const formatSales = (value) => 
    {   
        if (value > 10000000) {
            return (value / 10000000).toFixed(2) + ' Cr';
        }
        else if (value > 100000) {
            return (value / 100000).toFixed(2) + ' L';
        }
        else {
            return value;
        }   
    }; 

    const handleSubmit = () => {


        const principal_amount = parseFloat(document.getElementById("principal_amount").value);
        const interest_rate = document.getElementById("interest_rate").value;
        const time_period = document.getElementById("time_period").value;

        let amount = principal_amount;
        let nifty_amount = principal_amount;
        let temp_arr = [{year: 0, net_worth: amount, nifty_net_worth: amount}];

        for (let i = 1; i <= time_period; i++) 
        {
            amount *=  1 + interest_rate/100;
            nifty_amount *= 1 + nifty_annual_roi/100;

            temp_arr.push({ year: i, net_worth: amount.toFixed(2), nifty_net_worth: nifty_amount.toFixed(2)});
            
            amount += principal_amount;
            nifty_amount += principal_amount;
        }
        
        setEndOfYearNetWorth(temp_arr);
    };

    return (
        <>
            <Helmet>
                <title>Compound Interest Calculator</title>
            </Helmet>
            
            <NavBar />
            <Flex 
                justifyContent="space-between" 
                alignItems="flex-start" 
                height="100vh" 
                marginTop={"120px"} 
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

                    <Button className="bg-dark" colorScheme="blue" size="md" onClick={handleSubmit}>
                        Calculate
                    </Button> 

                    {
                        endOfYearNetWorth.length > 0 ? (
                            <Text className="mt-4 text-success fw-bold fs-6">
                                Mr. X, your net worth after {endOfYearNetWorth[endOfYearNetWorth.length - 1].year} years is ₹{formatSales(endOfYearNetWorth[endOfYearNetWorth.length - 1].net_worth)}
                            </Text>
                        ) : null
                    }

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
                                    ['Year', 'Your Net Worth', 'Underlying Index'],
                                    ...endOfYearNetWorth.map((item) => [item.year, parseFloat(item.net_worth), parseFloat(item.nifty_net_worth)]),
                                ]}
                                options={chart_options}
                            />
                        ) : null
                    }
                </Box>

            </Flex>

        </>
    );
}