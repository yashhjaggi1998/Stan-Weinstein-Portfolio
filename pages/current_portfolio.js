import clientPromise from "../lib/mongodb";
import {
    Container, 
    VStack, 
    Heading, 
    Table,  
    Tbody, 
    Td, 
    Th, 
    Thead,
    Tr,
    Text,
    Box,
    HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/loading-spinner";
import NavBar from "./components/NavBar";

export default function CurrentPortfolio({ holdings, indices, closed_positions }) {

    const [holdingsData, setHoldingsData] = useState([]);
    const [indicesData, setIndicesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {

        setIsLoading(true);

        let temp_arr = [];
        let usd_inr_exchange_rate = 83.5;

        let total_pnl = 0;
        let total_amount_invested = 0;
        for (let pos of closed_positions) 
        {
            let diff = pos.close_price - pos.buy_price;
            total_pnl += parseFloat(parseFloat(diff*pos.quantity).toFixed(2));
        }

        //iterate through holdings array and create a combined string of all tickers which is comma separated
        let tickers = new Set();
        for (let i = 0; i < holdings.length; i++){
            tickers.add(holdings[i].ticker.toUpperCase());
        }

        //fetch CMP for all the tickers
        let cmpList = await fetchCMP(tickers);
        console.log("CMP List");
        console.log(cmpList);
        
        //iterate through holdings array and calculate pnl for each holding
        for (let i = 0; i < holdings.length; i++) 
        {
            let row = {};
            let cmp = cmpList[holdings[i].ticker.toUpperCase()];

            row.ticker = holdings[i].ticker.toUpperCase();
            row.quantity = holdings[i].quantity;
            row.buy_price = holdings[i].buy_price;
            row.amount_invested = parseFloat(row.quantity * row.buy_price).toFixed(2);
            row.CMP = cmp;
            row.pnl = parseFloat(parseFloat((row.CMP - row.buy_price) * row.quantity).toFixed(2));
            row.pnl_percentage = parseFloat(parseFloat((row.pnl / row.amount_invested)*100).toFixed(2));
            temp_arr.push(row);

            total_amount_invested += parseFloat(row.amount_invested);
            total_pnl += row.pnl;
        }

        //To calculate %amount invested
        for (let i = 0; i < temp_arr.length; i++) {
            temp_arr[i].percentage_amount_invested = parseFloat((temp_arr[i].amount_invested / total_amount_invested)*100).toFixed(2);
        }

        temp_arr.sort((a, b) => (b.pnl_percentage > a.pnl_percentage) ? 1 : -1);
        temp_arr.push({
            pnl_percentage: parseFloat(parseFloat((total_pnl/total_amount_invested)*100).toFixed(2)),
            pnl: parseFloat(total_pnl).toFixed(2),
            amount_invested: parseFloat(total_amount_invested).toFixed(2),
            ticker: "Total(₹)",
            
        });
        
        temp_arr.push({
            ticker: "Total($)",
            pnl_percentage: parseFloat((total_pnl / total_amount_invested)*100).toFixed(2),
            amount_invested: parseFloat(total_amount_invested/usd_inr_exchange_rate).toFixed(2),
            pnl: parseFloat(total_pnl/usd_inr_exchange_rate).toFixed(2),
        });
        
        let indices = [];

        setHoldingsData(temp_arr);
        setIndicesData(indices);
        setIsLoading(false);
    }, []);

    const fetchCMP = async (tickerSet) => {
        try {
            let cmpList = {};
            let url = `/api/fetch_current_market_price`;
            const response = await fetch(url);
            const result = await response.json();
            console.log(result[0]);

            for (let i = 0; i < result.length; i++) {
                let ticker = result[i].Symbol;

                if (tickerSet.has(ticker)) {
                    let price = result[i].LTP;
                    cmpList[ticker] = price;
                }
            }
            return cmpList;
            
        } catch (error) {
            throw error;
        }
    };
    
    return (
        <>
            <Helmet>
                <title>Current Positions</title>
                <meta name="description" content="Current Positions" />
            </Helmet>

            <NavBar />

            <Container maxW='container.xl'>

                <VStack spacing={3} mb={8}>

                    <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                        Current Portfolio
                    </Heading>
                    
                </VStack>
                
                    { isLoading && indices && holdingsData ? <LoadingSpinner /> :

                        <Box overflowX='scroll'>
                       
                            <HStack spacing={3} mb={8}>
                                {indicesData.map((index) => (
                                    <Text color='green.500'>
                                        <b>{index.name}</b> - {index.price}
                                    </Text>
                                ))}
                            </HStack>

                            <Table variant='striped' colorScheme='gray'>
                                <Thead>
                                    <Tr>
                                        <Th>Ticker</Th>
                                        <Th>% P&L</Th>
                                        <Th>% Amnt Invested</Th>
                                        <Th>QTY</Th>
                                        <Th>Profit N Loss</Th>
                                        <Th>Amnt Invested</Th>
                                        <Th>CMP</Th>
                                        <Th>Buy Price</Th>
                                    </Tr>
                                </Thead>  
                                <Tbody>
                                    {holdingsData.map((holding) => (
                                        <Tr>
                                            <Td fontWeight={holding.ticker === "Total($)" || holding.ticker === "Total(₹)" ? "bold" : ""}   >
                                                {holding.ticker.toUpperCase()}
                                            </Td>
                                            <Td 
                                                color={holding.pnl_percentage >= 0 ? "green" : "red"}
                                                fontWeight={"bold"}
                                            >
                                                {holding.pnl_percentage} %
                                            </Td>
                                            <Td 
                                                fontWeight = {holding.percentage_amount_invested >= 10 ? "bold" : "" }
                                            >
                                                {holding.percentage_amount_invested}
                                            </Td>
                                            <Td>{holding.quantity}</Td>
                                            <Td 
                                                color={holding.pnl >= 0 ? "green" : "red"}
                                                fontWeight={"bold"}
                                            >
                                                {holding.pnl}
                                            </Td>
                                            <Td
                                                color={holding.pnl_percentage >= 0 ? "green" : "red"}
                                                fontWeight={"bold"}
                                            >
                                                {holding.amount_invested}
                                            </Td>
                                            <Td>{holding.CMP}</Td>
                                            <Td>{holding.buy_price}</Td>      
                                        </Tr>
                                    ))}   
                                </Tbody>
                            </Table>
                        
                        </Box>
                    }
            </Container>
        </>
    );
}

export async function getServerSideProps() {
    
    try 
    {
        const client = await clientPromise;
        const database = client.db('WeeklyTimeFrame');

        const holdings = await database.collection('Active Portfolio').find({}).toArray();

        const closed_positions = await database.collection('Closed Positions').find({}).toArray();

        return {
            props: { 
                holdings: JSON.parse(JSON.stringify(holdings)),
                closed_positions: JSON.parse(JSON.stringify(closed_positions)),
                indices: JSON.parse(JSON.stringify([])),
            },
        };
    } 
    catch (e) {
        console.error(e);
    }
}