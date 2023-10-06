import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

// use this lib across the server-side components
export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return null;
    }

    const profile = db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;
}