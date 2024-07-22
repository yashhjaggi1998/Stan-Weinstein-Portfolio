import { ThemeProvider, theme, CSSReset } from '@chakra-ui/react';
import Head from 'next/head';
import './static/styles/globals.css';

function MyApp({ Component, pageProps }) 
{
    return (
        <>
            <Head>
                <title>YJ</title>
                <link rel="icon" href="YJ1.png" />
                <meta name="description" content="Stan Weinstein Portfolio" />
            </Head>
            <ThemeProvider theme={theme}>
                <CSSReset />
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}

export default MyApp
