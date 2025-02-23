import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { appWithTranslation } from "next-i18next";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default appWithTranslation(MyApp);
