import { HTTP_CODES } from "@/utils/constants/htttpCodes";

export function structureHoldings(holdings: any[], cmpList: Map<string, number>) {

    for(let i = 0; i < holdings.length; i++) {

        const ticker = holdings[i].ticker;
        const qty = holdings[i].quantity;
        const buy_price = holdings[i].buy_price;

        const _cmp = cmpList.get(ticker) || 0;
        if(_cmp <= 0) {
            throw {
                status: HTTP_CODES.NOT_FOUND,
                message: `CMP is lte 0 for ${ticker}`,
            };
        }
        
        const _pnl = parseFloat((qty*(_cmp - buy_price)).toFixed(2)); //Limit the float to 2 decimal places
        
        let _percentPnL = 100 * _pnl / (holdings[i].quantity * holdings[i].buy_price);
        _percentPnL = parseFloat(_percentPnL.toFixed(2));
        
        holdings[i] = {
            ...holdings[i],
            cmp: _cmp,
            pnl: _pnl,
            percentPnL: _percentPnL,
        }
    }
    return holdings;
}