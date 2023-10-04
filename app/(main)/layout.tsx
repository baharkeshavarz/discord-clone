import React from 'react'
import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';

const MainLayout = async ({
       children,
       params
      } : {
         children: React.ReactNode,
         params: { serverId: string }
        }) => {

  return (
    <div className="h-full">
        <div className="hidden md:flex h-full w-[72px] fixed inset-y-0 flex-col z-30">
             <NavigationSidebar/>
        </div>

        <main className="h-full md:ml-[72px]">
          {children}
        </main>
    </div>
  )
}

export default MainLayout;
