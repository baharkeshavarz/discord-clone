import { Server, Member, Profile, Message } from '@prisma/client';
import { NextApiResponse } from 'next';
import { Socket, Server as NetServer } from 'net';
import { Server as SocketIOServer} from "socket.io"

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile}) [];
}

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
      profile: Profile
    }
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

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer,
        }
    }
}