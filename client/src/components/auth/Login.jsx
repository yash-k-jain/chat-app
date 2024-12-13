import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, Input, Button } from "@mui/material";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";

import { useMutation } from "react-query";

import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const {
    mutate: login,
    isLoading,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to register");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Login successfully");
      setFormData({
        email: "",
        password: "",
      })
      navigate("/");
      Cookies.set("isRegistered", true);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  useEffect(() => {
    if(Cookies.get("isRegistered") === "true") {
      navigate("/");
    }
  }, [])

  return (
    <Box
      width={"40%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      m={"2rem auto"}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", fontFamily: "fantasy" }}
      >
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>  
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Input
            id="email"
            name="email"
            type="email"
            aria-describedby="my-helper-text"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Input
              id="password"
              name="password"
              type="password"
              aria-describedby="my-helper-text"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormControl>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
