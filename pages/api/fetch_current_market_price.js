export default async (req, res) => {
    try {
        const cmpList = await fetchPricesFromAPI();
        res.status(200).json(cmpList);
    } catch (e) {
        console.error(e);
    }
};

async function fetchPricesFromAPI() {
    try {
        const url = `https://latest-stock-price.p.rapidapi.com/equities`;
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