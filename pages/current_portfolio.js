import clientPromise from "../lib/mongodb";
import {
    Container, 
    Table, 
    TableCaption, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead,
    Tr
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";

const cheerio = require('cheerio');

export default function CurrentPortfolio({ holdings }) {
    
    return (
        <>
            <Helmet>
                <title>Stan Weinstein Portfolio</title>
            </Helmet>

            <Container maxW='container.xl' centerContent>
                
                <TableContainer>
                    <Table variant='striped' colorScheme='gray' size='lg' >
                        <TableCaption>
                            <Text fontSize='2xl' fontWeight='bold' color='blue.500'>
                                Current Portfolio
                            </Text>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Ticker</Th>
                                <Th>Quantity</Th>
                                <Th>Buy Price</Th>
                                <Th>Current Price</Th>
                                <Th>Profit N Loss</Th>
                                <Th>Percent P&L</Th>
                            </Tr>
                        </Thead>  
                        <Tbody>
                            {holdings.map((holding) => (
                                <Tr>
                                    <Td>{holding.ticker}</Td>
                                    <Td>{holding.quantity}</Td>
                                    <Td>{holding.buy_price}</Td>
                                    <Td>{holding.CMP}</Td>
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
                                </Tr>
                            ))}   
                        </Tbody>
                    </Table>

                </TableContainer>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    try {
        const client = await clientPromise;
        const database = client.db('WeeklyTimeFrame');

        const holdings = await database
            .collection('Active Portfolio')
            .find({})
            .toArray();

        let total_pnl = 0;
        let total_amount_invested = 0;
        for (let i = 0; i < holdings.length; i++) 
        {
            let buy_price = holdings[i].buy_price;
            let qty = holdings[i].quantity;

            const ticker = holdings[i].ticker;
            let current_price = await scraperWeb(ticker + ".NS");
            current_price = parseFloat(current_price.replace(/,/g, ''));
            holdings[i].CMP = current_price;

            holdings[i].amount_invested = qty * buy_price;
            holdings[i].pnl = parseFloat(parseFloat((current_price - buy_price)*qty).toFixed(2));
            holdings[i].pnl_percentage = parseFloat(parseFloat((holdings[i].pnl / holdings[i].amount_invested)*100).toFixed(2));

            total_pnl += holdings[i].pnl;
            total_amount_invested += holdings[i].amount_invested;
        }

        holdings.sort((a, b) => (b.pnl_percentage > a.pnl_percentage) ? 1 : -1);

        holdings.push({
            ticker: "Total",
            quantity: "",
            buy_price: "",
            CMP: "",
            pnl: parseFloat(total_pnl.toFixed(2)),
            pnl_percentage: parseFloat(parseFloat((total_pnl / total_amount_invested)*100).toFixed(2))
        });
        console.log(holdings);
    
        return {
            props: { holdings: JSON.parse(JSON.stringify(holdings)) },
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