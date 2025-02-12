import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import NamamiGangeChatHistory from '@/models/NamamiGangeChatHistory'
import CitizenReportingChatHistory from '@/models/CitizenReportingChatHistory'

const NAMAMI_GANGE_DB_URL = process.env.NAMAMI_GANGE_DB_URL
const CITIZEN_REPORTING_DB_URL = process.env.CITIZEN_REPORTING_DB_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const option = searchParams.get('option')
  const id = searchParams.get('id')

  if (!option || !id) {
    return NextResponse.json({ error: 'Option and ID are required' }, { status: 400 })
  }

  let dbUrl: string
  let ChatHistoryModel: typeof NamamiGangeChatHistory | typeof CitizenReportingChatHistory

  if (option === 'namami-gange') {
    dbUrl = NAMAMI_GANGE_DB_URL!
    ChatHistoryModel = NamamiGangeChatHistory
  } else if (option === 'citizen-reporting') {
    dbUrl = CITIZEN_REPORTING_DB_URL!
    ChatHistoryModel = CitizenReportingChatHistory
  } else {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  try {
    await mongoose.connect(dbUrl)
    const chatHistory = await ChatHistoryModel.findById(id)

    if (!chatHistory) {
      return NextResponse.json({ error: 'Chat history not found' }, { status: 404 })
    }

    return NextResponse.json({ messages: chatHistory.messages })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await mongoose.disconnect()
  }
}