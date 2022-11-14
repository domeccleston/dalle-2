import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"></link>
      <title>Dall-E 2 AI Image Generator</title>
      <meta name="description" content="Generate text-to-image art via OpenAI's Dall E 2 model." />
      <meta name="keywords" content="AI, text2image, dalle, dall-e, openai" />
      <meta name="author" content="John Doe" />
      <body className="bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
