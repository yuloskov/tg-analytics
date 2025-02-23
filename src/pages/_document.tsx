import { Html, Head, Main, NextScript } from 'next/document'
import { useTranslation } from 'next-i18next'

export default function Document() {
  const { t } = useTranslation();

  return (
    <Html lang="ru">
      <Head>
        <meta name="description" content={t('meta.description')} />
        <meta name="keywords" content={t('meta.keywords')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.title')} />
        <meta name="twitter:description" content={t('meta.description')} />
        
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.ico"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0088cc" />
        <meta name="msapplication-TileColor" content="#0088cc" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 