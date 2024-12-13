import React, { useState, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Badge,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";

import Cookies from "js-cookie";

import { toast } from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "react-query";

import { useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import { MessageContext } from "../../context/MessageContext.jsx";
import { SocketContext } from "../../context/socket/SocketContext.jsx";

const NavBar = () => {
  const context = useContext(MessageContext);
  const socketContext = useContext(SocketContext);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    retry: false,
  });

  const profileRef = useRef(null);
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { mutate: logOut } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to log out");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Logged out successfully");
      Cookies.set("isRegistered", false);
      navigate("/auth/login");
      context.setSelectedChat("");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.removeQueries(["authUser"]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: changeProfileImage } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profileImg: file }),
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Profile image updated");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogOut = () => {
    if (socketContext.socket) {
      socketContext.socket.disconnect(); // Disconnect the socket explicitly
      console.log("Socket disconnected due to user logout.");
      socketContext.setSocket(null); // Ensure the socket is cleaned up
    }

    logOut();
  };

  const userNameInitial =
    authUser?.name && authUser.name.charAt(0).toUpperCase();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleImageChangeSubmit = (e) => {
    e.preventDefault();

    changeProfileImage();
    handleCloseModal();
  };
  return (
    <>
      <div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
              sx={{ fontFamily: "fantasy" }}
            >
              Set Profile Image
            </Typography>
            <hr />
            {file && (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                m={2}
              >
                <Badge
                  onClick={() => setFile("")}
                  badgeContent={
                    <CloseIcon
                      sx={{
                        fontSize: "1rem",
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  }
                  color="secondary"
                >
                  <img
                    src={file}
                    alt="profile image"
                    style={{ width: "300px", height: "200px" }}
                  />
                </Badge>
              </Box>
            )}
            <form onSubmit={handleImageChangeSubmit}>
              <input
                ref={profileRef}
                type="file"
                name="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Button
                  onClick={() => profileRef.current.click()}
                  variant="contained"
                >
                  Choose File
                </Button>
                <Button type="submit">Change Profile</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </div>

      <Box
        sx={{ position: "sticky", top: 0, zIndex: 999 }}
        component="section"
        p={2}
        bgcolor={"#d4f7f9"}
        alignItems={"center"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "fantasy",
            fontWeight: "bold",
          }}
        >
          Chat-A-Holic
        </Typography>
        <Box>
          {Cookies.get("isRegistered") === "false" ? (
            <>
              <Button
                onClick={() => navigate("/auth/register")}
                variant="outlined"
                sx={{ mr: 2, fontFamily: "fantasy" }}
              >
                Register
              </Button>
              <Button
                sx={{ fontFamily: "fantasy" }}
                onClick={() => navigate("/auth/login")}
                variant="contained"
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Box display={"flex"}>
                <Button
                  id="avatar-btn"
                  aria-controls={open ? "avatar-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <Avatar
                    sx={{ bgcolor: deepPurple[500] }}
                    src={authUser?.profileImg || null}
                  >
                    {!authUser?.profileImg && userNameInitial}
                  </Avatar>
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
                      navigator.clipboard.writeText(authUser?._id);
                      toast.success("ID copied to clipboard");
                      handleClose();
                    }}
                  >
                    {authUser?.name.charAt(0).toUpperCase() +
                      authUser?.name.slice(1)}
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenModal()}>
                    Set Profile Image
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleLogOut();
                    }}
                  >
                    Log Out
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default NavBar;
