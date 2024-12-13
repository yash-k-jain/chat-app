import React, { useContext } from "react";

import { Box, Typography } from "@mui/material";
import MessageAppbar from "./MessageAppbar";
import { MessageContext } from "../../context/MessageContext";
import MessageForm from "./MessageForm";
import ShowMessages from "./ShowMessages";

const Message = () => {
  const context = useContext(MessageContext)
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} height={"80vh"}>
      {context.selectedChat && <MessageAppbar />}
      {context.selectedChat && <ShowMessages />}
      {context.selectedChat && <MessageForm />}
      {!context.selectedChat && (
        <Typography sx={{ textAlign: "center" }}>Select a Chat to start a conversation with your friend.</Typography>
      )}
    </Box>
  );
};

export default Message;
