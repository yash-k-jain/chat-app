import React from "react";

import { Box, Typography, Avatar, Button } from "@mui/material";

import { useQuery, useMutation, useQueryClient } from "react-query";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import { toast } from "react-hot-toast";

const Request = ({ setSelected }) => {
  const queryClient = useQueryClient();

  const { data: requestsArray } = useQuery({
    queryKey: ["requests"],
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) => {
      try {
        const res = await fetch(`/api/user/acceptRequest/${requestId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to accept request");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      setSelected("chats");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request accepted");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requestId) => {
      try {
        const res = await fetch(`/api/user/rejectRequest/${requestId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to reject request");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      setSelected("chats");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request rejected");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Box m={".5rem"}>
      <Typography>{`Requests(${requestsArray?.length})`}</Typography>
      {requestsArray?.map((user) => {
        return user.requests.map((request) => {
          console.log(request);
          return (
            <Box
              key={request._id}
              sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}
            >
              <Avatar src={request?.senderId?.profileImg || ""}></Avatar>
              <Typography>
                {request?.senderId?.name
                  .charAt(0)
                  .toUpperCase()
                  .concat(request?.senderId?.name.slice(1)) || "Unknown"}
              </Typography>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"flex-end"}
                width={"100%"}
              >
                <Button
                  onClick={() => acceptRequest(request._id)}
                  variant="outlined"
                >
                  <DoneIcon />
                </Button>
                <Button
                  onClick={() => rejectRequest(request._id)}
                  variant="outlined"
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
          );
        });
      })}
    </Box>
  );
};

export default Request;
