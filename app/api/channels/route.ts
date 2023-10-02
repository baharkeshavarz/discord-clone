import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401});
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
        return new NextResponse("Server ID is missing", { status: 400})
    }
    
    const { name, type } = await req.json();
    if (name === "general") {
        return new NextResponse("Name cannot be generak", { status: 400 })
    }

    // Add channel
    const server = await db.server.update({
        where: {
            id: parseInt(serverId),
            members: {
                some: {
                    profileId: profile.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },
        data: {
            channels: {
                create: {
                    profileId: profile.id,
                    name,
                    type
                }
            }
        }
    });

    return NextResponse.json(server);

  } catch (error) {
    console.log("[CHANNELS_POST]:", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}