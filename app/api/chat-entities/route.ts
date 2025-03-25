import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import NamamiGangeChatHistory from "@/models/NamamiGangeChatHistory";
import CitizenReportingChatHistory from "@/models/CitizenReportingChatHistory";
import SolixChatHistory from "@/models/SolixChatHistory";
import HellerChatHistory from "@/models/HellerChatHistory";

const NAMAMI_GANGE_DB_URL = process.env.NAMAMI_GANGE_DB_URL;
const CITIZEN_REPORTING_DB_URL = process.env.CITIZEN_REPORTING_DB_URL;
const SOLIX_DB_URL = process.env.SOLIX_DB_URL;
const HELLER_DB_URL = process.env.HELLER_DB_URL;

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

  if (!option) {
    return NextResponse.json({ error: "Option is required" }, { status: 400 });
  }

  let dbUrl: string;
  let ChatHistoryModel:
    | typeof NamamiGangeChatHistory
    | typeof CitizenReportingChatHistory;

  if (option === "namami-gange") {
    dbUrl = NAMAMI_GANGE_DB_URL!;
    ChatHistoryModel = NamamiGangeChatHistory;
  } else if (option === "citizen-reporting") {
    dbUrl = CITIZEN_REPORTING_DB_URL!;
    ChatHistoryModel = CitizenReportingChatHistory;
  } else if (option === "solix") {
    dbUrl = SOLIX_DB_URL!;
    ChatHistoryModel = SolixChatHistory;
  }  else if (option === "heller") {
    dbUrl = HELLER_DB_URL!;
    ChatHistoryModel = HellerChatHistory;
  } else {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  }

  try {
    await mongoose.connect(dbUrl);
    const chatEntities = await ChatHistoryModel.find(
      {},
      "userIP createdAt"
    ).sort({ createdAt: -1 });

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

    return NextResponse.json({ entities: entitiesWithIpDetails });
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
