export type Goal = {
    targetRoi: number;
    targetPnL: number;
    targetInvestmentValue: number;
}

// JSON object to store goals for each financial year
export const goals: { [key: string]: Goal  } = {
    "2023": {
        targetRoi: 40,
        targetPnL: 400,
        targetInvestmentValue: 1000,
    },
    "2024": {
        targetRoi: 40,
        targetPnL: 5000,
        targetInvestmentValue: 12500,
    },
}
