export function formatAmount(amount: number) {
    return parseFloat((amount).toFixed(2)).toLocaleString();
}