const cheerio = require('cheerio');

export default async (req, res) => {
    
    try 
    {
        const symbol = req.query.symbol;
        let CMP = 0;
        if (symbol == "INR=X" || symbol == "^NSEI" || symbol == "^NSEBANK")
            CMP = await scraperWeb(symbol);
        else
            CMP = await scraperWeb(symbol + ".NS");
 
        res.status(200).json({ 'CMP': CMP });
 
    } catch (e) {
        console.error(e);
    }

};

async function scraperWeb(symbol)
{
    try {

        let url = `https://finance.yahoo.com/quote/${symbol}/`;
        console.log(url);
        const response = await fetch(url);
        const result = await response.text();

        const $ = cheerio.load(result);
        const priceElement = $("#quote-header-info").find('fin-streamer[class="Fw(b) Fz(36px) Mb(-4px) D(ib)"]');
        const price = priceElement.text().trim();
        const index = price.indexOf(".");
        const formattedPrice = price.substring(0, index) + "." + price.substring(index + 1, index + 3);

        return parseFloat(formattedPrice.replace(/,/g, ''));
    
    } catch (error) {
        throw error;
    }
    
}