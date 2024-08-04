import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceCardProps {
    title: string,
    description?: string,
    content: string,
    subContent?: string,
    textColor?: string,
}

export function PerformanceCard(props: PerformanceCardProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-md">{props.title}</CardTitle>
                <CardDescription className="text-sm">{props.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold ${props.textColor}`}>
                    {props.content}
                </p>
                <p className="text-sm">
                    {props.subContent}
                </p>
            </CardContent>
        </Card> 
    );
}