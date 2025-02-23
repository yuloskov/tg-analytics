import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { GeistSans } from "geist/font/sans";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const changeLanguage = (locale: string) => {
    void router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Select value={router.locale} onValueChange={changeLanguage}>
        <SelectTrigger className="h-10 inline-flex items-center gap-1.5 px-4 rounded-full border border-slate-200/20 font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 bg-gradient-to-r from-purple-600/10 to-blue-500/10 hover:from-purple-600/20 hover:to-blue-500/20">
          <Languages className="h-4 w-4" />
          <SelectValue className="text-sm" placeholder={router.locale === 'en' ? 'English' : 'Русский'} />
        </SelectTrigger>
        <SelectContent className={`${GeistSans.className} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700`}>
          <SelectItem 
            value="en"
            className="text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
          >
            English
          </SelectItem>
          <SelectItem 
            value="ru"
            className="text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
          >
            Русский
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}