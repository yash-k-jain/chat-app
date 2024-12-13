import React, { useContext } from "react";

import { Box } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { MessageContext } from "../../context/MessageContext";

import { useMutation, useQueryClient, useQuery } from "react-query";

const MessageForm = () => {
  const queryClient = useQueryClient();

  const context = useContext(MessageContext);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/messages/send/${context?.selectedChat}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: context.message }),
        });
        const data = await res.json();

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      context.setMessage("");

      queryClient.invalidateQueries({
        queryKey: ["messages", context?.selectedChat, authUser?._id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Box
      sx={{ position: "sticky", bottom: "1rem" }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
    >
      <form
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          style={{
            flexGrow: 1,
            borderRadius: "5rem",
            border: "1px solid black",
            padding: "1rem",
            margin: "1rem",
          }}
          type="text"
          placeholder="Message"
          value={context.message}
          onChange={(e) => context.setMessage(e.target.value)}
        />
        <button
          style={{
            marginRight: "1rem",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          type="submit"
        >
          <SendIcon />
        </button>
      </form>
    </Box>
  );
};

export default MessageForm;
