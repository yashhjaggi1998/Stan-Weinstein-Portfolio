
//serail: df41f63d34mshde94a920c1b4968p18a23ejsnda507bf8ac3d
//trades: 8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495
export async function fetchPricesFromAPI() {
    
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
    console.log('All Prices: ', result);

    return result;
}