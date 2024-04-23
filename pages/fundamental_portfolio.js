
import {
    Container, 
    VStack, 
    Heading,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


export default function FundamentalPortfolio({ holdings, indices, closed_positions, total_amount_invested = 1 }) {

    const data = [
        { stock: 'ADANIPORTS', amount_invested: 10249.95, sector: 'Infrastructure' },
        { stock: 'CDSL', amount_invested: 15630.36, sector: 'Financial Services' },
        { stock: 'GAIL', amount_invested: 38186.25, sector: 'Gas' },
        { stock: 'HCLTECH', amount_invested: 5764.05, sector: 'IT' },
        { stock: 'HDFCBANK', amount_invested: 49801.6, sector: 'Financial Services' },
        { stock: 'SBIN', amount_invested: 6661.72, sector: 'Financial Services' },
        { stock: 'HINDUNILVR', amount_invested: 39480.12, sector: 'Consumer Goods' },
        { stock: 'INDIACEM', amount_invested: 7746, sector: 'Cement' },
        { stock: 'INDUSTOWER', amount_invested: 21163.8, sector: 'Telecom' },
        { stock: 'MUTHOOTFIN', amount_invested: 22746.8, sector: 'Financial Services' },
        { stock: 'SIS', amount_invested: 10175.76, sector: 'Security Services' },
        { stock: 'SJVN', amount_invested: 7119.36, sector: 'Power' },
        { stock: 'TECHM', amount_invested: 28738, sector: 'IT' },
        { stock: 'RPOWER', amount_invested: 1128, sector: 'Power' },
        { stock: 'WIPRO', amount_invested: 11133, sector: 'IT' },
    ];

    const COLORS = {"IT": "#8884d8", 
                    "Financial Services": "#82ca9d", 
                    "Gas": "#FFBB28", 
                    "Consumer Goods": "#FF8042",
                    "Cement": "#FF6384",
                    "Infrastructure": "#000",
                    "Telecom": "#FFCE56",
                    "Security Services": "#FF6384",
                    "Power": "#FFCE56",
                };

    const handleCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
        
        const RADIAN = Math.PI / 180;
        const radius = 35 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text
                x={x}
                y={y}
                fill="#8884d8"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                
                {data[index].stock} ({(percent * 100).toFixed(2)}%)<br/>
                ₹ {value.toLocaleString()}
            </text>
        );
    };

    
    return (
        <>
            <Helmet>
                <title>Fundamental Portfolio</title>
                <meta name="description" content="Fundamental Portfolio" />
            </Helmet>

            <ResponsiveContainer width="100%" height={700}>

                <PieChart width={700} height={700}>
                    <Pie 
                        data={data} 
                        cx = "50%"
                        cy = "50%"
                        innerRadius={100}
                        outerRadius={250}
                        dataKey = "amount_invested" 
                        label = {handleCustomLabel}
                    >
                        {data.map((entry, index) => (
                            <Cell fill={COLORS[data[index].sector]}/>
                        ))}
                    </Pie>
                </PieChart>
               
            </ResponsiveContainer>
        </>
    );
}