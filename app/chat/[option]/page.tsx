'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MessageCircle, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'

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

interface PaginationData {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export default function ChatList() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [chatEntities, setChatEntities] = useState<ChatEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 0
  })

  const currentPage = Number(searchParams.get('page') || '1')
  const itemsPerPage = Number(searchParams.get('limit') || '10')

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

  const changePage = (page: number) => {
    router.push(`/chat/${params.option}?page=${page}&limit=${itemsPerPage}`)
  }

  useEffect(() => {
    const fetchChatEntities = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/chat-entities?option=${params.option}&page=${currentPage}&limit=${itemsPerPage}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat entities')
        }
        
        const data = await response.json()
        
        if (Array.isArray(data.entities)) {
          setChatEntities(data.entities)
          setPagination(data.pagination)
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
  }, [params.option, currentPage, itemsPerPage])

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
            <>
              <div className="grid gap-4 mb-6">
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
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-2">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} items
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}