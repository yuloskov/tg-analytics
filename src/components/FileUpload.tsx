import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { type ChatData } from '~/types/chat'
import { Card, CardContent } from '~/components/ui/card'

interface FileUploadProps {
  onChatDataLoad: (data: ChatData) => void
}

export function FileUpload({ onChatDataLoad }: FileUploadProps) {
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
    <Card>
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={`
            flex flex-col items-center justify-center p-8 
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <svg 
            className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
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

          <p className="mb-2 text-lg font-semibold text-gray-700">
            Перетащите экспорт чата Telegram сюда
          </p>
          <p className="text-sm text-gray-500">
            или нажмите, чтобы выбрать JSON файл
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 