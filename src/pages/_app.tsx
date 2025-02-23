import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { appWithTranslation, useTranslation } from "next-i18next";

import "~/styles/globals.css";
import Head from "next/head"

const MyApp: AppType = ({ Component, pageProps }) => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
      </Head>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default appWithTranslation(MyApp);
