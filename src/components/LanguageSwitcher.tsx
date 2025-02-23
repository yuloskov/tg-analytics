import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { GeistSans } from "geist/font/sans";

export function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation();
  const { pathname, asPath, query } = router;

  const changeLanguage = (locale: string) => {
    void router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <Select value={router.locale} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t("language." + router.locale)} />
      </SelectTrigger>
      <SelectContent className={`${GeistSans.className}`}>
        <SelectItem value="en">{t("language.en")}</SelectItem>
        <SelectItem value="ru">{t("language.ru")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
