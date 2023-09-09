import { InitialModal } from '@/components/modals/initial-modal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from "next/navigation";

import React from 'react'

 const SetupPage = async () => {
  const profile = await initialProfile();
  if (!profile) {
     return redirectToSignIn();
  }

  // Find the first channel that user has already joined 
  const server = await db.server.findFirst({
    where: {
        members: {
           some: {
               profileId: profile.id,
           }
        }
    }
  });

  if (server) {
    return redirect(`servers/${server.id}`)
  }

  return (
     <InitialModal/>
  )
}

export default SetupPage;