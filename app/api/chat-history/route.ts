import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import NamamiGangeChatHistory from '@/models/NamamiGangeChatHistory'
import CitizenReportingChatHistory from '@/models/CitizenReportingChatHistory'
import SolixChatHistory from '@/models/SolixChatHistory'
import HellerChatHistory from '@/models/HellerChatHistory'

const NAMAMI_GANGE_DB_URL = process.env.NAMAMI_GANGE_DB_URL
const CITIZEN_REPORTING_DB_URL = process.env.CITIZEN_REPORTING_DB_URL
const SOLIX_DB_URL = process.env.SOLIX_DB_URL
const HELLER_DB_URL = process.env.HELLER_DB_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const option = searchParams.get('option')
  const id = searchParams.get('id')

  if (!option || !id) {
    return NextResponse.json({ error: 'Option and ID are required' }, { status: 400 })
  }

  let dbUrl: string
  let ChatHistoryModel: typeof NamamiGangeChatHistory | typeof CitizenReportingChatHistory | typeof SolixChatHistory

  if (option === 'namami-gange') {
    dbUrl = NAMAMI_GANGE_DB_URL!
    ChatHistoryModel = NamamiGangeChatHistory
  } else if (option === 'citizen-reporting') {
    dbUrl = CITIZEN_REPORTING_DB_URL!
    ChatHistoryModel = CitizenReportingChatHistory
  } else if (option === 'solix') {
    dbUrl = SOLIX_DB_URL!
    ChatHistoryModel = SolixChatHistory
  } else if (option === 'heller') {
    dbUrl = HELLER_DB_URL!
    ChatHistoryModel = HellerChatHistory
  } else {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  try {
    await mongoose.connect(dbUrl)
    
    const chatHistory = await ChatHistoryModel.findById(id).lean()

    if (!chatHistory) {
      return NextResponse.json({ error: 'Chat history not found' }, { status: 404 })
    }

    // Transform the MongoDB document to a plain JavaScript object
    const transformedChatHistory = JSON.parse(JSON.stringify(chatHistory))

    // Ensure _id is a string
    transformedChatHistory._id = transformedChatHistory._id.toString()

    // Transform message _ids if they exist
    if (Array.isArray(transformedChatHistory.messages)) {
      transformedChatHistory.messages = transformedChatHistory.messages.map((message: { _id?: mongoose.Types.ObjectId }) => ({
        ...message,
        _id: message._id ? message._id.toString() : undefined
      }))
    }

    return NextResponse.json(transformedChatHistory)
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await mongoose.disconnect()
  }
}