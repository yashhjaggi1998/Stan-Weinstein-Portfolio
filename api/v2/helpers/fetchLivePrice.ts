/*
    API info:
    link: https://rapidapi.com/8000859059/api/live-indian-stock-price
    Account => yashhtrades: 8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495
*/

import { HTTP_CODES } from "../../../utils/constants/htttpCodes";

const apiKey = "8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495";

export async function fetchLivePrices(ticker: string) {
    if(ticker === "IBULHSGFIN"){
        ticker = "SAMMAANCAP";
        return 169;
    }   

    const url = `https://live-indian-stock-price.p.rapidapi.com/api/v1/finance/stock/${ticker}/NSE`;
    console.log(url);
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'live-indian-stock-price.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);

    console.log("Raw response from API");
    console.log(response.url);
    console.log(response.status + ": " + response.statusText);

    if(!response.ok) {
        if(response.status === HTTP_CODES.TOO_MANY_REQUESTS){
            throw {
                status: HTTP_CODES.TOO_MANY_REQUESTS,
                message: `API Limit exceeded for ${ticker}`,
            }
        }

        throw {
            status: HTTP_CODES.NOT_FOUND, 
            message: `Error Fetching Live Stock Price for ${ticker}`,
        };
    }
    const result = await response.json();

    return result.data;
}