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
import { PieChart, Pie, Cell } from 'recharts';


export default function FundamentalPortfolio({ holdings, indices, closed_positions, total_amount_invested = 1 }) {

    const data = [
        { stock: 'ADANIPORTS', amount_invested: 10249.95 },
        { stock: 'CDSL', amount_invested: 15630.36 },
        { stock: 'GAIL', amount_invested: 38186.25 },
        { stock: 'HCLTECH', amount_invested: 5764.05 },
        { stock: 'HDFCBANK', amount_invested: 49801.6 },
        { stock: 'HINDUNILVR', amount_invested: 39480.12 },
        { stock: 'INDIACEM', amount_invested: 7746 },
        { stock: 'INDUSTOWER', amount_invested: 21163.8 },
        { stock: 'MUTHOOTFIN', amount_invested: 22746.8 },
        { stock: 'RPOWER', amount_invested: 1128 },
        { stock: 'SBIN', amount_invested: 6661.72 },
        { stock: 'SIS', amount_invested: 10175.76 },
        { stock: 'SJVN', amount_invested: 7119.36 },
        { stock: 'TECHM', amount_invested: 28738 },
        { stock: 'WIPRO', amount_invested: 11133 }
    ];

    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042"];

    
    return (
        <>
            <Helmet>
                <title>Fundamental Portfolio</title>
                <meta name="description" content="Fundamental Portfolio" />
            </Helmet>

            <Container maxW='container.xl' centerContent>

                <VStack spacing={3} mb={8}>

                    <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                        Fundamental Portfolio
                    </Heading>

                    <PieChart width={700} height={700}>
                        <Pie data={data} dataKey="amount_invested" innerRadius={100} outerRadius={250}>
                            {data.map((entry, index) => (
                                <Cell
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                    
                </VStack>
                
               
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