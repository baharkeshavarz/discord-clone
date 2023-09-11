import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params } : { params: { serverId: string}}
    ) {
        try {
            const { name, imageUrl } = await req.json();
            const profile = await currentProfile();
       
            if (!profile) {
              return new NextResponse("Unauthorized", {status: 401})
            }
       
            // Update the server
            const  serverId = params.serverId;
            const server = await db.server.update({
                where: {
                    profileId: profile.id,
                    id: parseInt(serverId),
                },
                data: {
                    name,
                    imageUrl,
                }
            })
            return NextResponse.json(server)
         } catch (error) {
            console.log("[SERVERS_POST]:", error);
            return new NextResponse("Internal Error", { status: 500 })
         }
}