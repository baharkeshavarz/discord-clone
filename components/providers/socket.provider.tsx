"use client";

import {
      createContext,
      useContext,
      useEffect,
      useState }
from "react";
import { io as ClientIO } from "socket.io-client";

/* This is a TypeScript module that provides a context and a hook for managing a Socket.IO client in a React application.
Overall, this module sets up a context and hook for managing a Socket.IO client in a React application. Components can use
the useSocket hook to access the socket instance and its connection status, and the SocketProvider component wraps its children,
providing them access to the socket context.
*/

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}

// Context Creation
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

// Custom Hook: useSocket
export const useSocket = () => {
    return useContext(SocketContext)
}

// Socket Provider Component
export const SocketProvider = ({children }: {
      children: React.ReactNode 
    }
) => {
    const [ socket, setSocket ] = useState(null)
    const [ isConnected, setIsConnected ] = useState(false)

    useEffect(() => {
       //process.env.NEXT_PUBLIC_SITE_URL is by default localhost and there is no need to define in .env file 
       const socketInstance = new (ClientIO as any) (process.env.NEXT_PUBLIC_SITE_URL!, {
         path: "/api/socket/io",
         addTrailingSlash: false,
       })

       // add event listener
       socketInstance.on("connect", () => {
         setIsConnected(true)
       })

       socketInstance.on("disconnect", () => {
         setIsConnected(false)
       })

       setSocket(socketInstance);

       return () => {
         socketInstance.disconnect();
       }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

/*
Socket Provider Component:

SocketProvider is a functional component that takes children as props. children here refers to the nested components that will be wrapped by this provider.
Inside this component, two state variables socket and isConnected are initialized using useState.
useEffect is used to set up the Socket.IO connection. When the component mounts ([] as the dependency list means it runs once when the component mounts), a new Socket.IO client is created with a URL specified by process.env.NEXT_PUBLIC_SITE_URL.
Event listeners are added for the connect and disconnect events. When the client connects, setIsConnected(true) is called. When it disconnects, setIsConnected(false) is called.
The socket instance is set in the state with setSocket(socketInstance).
A cleanup function is returned from the effect. This function disconnects the socket when the component is unmounted.
*/