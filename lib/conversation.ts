import { db } from "./db";

// Find or create a conversation between member1 and member2
export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(memberOneId, memberTwoId) ||
                     await findConversation(memberTwoId, memberOneId);
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }     
  
  return conversation;
}

// Find a conversation between member1 and member2
const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: parseInt(memberOneId) },
                    { memberTwoId: parseInt(memberTwoId) },
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch {
        return null;
    }
}

// Create a conversation between member1 and member2
const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId: parseInt(memberOneId),
                memberTwoId: parseInt(memberTwoId),
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch {
        return null;
    }
}