'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MessageCircle, Clock, MapPin } from 'lucide-react'
import Header from '@/components/header'

interface ChatEntity {
  _id: string;
  userIP: string;
  createdAt: string;
  ipDetails?: {
    country: string;
    region: string;
    city: string;
    zip: string;
  };
}

export default function ChatList() {
  const params = useParams()
  const [chatEntities, setChatEntities] = useState<ChatEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPageTitle = () => {
    switch (params.option) {
      case 'namami-gange':
        return 'Namami Gange Programme Chats'
      case 'citizen-reporting':
        return 'Citizen Reporting Chats'
      case 'solix':
        return 'Solix Chats'
      case 'heller':
        return 'Heller Chats'
      case 'paloma':
        return 'Paloma Chats'
      default:
        return 'Chat History'
    }
  }

  useEffect(() => {
    const fetchChatEntities = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/chat-entities?option=${params.option}`)
        if (!response.ok) {
          throw new Error('Failed to fetch chat entities')
        }
        const data = await response.json()
        if (Array.isArray(data.entities)) {
          setChatEntities(data.entities)
        } else {
          throw new Error('Invalid data format received from API')
        }
      } catch (error) {
        console.error('Error fetching chat entities:', error)
        setError('Failed to load chat entities. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchChatEntities()
  }, [params.option])

  return (
    <div>
      <Header title={getPageTitle()} showBackButton backUrl="/" />
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : chatEntities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No chat histories found
            </div>
          ) : (
            <div className="grid gap-4">
              {chatEntities.map((entity) => (
                <Link key={entity._id} href={`/chat/${params.option}/${entity._id}`}>
                  <Card className="hover:border-blue-400 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">IP: {entity.userIP}</CardTitle>
                        {entity.ipDetails && (
                          <CardContent className="p-0 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {entity.ipDetails.city}, {entity.ipDetails.region}, {entity.ipDetails.country} {entity.ipDetails.zip}
                            </div>
                          </CardContent>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(entity.createdAt)}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}