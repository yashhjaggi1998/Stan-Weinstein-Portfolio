/*
    API info:
    link: https://rapidapi.com/8000859059/api/live-indian-stock-price
    Account => yashhtrades: 8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495
*/

import { HTTP_CODES } from "../../../utils/constants/htttpCodes";

const apiKey = "8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495";

export async function fetchLivePrices(ticker: string) {
    if(ticker === "IBULHSGFIN") ticker = "SAMMAANCAP";

    const url = `https://live-indian-stock-price.p.rapidapi.com/api/v1/stock/${ticker}/NSE`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'live-indian-stock-price.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    if(!response.ok) {
        throw {
            status: HTTP_CODES.NOT_FOUND, 
            message: `Error Fetching Live Stock Price for ${ticker}`,
        };
    }
    const result = await response.json();

    return result.data;
}