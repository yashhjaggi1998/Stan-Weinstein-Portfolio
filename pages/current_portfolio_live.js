//import clientPromise from "../lib/mongodb";
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
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/loading-spinner";

const StockPrice = ({ symbol }) => {

    const [price, setPrice] = useState(null);
    const [prevPrice, setPrevPrice] = useState(0);
  
    useEffect(() => {
        const fetchStockPrice = async () => {
            try 
            {
                const url = 'https://latest-stock-price.p.rapidapi.com/price?Indices=NIFTY%20500&Identifier=CDSLEQN';
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495',
                        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
                    }
                };

                const response = await fetch(url, options);
                const price = await response.json();
                console.log("Price...");
                console.log(price);
                setPrice(price[0].lastPrice);

                if(prevPrice != price[0].lastPrice)
                {
                    setPrevPrice(price[0].lastPrice);
                }
            } 
            catch (error) {
                console.error('Error fetching stock price:', error);
            }
        };
  
        const interval = setInterval(fetchStockPrice, 5000); // Fetch every 5 seconds
        fetchStockPrice(); // Initial fetch
        return () => clearInterval(interval); // Clean up interval

    }, [symbol]);
  
    return (
        <div>
            <h2>Stock Price ({symbol}):</h2>
            <Icon name={prevPrice > price ? "chevron-down" : "chevron-up"} color={prevPrice > price ? "red" : "green"} />
            <span>{prevPrice > price ? "down" : "up"}</span>
            <p>{price !== null ? `₹${price}` : 'Loading...'}</p>
        </div>
    );
};


export default function CurrentPortfolioLive({ data }) {

    return (
        <Container maxW="container.xl" centerContent>
            <Helmet>
                <title>Live - Current Portfolio</title>
            </Helmet>
            <VStack>
                <Heading as="h1" size="xl" textAlign="center">Current Portfolio</Heading>
               
                <StockPrice symbol="AAPL" />
            </VStack>
        </Container>
    );
}