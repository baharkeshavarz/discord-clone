import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string}}
) {
   try {
    const profile = await currentProfile();
    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401});
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const channelId = params.channelId;
    
    if (!serverId) {
        return new NextResponse("Server ID is missing", { status: 400})
    }
    if (!channelId) {
        return new NextResponse("Channel ID is missing", { status: 400 })
    }

    const server = await db.server.update({
        where: {
            id: parseInt(serverId) as number,
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
                delete: {
                    id: parseInt(channelId),
                    name: {
                        not: "general"
                    }
                }
            }
        }

      });
    return NextResponse.json(server);
   } catch (error) {
    console.log("[CHANNEL_ID_DELETE", error);
    return new NextResponse("Internal Error", { status: 500});
   }
}