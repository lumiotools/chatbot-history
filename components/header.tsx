import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function Header({ title, showBackButton = false, backUrl = '/' }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        {showBackButton && (
          <Link 
            href={backUrl}
            className="text-gray-600 hover:text-gray-900 flex items-center mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  )
}