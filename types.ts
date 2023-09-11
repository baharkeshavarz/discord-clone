import { Server, Member, Profile } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile}) [];
}

/*
Here's an example of how you might use this type:

import { ServerWithMembersWithProfiles } from './path-to-your-types';
const myServer: ServerWithMembersWithProfiles = {
    // Server properties...
    members: [
        {
            // Member properties...
            profile: {
                // Profile properties...
            }
        },
        // More members...
    ]
};

*/