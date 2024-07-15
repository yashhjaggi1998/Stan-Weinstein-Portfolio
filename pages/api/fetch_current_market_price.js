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
                'X-RapidAPI-Key': 'df41f63d34mshde94a920c1b4968p18a23ejsnda507bf8ac3d',
                'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        return result;
    } 
    catch (error) {
        throw error;
    }
}