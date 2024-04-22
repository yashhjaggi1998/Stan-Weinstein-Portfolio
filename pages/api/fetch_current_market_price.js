export default async (req, res) => {
    
    try {
        const tickerList = req.query.tickerList;
        let finalResult = {};
        if (tickerList == "INR=X" || tickerList == "^NSEI" || tickerList == "^NSEBANK"){}
        else
        {
            const cmpList = await fetchStockPrice(tickerList);
            for (let priceObj of cmpList)
            {
                finalResult[priceObj.symbol] = priceObj.lastPrice;
            }
        }
 
        res.status(200).json(finalResult);
 
    } catch (e) {
        console.error(e);
    }
};

async function fetchStockPrice(tickerList)
{
    try 
    {
        const url = `https://latest-stock-price.p.rapidapi.com/price?Indices=NIFTY%20500&Identifier=${tickerList}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495',
                'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } 
    catch (error) {
        throw error;
    }
}