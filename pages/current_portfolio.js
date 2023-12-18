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
import { Helmet } from "react-helmet";

const cheerio = require('cheerio');

export default function CurrentPortfolio({ 
    holdings, 
    total_amount_invested,
    indices, }) {
    
    return (
        <>
            <Helmet>
                <title>Stan Weinstein Portfolio</title>
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
                
                <TableContainer>
                    <Table variant='striped' colorScheme='gray' size='lg' >
                        <Thead>
                            <Tr>
                                <Th>Ticker</Th>
                                <Th>Profit N Loss</Th>
                                <Th>% P&L</Th>
                                <Th>% Invested</Th>
                                <Th>QTY</Th>
                                <Th>Buy Price</Th>
                                <Th>CMP</Th>
                            </Tr>
                        </Thead>  
                        <Tbody>
                            {holdings.map((holding) => (
                                <Tr>
                                    <Td fontWeight={holding.ticker === "Total($)" ? "bold" : ""}>
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
                                    <Td>{parseFloat(100*holding.amount_invested/total_amount_invested).toFixed(2)}</Td>
                                    <Td>{holding.quantity}</Td>
                                    <Td>{holding.buy_price}</Td>
                                    <Td>{holding.CMP}</Td>
                                    
                                </Tr>
                            ))}   
                        </Tbody>
                    </Table>

                </TableContainer>
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
        //console.log(closed_positions);

        let total_pnl = 0;
        let total_amount_invested = 0;
        for (let i = 0; i < closed_positions.length; i++) 
        {
            let diff = closed_positions[i].close_price - closed_positions[i].buy_price;
            total_pnl += parseFloat(parseFloat(diff*closed_positions[i].quantity).toFixed(2));
        }

        for (let i = 0; i < holdings.length; i++) 
        {
            let buy_price = holdings[i].buy_price;
            let qty = holdings[i].quantity;

            /*const ticker = holdings[i].ticker;
            let current_price = await scraperWeb(ticker + ".NS");
            current_price = parseFloat(current_price.replace(/,/g, ''));
            holdings[i].CMP = current_price;*/

            holdings[i].amount_invested = qty * buy_price;
            //holdings[i].pnl = parseFloat(parseFloat((current_price - buy_price)*qty).toFixed(2));
            //holdings[i].pnl_percentage = parseFloat(parseFloat((holdings[i].pnl / holdings[i].amount_invested)*100).toFixed(2));

            //total_pnl += holdings[i].pnl;
            total_amount_invested += holdings[i].amount_invested;
        }

        holdings.sort((a, b) => (b.pnl_percentage > a.pnl_percentage) ? 1 : -1);

        /*let usd_inr_exchange_rate = await scraperWeb("INR=X");
        holdings.push({
            ticker: "Total($)",
            quantity: "",
            buy_price: "",
            CMP: "",
            pnl_percentage: parseFloat(parseFloat((total_pnl / total_amount_invested)*100).toFixed(2)),
            pnl: parseFloat(total_pnl/usd_inr_exchange_rate).toFixed(2),
        });*/
    
        let indices = [];
        /*const nifty_50 = await scraperWeb("^NSEI");
        const bank_nifty = await scraperWeb("^NSEBANK");
        indices.push({ 'name': 'Nifty 50', 'price': nifty_50});
        indices.push({ 'name': 'Bank Nifty', 'price': bank_nifty});
        console.log(indices);*/
        
        return {
            props: { 
                holdings: JSON.parse(JSON.stringify(holdings)), 
                total_amount_invested: total_amount_invested,
                indices: JSON.parse(JSON.stringify(indices)),
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