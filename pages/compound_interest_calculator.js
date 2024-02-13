import {
    Container, 
    VStack, 
    Heading,
    Input,
    Button,
    List,
} from "@chakra-ui/react";
import { useState } from "react";
import { Helmet } from "react-helmet";

export default function CompoundInterestCalculator() {

    const [endOfYearNetWorth, setEndOfYearNetWorth] = useState([]);

    const handleSubmit = () => {
        let temp_arr = [];

        const principal_amount = parseFloat(document.getElementById("principal_amount").value);
        const interest_rate = document.getElementById("interest_rate").value;
        const time_period = document.getElementById("time_period").value;

        let amount = principal_amount;

        //alert(amount);
        for (let i = 1; i <= time_period; i++) 
        {
            amount *=  1 + interest_rate/100;
            if (amount > 100)
            {
                temp_arr.push("After Year " + i + ": " + (amount/100).toFixed(2) + " CR");
            }
            else
            {
                temp_arr.push("After Year " + i + ": " + amount.toFixed(2) + " LK");
            }
            amount += principal_amount;
        }
        
        setEndOfYearNetWorth(temp_arr);
    };
    
    return (
        <>
            <Helmet>
                <title>Compound Interest Calculator</title>
                <meta name="description" content="Current Positions" />
            </Helmet>

            <Container maxW='container.sm'>

                <VStack spacing={3} mb={8}>

                    <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                        Compound Interest Calculator
                    </Heading>

                    <Input
                        id = "principal_amount"
                        type="number"
                        placeholder="Enter the amount at Year 0 (in Lakhs)" 
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

                    <List>
                        {endOfYearNetWorth.map((year, index) => (
                            <li key={index}>{year}</li>
                        ))}
                    </List>
                    

                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick = {handleSubmit}
                    >
                        Calculate
                    </Button>

                    
                </VStack>
                
            </Container>
        </>
    );
}