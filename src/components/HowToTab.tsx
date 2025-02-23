import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

export function HowToTab() {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl text-transparent">
            {t('howTo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t('howTo.step1.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('howTo.step1.description')}{" "}
              <a
                href="https://desktop.telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t('howTo.step1.link')}
              </a>
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t('howTo.step2.title')}
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
              <li>{t('howTo.step2.item1')}</li>
              <li>
                {t('howTo.step2.item2')}
              </li>
              <li>
                {t('howTo.step2.item3')}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t('howTo.step3.title')}
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
              <li>{t('howTo.step3.item1')}</li>
              <li>{t('howTo.step3.item2')}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t('howTo.step4.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('howTo.step4.description')}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
