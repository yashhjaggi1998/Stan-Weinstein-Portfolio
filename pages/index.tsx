import "bootstrap/dist/css/bootstrap.min.css";
import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Container, HStack, Heading, Icon, List, ListIcon, ListItem, SimpleGrid, Text} from '@chakra-ui/react';
import { InfoIcon, LockIcon, SettingsIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';


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


            <Navbar fixed="top" className="ps-4 pt-1 pb-0" bg="light" data-bs-theme="light">

                <Navbar.Brand>
                    <img
                        alt="YJ Brand"
                        src="YJ1.png"
                        width="90"
                        height="100"
                        className="align-top"
                    />
                </Navbar.Brand>
                <Nav className="ms-5 me-auto">
                    
                    <Nav.Link href="/compound_interest_calculator" className="fs-5 me-4">ROI Calculator</Nav.Link>
                    <NavDropdown title="Portfolio" id="portfolio" className="fs-5">
                        <NavDropdown.Item href="/current_portfolio" className="fs-5">Current Portfolio</NavDropdown.Item>
                        <NavDropdown.Item href="/fundamental_portfolio" className="fs-5">Fundamental Portfolio</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/closed_positions" className="fs-5">Closed Positions</Nav.Link>
                    <Nav.Link href="/current_portfolio_live" className="fs-5">Live - Current Portfolio</Nav.Link>
                </Nav>
            </Navbar>

            <Container maxW="container.xl" marginTop={"90px"}>
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

                        <Card 
                            cursor={'pointer'}
                            onClick={() => window.location.href = "./current_portfolio_live"}
                        >
                            <CardHeader>
                                <HStack>
                                    <Icon as={InfoIcon} color='green.500' />
                                    <Heading size='md'>Live - Current Portfolio</Heading>
                                </HStack>
                            </CardHeader>
                        </Card>

                    </SimpleGrid>
                </Center>
            </Container>
        </>    
    );
}
