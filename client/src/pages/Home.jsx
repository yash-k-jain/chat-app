import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import Sidebar from "../components/common/Sidebar";
import Message from "../components/common/Message";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("isRegistered") === "false") {
      navigate("/auth/login");
    }
  });

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#d4f7f9"}}
      margin={"1.5rem auto"}
      width={"90%"}
    >
      <Sidebar />
      <Message />
    </Box>
  );
};

export default Home;
