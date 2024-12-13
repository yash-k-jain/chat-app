import React, { useContext } from "react";

import { Box, Typography } from "@mui/material";
import { SocketContext } from "../../context/socket/SocketContext";

const MessageBox = ({ message, backgroundColor, justifyContent }) => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={justifyContent}
      padding={".5rem"}
    >
      <Typography
        sx={{
          backgroundColor,
          padding: ".5rem",
          borderRadius: "1rem",
          color: "white",
        }}
      >
        {message.message}
        <Box width={"100%"} display={"flex"} justifyContent={"flex-end"}>
          <Typography
            sx={{
              fontSize: ".6rem",
              color: "white",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </Typography>
    </Box>
  );
};

export default MessageBox;
