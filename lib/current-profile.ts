import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

// user this lib across the server-side components
export const currentProfile = async () => {
    const { userId } = auth();
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