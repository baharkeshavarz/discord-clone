import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string}}
) {
   try {
    const profile = await currentProfile();
    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401});
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const memberId = params.memberId;
    if (!serverId) {
        return new NextResponse("Server ID is missing", { status: 400})
    }
    if (!memberId) {
        return new NextResponse("Member ID is missing", { status: 400 })
    }

    const server = await db.server.update({
        where: {
            id: parseInt(serverId) as number,
            profileId: profile.id,
        },
        data: {
          members: {
            deleteMany: {
              id: parseInt(params.memberId),
              profileId: {
                not: profile.id
              }
            }
          }
        },
        include: {
          members: {
            include: {
              profile: true,
            },
            orderBy: {
              role: "asc",
            }
          },
        },
      });
    return NextResponse.json(server);
   } catch (error) {
    console.log("[MEMBERS_ID_DELETE", error);
    return new NextResponse("Internal Error", { status: 500});
   }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string }}
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const memberId = params.memberId;
        const serverId = searchParams.get("serverId");
        const { role } = await req.json();
    
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        if (!serverId) {
            return new NextResponse("Server ID is missing", { status: 400})
        }
        if (!memberId) {
            return new NextResponse("Member ID is missing", { status: 400 })
        }

        const server = await db.server.update({
           where: {
             id: parseInt(serverId) as number,
             profileId: profile.id,
           },
           data: {
            members: {
                update: {
                    where: {
                        id: parseInt(memberId),
                        profileId: {
                            not: profile.id
                        }
                    },
                data: {
                    role
                }
              }
            }
           },
           include: {
              members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
              }
           }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}