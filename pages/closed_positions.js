import {
    Container,
    Heading, 
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/loading-spinner";

export default function CurrentPortfolio() {

    
    return (
        <>
            <Helmet>
                <title>Stan Weinstein Portfolio</title>
            </Helmet>

            <Container maxW='container.xl' centerContent>

                <Heading as='h5' size='lg' fontWeight='bold' color='black.500'>
                    Current Portfolio
                </Heading>

                <LoadingSpinner />
                       
            </Container>
        </>
    );
}