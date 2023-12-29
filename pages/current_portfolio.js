import clientPromise from "../lib/mongodb";
import {
    Container, 
    VStack, 
    Heading, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead,
    Tr,
    Text,
    HStack
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/loading-spinner";

const cheerio = require('cheerio');

export default function CurrentPortfolio({ holdings, indices, closed_positions, total_amount_invested = 1 }) {

    const [holdingsData, setHoldingsData] = useState([]);
    const [closedPositionsData, setClosedPositionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        setIsLoading(true);

        let temp_arr = [];

        let total_pnl = 0;
        let total_amount_invested = 0;
        for (let pos of closed_positions) 
        {
            let diff = pos.close_price - pos.buy_price;
            total_pnl += parseFloat(parseFloat(diff*pos.quantity).toFixed(2));
        }

        for (let i = 0; i < holdings.length; i++) 
        {
            let row = {};
            let cmp = await fetchCMP(holdings[i].ticker);

            row.ticker = holdings[i].ticker;
            row.quantity = holdings[i].quantity;
            row.buy_price = holdings[i].buy_price;
            row.amount_invested = parseFloat(row.quantity * row.buy_price).toFixed(2);
            total_amount_invested += parseFloat(row.amount_invested);

            row.CMP = cmp;
            row.pnl = parseFloat(parseFloat((row.CMP - row.buy_price) * row.quantity).toFixed(2));
            row.pnl_percentage = parseFloat(parseFloat((row.pnl / row.amount_invested)*100).toFixed(2));
            temp_arr.push(row);

            total_pnl += row.pnl;
        }

        temp_arr.sort((a, b) => (b.pnl_percentage > a.pnl_percentage) ? 1 : -1);
        temp_arr.push({
            pnl_percentage: parseFloat(parseFloat((total_pnl/total_amount_invested)*100).toFixed(2)),
            pnl: parseFloat(total_pnl).toFixed(2),
            amount_invested: total_amount_invested,
            ticker: "Total(₹)",
            
        });

        setHoldingsData(temp_arr);
        setIsLoading(false);
    }, []);

    const fetchCMP = async (ticker) => {
        try {
            let url = `/api/fetch_current_market_price?symbol=${ticker}`;

            const response = await fetch(url);
            const result = await response.json();

            return result.CMP;
            
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

            <Container maxW='container.xl' centerContent>

                <VStack spacing={3} mb={8}>

                    <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                        Current Portfolio
                    </Heading>

                    <HStack spacing={6}>
                        {indices.map((index) => (
                            <Text color='green.500'>
                                <b>{index.name}</b> - {index.price}
                            </Text>
                        ))}
                    </HStack>
                    
                </VStack>
                
                { isLoading ? <LoadingSpinner /> :
                    <TableContainer>
                        <Table variant='striped' colorScheme='gray' size='lg' >
                            <Thead>
                                <Tr>
                                    <Th>Ticker</Th>
                                    <Th>Profit N Loss</Th>
                                    <Th>% P&L</Th>
                                    <Th>CMP</Th>
                                    <Th>Buy Price</Th>
                                    <Th>Amount Invested</Th>
                                    <Th>QTY</Th>
                                </Tr>
                            </Thead>  
                            <Tbody>
                                {holdingsData.map((holding) => (
                                    <Tr>
                                        <Td fontWeight={holding.ticker === "Total(₹)" ? "bold" : ""}   >
                                            {holding.ticker.toUpperCase()}
                                        </Td>
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
                                            {holding.pnl_percentage} %
                                        </Td>
                                        <Td>{holding.CMP}</Td>
                                        <Td>{holding.buy_price}</Td>
                                        <Td
                                            color={holding.pnl_percentage >= 0 ? "green" : "red"}
                                            fontWeight={"bold"}
                                        >
                                            {holding.amount_invested}
                                        </Td>
                                        <Td>{holding.quantity}</Td>                
                                    </Tr>
                                ))}   
                            </Tbody>
                        </Table>
                    </TableContainer>
                }
            </Container>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const database = client.db('WeeklyTimeFrame');

        const holdings = await database
            .collection('Active Portfolio')
            .find({})
            .toArray();

        const closed_positions = await database
            .collection('Closed Positions')
            .find({})
            .toArray();

        /*
        let total_amount_invested = 0;

        for (let i = 0; i < holdings.length; i++) 
        {

            holdings[i].amount_invested = qty * buy_price;
            holdings[i].pnl = parseFloat(parseFloat((current_price - buy_price)*qty).toFixed(2));
            holdings[i].pnl_percentage = parseFloat(parseFloat((holdings[i].pnl / holdings[i].amount_invested)*100).toFixed(2));

            total_pnl += holdings[i].pnl;
            total_amount_invested += holdings[i].amount_invested;
        }

        holdings.sort((a, b) => (b.pnl_percentage > a.pnl_percentage) ? 1 : -1);

        let usd_inr_exchange_rate = await scraperWeb("INR=X");
        holdings.push({
            ticker: "Total($)",
            quantity: "",
            buy_price: "",
            CMP: "",
            pnl_percentage: parseFloat(parseFloat((total_pnl / total_amount_invested)*100).toFixed(2)),
            pnl: parseFloat(total_pnl/usd_inr_exchange_rate).toFixed(2),
        });
    
        let indices = [];
        const nifty_50 = await scraperWeb("^NSEI");
        const bank_nifty = await scraperWeb("^NSEBANK");
        indices.push({ 'name': 'Nifty 50', 'price': nifty_50});
        indices.push({ 'name': 'Bank Nifty', 'price': bank_nifty});
        console.log(indices);*/
        
        return {
            props: { 
                holdings: JSON.parse(JSON.stringify(holdings)),
                closed_positions: JSON.parse(JSON.stringify(closed_positions)),
                indices: JSON.parse(JSON.stringify([])),
            },
        };
    } catch (e) {
        console.error(e);
    }
}

async function scraperWeb(symbol)
{
    try {

        let url = `https://finance.yahoo.com/quote/${symbol}/`;
        console.log(url);
        const response = await fetch(url);
        const result = await response.text();

        const $ = cheerio.load(result);
        const priceElement = $("#quote-header-info").find('fin-streamer[class="Fw(b) Fz(36px) Mb(-4px) D(ib)"]');
        const price = priceElement.text().trim();
        const index = price.indexOf(".");
        const formattedPrice = price.substring(0, index) + "." + price.substring(index + 1, index + 3);
        
        return formattedPrice;
    
    } catch (error) {
        throw error;
    }
    
}