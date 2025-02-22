import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { type ChatData } from '~/types/chat'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { motion } from 'framer-motion'
import { HelpButton } from './HelpButton'

interface FileUploadProps {
  onChatDataLoad: (data: ChatData) => void
  onHowToClick: () => void
}

export function FileUpload({ onChatDataLoad, onHowToClick }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]
    
    if (!file) return
    
    file.text()
      .then(text => {
        const data = JSON.parse(text) as ChatData
        onChatDataLoad(data)
      })
      .catch(() => {
        setError('Error reading file. Please make sure it\'s a valid Telegram chat export JSON file.')
      })
  }, [onChatDataLoad])

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false)
  })

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl text-transparent">
          Загрузка чата
        </CardTitle>
        <HelpButton onClick={onHowToClick} />
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800"
        >

          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 ${
              isDragging
                ? "border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20"
                : "border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
            } `}
          >
            <input {...getInputProps()} />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <svg
                className={`mb-4 h-16 w-16 ${
                  isDragging
                    ? "text-purple-500 dark:text-purple-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
                Перетащите экспорт чата Telegram сюда
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                или нажмите, чтобы выбрать JSON файл
              </p>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-red-500 dark:text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
} 