import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Container, HStack, Heading, Icon, List, ListIcon, ListItem, SimpleGrid, Text} from '@chakra-ui/react';
import { InfoIcon, LockIcon, SettingsIcon, PlusSquareIcon } from '@chakra-ui/icons';


type ConnectionStatus = { isConnected: boolean }

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async () => {
    try {
        await clientPromise
        // `await clientPromise` will use the default database passed in the MONGODB_URI
        // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
        //
        // `const client = await clientPromise`
        // `const db = client.db("myDatabase")`
        //
        // Then you can execute queries against your database like so:
        // db.find({}) or any of the MongoDB Node Driver commands

        return {
            props: { isConnected: true },
        }
    } catch (e) {
        console.error(e)
        return {
            props: { isConnected: false },
        }
    }
}

export default function Home({isConnected,}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
    return (
        <>
            <Head>
                <title>Yashh's Portfolio</title>
                <meta name="description" content="Yashh's Portfolio" />
            </Head>

            <Container maxW="container.xl" marginTop={20}>
                <Center>
                    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(150px, 1fr))'>
                        
                        <Card 
                            cursor={'pointer'}
                            onClick={() => window.location.href = "./current_portfolio"}
                        >
                            <CardHeader>
                                <HStack>
                                    <Icon as={InfoIcon} color='green.500' />
                                    <Heading size='md'>Current Portfolio</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                        <Card 
                            cursor={'pointer'}
                            onClick={() => window.location.href = "./compound_interest_calculator"}
                        >
                            <CardHeader>
                                <HStack>
                                    <Icon as={PlusSquareIcon} color='blue.500' />
                                    <Heading size='md'>Compound Interest Calculator</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                        <Card 
                            cursor={'pointer'}
                            onClick={() => window.location.href = "./fundamental_portfolio"}
                        >
                            <CardHeader>
                                <HStack>
                                    <Icon as={InfoIcon} color='green.500' />
                                    <Heading size='md'>Fundamental Portfolio</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                        <Card
                            cursor={'pointer'}
                            onClick={() => window.location.href = "./closed_positions"}
                        >
                            <CardHeader>
                                <HStack>
                                    <Icon as={LockIcon} color='green.500' />
                                    <Heading size='md'>Closed Positions</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <HStack>
                                    <Icon as={SettingsIcon} color='green.500' />
                                    <Heading size='md'>Statistics</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                    </SimpleGrid>
                </Center>
            </Container>
        </>    
    );
}
