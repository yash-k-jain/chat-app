import React, { useContext, useState } from "react";

import {
  Box,
  Badge,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

import { MessageContext } from "../../context/MessageContext.jsx";
import { SocketContext } from "../../context/socket/SocketContext.jsx";

import { useMutation, useQuery, useQueryClient } from "react-query";

import menu from "../../assets/menu.png";

const Friend = ({ friend }) => {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState();
  const [openModal, setOpenModal] = useState(false);

  const open = Boolean(anchorEl);

  const contextMessage = useContext(MessageContext);
  const socketContext = useContext(SocketContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: handleRemoveFriend } = useMutation({
    mutationFn: async (friendId) => {
      try {
        console.log(friendId);
        const res = await fetch(`/api/user/removeFriend/${friendId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to remove friend");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      contextMessage.setSelectedChat("");
      contextMessage.setMessages([]);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Box sx={{ cursor: "pointer" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          display={"flex"}
          width={"100%"}
          margin={".5rem"}
          sx={{
            alignItems: "center",
            gap: "1rem",
            padding: ".5rem",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={() => {
            contextMessage.setSelectedChat(friend?._id);
            if (
              contextMessage.messages.length > 0 &&
              contextMessage.selectedChat !== friend?._id
            ) {
              contextMessage.setMessages([]);
            }
          }}
        >
          <Badge
            color="secondary"
            variant={
              socketContext.onlineUsers.includes(friend?._id) ? "dot" : ""
            }
          >
            <Avatar src={friend?.profileImg}></Avatar>
          </Badge>
          <Typography>
            {friend?.name.charAt(0).toUpperCase().concat(friend?.name.slice(1))}
          </Typography>

          <Box
            width={"100%"}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              id="avatar-btn"
              aria-controls={open ? "avatar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <img src={menu} alt="menu" />
            </Button>
            <Menu
              id="avatar-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "avatar-btn",
              }}
            >
              <MenuItem
                onClick={() => {
                  console.log(friend);
                  handleRemoveFriend(friend?._id);
                }}
              >
                Remove
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Friend;
