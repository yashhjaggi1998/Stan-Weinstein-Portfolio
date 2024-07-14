import { useState, useEffect } from "react";
import {
    Tr,
    Td,
    Table,
} from "@chakra-ui/react";


export default function StockPrice({ symbol }) {

    const [price, setPrice] = useState(null);
    const [prevPrice, setPrevPrice] = useState(0);
    const [ticker, setTicker] = useState(symbol);
  
    useEffect(() => {
        const fetchStockPrice = async () => {
            try {
                let url = 'https://latest-stock-price.p.rapidapi.com/price?Indices=NIFTY%20500';
                url += `&Identifier=${ticker.toUpperCase()}EQN`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495',
                        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
                    }
                };

                const response = await fetch(url, options);
                const price = await response.json();
                setPrice(price[0].lastPrice);

                if(prevPrice != price[0].lastPrice){
                    setPrevPrice(price[0].lastPrice);
                }
            } 
            catch (error) {
                console.error('Error fetching stock price:', error);
            }
        };
  
        const interval = setInterval(fetchStockPrice, 1000); // Fetch every 5 seconds
        fetchStockPrice(); // Initial fetch
        return () => clearInterval(interval); // Clean up interval

    }, [symbol]);
  
    return (
        <Table>
            <Tr>
                <Td>Stock Price ({symbol})</Td>
                <Td>{price !== null ? `₹${price}` : 'Loading...'}</Td>
            </Tr>
        </Table>
    );
};