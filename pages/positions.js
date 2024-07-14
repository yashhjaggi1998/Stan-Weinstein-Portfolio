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
    Icon,
} from "@chakra-ui/react";
import clientPromise from "../lib/mongodb";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/loading-spinner";
import StockPrice from "./components/StockPrice";


export default function Positions({ holdings, indices }) {

    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {

        for (let i = 0; i < holdings.length; i++) 
        {
            console.log("Fetching CMP for " + holdings[i].ticker);
        }
    }, []);

    return (
        <Container maxW="container.xl" centerContent>
            <Helmet>
                <title>Live - Current Portfolio</title>
            </Helmet>
            <VStack>
                <Heading as="h1" size="xl" textAlign="center">Current Portfolio</Heading>

                <Table variant="striped" colorScheme="teal" size="md">
                    <Thead>
                        <Tr>
                            <Th>Ticker</Th>
                            <Th>Price</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {holdings.length > 0 ? (
                            holdings.map((holding) => (
                                <StockPrice symbol={holding.ticker} />
                        ))) : null}
                    </Tbody>
                </Table>
                
            </VStack>
        </Container>
    );
}

export async function getServerSideProps() {
    
    try 
    {
        const client = await clientPromise;
        const database = client.db('WeeklyTimeFrame');

        const holdings = await database.collection('Active Portfolio').find({}).toArray();

        return {
            props: { 
                holdings: JSON.parse(JSON.stringify(holdings)),
                indices: JSON.parse(JSON.stringify([])),
            },
        };
    } 
    catch (e) 
    {
        console.error(e);
    }
}