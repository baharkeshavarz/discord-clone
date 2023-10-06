import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
 if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed! "})
 }
 try {
    const profile = await currentProfilePages(req)
    if (!profile) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    const { content, fileUrl } = req.body;
    const { serverId, channelId} = req.query;
    if (!content) {
        return res.status(400).json({ error: "Content is missing"})
    }

    if (!serverId) {
        return res.status(400).json({ error: "Server ID is missing"})
    }

    if (!channelId) {
        return res.status(400).json({ error: "Channel ID is missing"})
    }

    const server = await db.server.findFirst({
      where: {
         id: parseInt(serverId as string),
         members: {
            some: {
                profileId: profile.id
            }
         }
      },
      include: {
        members: true,
      }
    })
    if (!server) {
        return res.status(404).json({ message: "Server not found"})
    }

    const channel = await db.channel.findFirst({
        where: {
            id: parseInt(channelId as string),
            serverId: server.id,
        }
    })
    if (!channel) {
        return res.status(404).json({ message: "Channel not found"})
    }

    // Check if the user is part of server 
    const member = server.members.find(member => member.profileId === profile.id)
    if (!member) {
        return res.status(404).json({ message: "Member not found"})
    }

    // Insert the message
    const message = await db.message.create({
        data: {
            content,
            fileUrl,
            channelId: parseInt(channelId as string),
            memberId: member.id,
        },
        include: {
            member: {
                include: {
                    profile: true,
                }
            }
        }
    })
   
    // Send meessge with socket.io
    const channelKey = `chat:${channelId}:message`;
    res.socket.server.io.emit(channelKey, message)

    return res.status(200).json(message)
 } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" }); 
 }
}