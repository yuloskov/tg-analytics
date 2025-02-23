import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { appWithTranslation } from "next-i18next";

import "~/styles/globals.css";
import Head from "next/head"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Telegram Chat Analyzer - Подробная аналитика сообщений</title>
      </Head>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default appWithTranslation(MyApp);
