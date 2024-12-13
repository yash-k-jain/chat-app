import React, { useState } from "react";

import Search from "./Search";
import Friend from "./Friend";
import Request from "./Request";

import { Box, Typography, Badge } from "@mui/material";

import { useQuery } from "react-query";

const Sidebar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: requestsArray } = useQuery({
    queryKey: ["requests"],
  });

  const [selected, setSelected] = useState("chats");

  return (
    <Box
      width={"30%"}
      height={"80vh"}
      sx={{ borderRight: "1px solid #ccc", overflowY: "scroll" }}
    >
      <Box
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={3}
        m={".5rem 2rem"}
      >
        <Typography
          sx={{
            cursor: "pointer",
            borderBottom: selected === "chats" ? "2px solid #000" : "none",
            paddingBottom: "0.5rem",
          }}
          onClick={() => setSelected("chats")}
        >
          Chats
        </Typography>

        <Badge variant={requestsArray?.length > 0 ? "dot" : ""} color="error">
          <Typography
            sx={{
              cursor: "pointer",
              borderBottom: selected === "requests" ? "2px solid #000" : "none",
              paddingBottom: "0.5rem",
            }}
            onClick={() => setSelected("requests")}
          >
            Requests
          </Typography>
        </Badge>
      </Box>
      <Search />
      {selected === "chats" &&
        authUser?.friends.length > 0 &&
        authUser?.friends?.map((friend) => (
          <Friend key={friend._id} friend={friend} />
        ))}

      {selected === "requests" && (
        <Request
          setSelected={setSelected}
        />
      )}
    </Box>
  );
};

export default Sidebar;
