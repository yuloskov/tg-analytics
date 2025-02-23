import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <title>Telegram Chat Analyzer - Подробная аналитика сообщений</title>
        <meta name="description" content="Подробная аналитика сообщений и активности пользователей в Telegram чатах" />
        <meta name="keywords" content="Telegram, аналитика, статистика, чаты, анализ сообщений, визуализация данных, активность пользователей" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Telegram Chat Analyzer - Подробная аналитика сообщений" />
        <meta property="og:description" content="Подробная аналитика сообщений и активности пользователей в Telegram чатах" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Telegram Chat Analyzer - Подробная аналитика сообщений" />
        <meta name="twitter:description" content="Подробная аналитика сообщений и активности пользователей в Telegram чатах" />
        
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