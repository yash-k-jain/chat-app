import React, { useContext, useEffect, useRef } from "react";

import { Box, Typography } from "@mui/material";

import { useQuery } from "react-query";
import { MessageContext } from "../../context/MessageContext";
import MessageBox from "./MessageBox";
import { SocketContext } from "../../context/socket/SocketContext";

const ShowMessages = () => {
  const context = useContext(MessageContext);
  const { socket } = useContext(SocketContext);

  const lastMessage = useRef(null);

  const scrollToBottom = () => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    socket?.on("newMessage", (data) => {
      context.setMessages([...context.messages, data]);
    });

    return () => socket?.off("newMessage");
  }, [socket, context.messages]);

  useEffect(() => {
    scrollToBottom();
  }, [context.messages]);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const { data: messages } = useQuery({
    queryKey: ["messages", context?.selectedChat, authUser?._id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/${context?.selectedChat}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch messages");
        }

        context.setMessages(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    enabled: !!context?.selectedChat,
  });

  const getDateLabel = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(date);

    if (
      today.getFullYear() === messageDate.getFullYear() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getDate() === messageDate.getDate()
    ) {
      return "Today";
    }

    if (
      yesterday.getFullYear() === messageDate.getFullYear() &&
      yesterday.getMonth() === messageDate.getMonth() &&
      yesterday.getDate() === messageDate.getDate()
    ) {
      return "Yesterday";
    }

    // Fallback for older dates
    const options = { year: "numeric", month: "long", day: "numeric" };
    return messageDate.toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ overflowY: "scroll", height: "100%" }}>
      {context.messages?.map((message, index) => {
        const currentMessageDate = getDateLabel(message.createdAt);
        const previousMessageDate =
          index > 0
            ? getDateLabel(context.messages[index - 1].createdAt)
            : null;

        const showDateLabel = currentMessageDate !== previousMessageDate;

        return (
          <React.Fragment key={message._id}>
            {showDateLabel && (
              <Typography
                sx={{ textAlign: "center", margin: "10px 0", color: "#888" }}
              >
                {currentMessageDate}
              </Typography>
            )}
            {message.senderId === authUser?._id ? (
              <MessageBox
                message={message}
                backgroundColor={"#25D366"}
                justifyContent={"flex-end"}
              />
            ) : (
              <MessageBox
                message={message}
                backgroundColor={"#000000"}
                justifyContent={"flex-start"}
              />
            )}
          </React.Fragment>
        );
      })}
      <div ref={lastMessage} />
    </Box>
  );
};

export default ShowMessages;
