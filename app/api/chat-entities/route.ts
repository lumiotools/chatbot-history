import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import NamamiGangeChatHistory from "@/models/NamamiGangeChatHistory";
import CitizenReportingChatHistory from "@/models/CitizenReportingChatHistory";
import SolixChatHistory from "@/models/SolixChatHistory";
import HellerChatHistory from "@/models/HellerChatHistory";
import PalomaChatHistory from "@/models/PalomaChatHistory";

const NAMAMI_GANGE_DB_URL = process.env.NAMAMI_GANGE_DB_URL;
const CITIZEN_REPORTING_DB_URL = process.env.CITIZEN_REPORTING_DB_URL;
const SOLIX_DB_URL = process.env.SOLIX_DB_URL;
const HELLER_DB_URL = process.env.HELLER_DB_URL;
const PALOMA_DB_URL = process.env.PALOMA_DB_URL;

async function getIpDetails(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.status === "success") {
      return {
        country: data.country,
        region: data.region,
        city: data.city,
        zip: data.zip,
      };
    }
  } catch (error) {
    console.error("Error fetching IP details:", error);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const option = searchParams.get("option");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  if (!option) {
    return NextResponse.json({ error: "Option is required" }, { status: 400 });
  }

  let dbUrl: string;
  let ChatHistoryModel:
    | typeof NamamiGangeChatHistory
    | typeof CitizenReportingChatHistory
    | typeof SolixChatHistory
    | typeof HellerChatHistory
    | typeof PalomaChatHistory;

  if (option === "namami-gange") {
    dbUrl = NAMAMI_GANGE_DB_URL!;
    ChatHistoryModel = NamamiGangeChatHistory;
  } else if (option === "citizen-reporting") {
    dbUrl = CITIZEN_REPORTING_DB_URL!;
    ChatHistoryModel = CitizenReportingChatHistory;
  } else if (option === "solix") {
    dbUrl = SOLIX_DB_URL!;
    ChatHistoryModel = SolixChatHistory;
  } else if (option === "heller") {
    dbUrl = HELLER_DB_URL!;
    ChatHistoryModel = HellerChatHistory;
  } else if (option === "paloma") {
    dbUrl = PALOMA_DB_URL!;
    ChatHistoryModel = PalomaChatHistory;
  } else {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  }

  try {
    await mongoose.connect(dbUrl);
    
    // Get total count for pagination metadata
    const totalCount = await ChatHistoryModel.countDocuments();
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    const chatEntities = await ChatHistoryModel.find(
      {},
      "userIP createdAt"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const entitiesWithIpDetails = await Promise.all(
      chatEntities.map(async (entity) => {
        const ipDetails = await getIpDetails(entity.userIP);
        return {
          _id: entity._id.toString(),
          userIP: entity.userIP,
          createdAt: entity.createdAt.toISOString(),
          ipDetails,
        };
      })
    );

    return NextResponse.json({
      entities: entitiesWithIpDetails,
      pagination: {
        totalItems: totalCount,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching chat entities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
