export async function convertINRToUSD(amount: number) {
    const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=INR&to=USD&amount=${amount}`;
    const options = {
	    method: 'GET',
	    headers: {
		    'x-rapidapi-key': '8278d2b1a5mshdf7a6bbb62161d8p1e1246jsn47a7ba1f8495',
		    'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
	    }
    };

    try{
        if (amount <= 0) {
            throw new Error("Amount should be greater than 0");
        }
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.success && result.success === true) {
            return {'status': 'success', 'data': result.info.rate};
        }
        throw new Error("Failed to convert INR to USD");

    } catch(e: any){
        return {'status': 'error', 'message': e.message};
    }
}