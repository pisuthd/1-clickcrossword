import { Html, Head, Main, NextScript } from 'next/document'
import Script from "next/script";


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>1-Click Crossword</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="1-Click Crossword project, make a crossword in a few seconds with ChatGPT "
        />
        <meta name="keywords" content="chatgpt, openai, novel, novelai, generative, artwork, ai art marketplace, promptsea, promptbase, chatx, visualise.ai, artstation, midjourney, ai art, ai generator, dall e, stable diffusion, image generator ai, polygon, nft, shutterstock, getty"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-51VBWDT3P2`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-51VBWDT3P2');
        `}
      </Script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
