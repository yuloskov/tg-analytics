import { Card, CardContent } from '~/components/ui/card'

export function PrivacyNotice() {
  return (
    <Card className="mb-8 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <svg 
            className="w-5 h-5 text-blue-500" 
            fill="none" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
            />
          </svg>
          <p className="text-blue-700">
            Ваша конфиденциальность важна для нас! Вся обработка происходит локально в вашем браузере - данные никогда не отправляются на сервер.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 