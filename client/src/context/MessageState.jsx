import { useState } from "react";
import { MessageContext } from "./MessageContext";

import { useQuery } from "react-query";

const MessageState = (props) => {
  const [selectedChat, setSelectedChat] = useState("");
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");
  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        selectedChat,
        setSelectedChat,
        message,
        setMessage,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageState;
