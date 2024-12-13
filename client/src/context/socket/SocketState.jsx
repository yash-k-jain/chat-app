import { useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";

import io from "socket.io-client";

import { useQuery } from "react-query";

const SocketState = (props) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  return (
    <SocketContext.Provider
      value={{ socket, setSocket, onlineUsers, setOnlineUsers }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketState;
