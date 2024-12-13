import React, { useContext, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Button,
  Typography,
  Badge,
} from "@mui/material";

import { MessageContext } from "../../context/MessageContext.jsx";

import { useQuery } from "react-query";
import { SocketContext } from "../../context/socket/SocketContext.jsx";

const MessageAppbar = () => {
  const context = useContext(MessageContext);
  const socketContext = useContext(SocketContext)

  const { data: selectedChatPerson } = useQuery({
    queryKey: ["selectedChatPerson", context?.selectedChat],
    queryFn: async () => {
      if (!context?.selectedChat) return null;
      try {
        const res = await fetch(`/api/user/getUser/${context?.selectedChat}`);
        const data = await res.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!context?.selectedChat,
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Badge
            color="secondary"
            variant={
              socketContext.onlineUsers.includes(selectedChatPerson?._id) ? "dot" : ""
            }
          >
            <Avatar src={selectedChatPerson?.profileImg}></Avatar>
          </Badge>
          <Button color="inherit">{selectedChatPerson?.name}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MessageAppbar;
