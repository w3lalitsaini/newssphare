import { NextRequest, NextResponse } from "next/server";
import { runAutoBlogEngine } from "@/lib/workflows/autoBlogEngine";
import { runBlogAgent } from "@/lib/workflows/blogAgent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Log from "@/models/Log";
import connectDB from "@/lib/db";

/**
 * Admin API for Auto-Blog Control
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const logs = await Log.find({ source: { $in: ["AutoBlogEngine", "BlogAgent", "CronJob"] } })
      .sort({ timestamp: -1 })
      .limit(50);

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action, keyword } = await req.json();

    if (action === "run-engine") {
      const summary = await runAutoBlogEngine();
      return NextResponse.json({ message: "Engine cycle requested", summary });
    }

    if (action === "run-agent" && keyword) {
      const result = await runBlogAgent(keyword, { autoSave: true, useCache: false });
      return NextResponse.json({ message: "Agent finished", result });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Auto-Blog API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
