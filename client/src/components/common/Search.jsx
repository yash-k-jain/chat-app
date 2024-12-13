import React, { useEffect } from "react";

import {
  Box,
  TextField,
  Button,
  Card,
  CardHeader,
  Avatar,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { useMutation, useQuery, useQueryClient } from "react-query";

import formattedJoinedDate from "../../utils/date/formattedJoinedDate";

import { toast } from "react-hot-toast";

const Search = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [submit, setSubmit] = React.useState("");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: searchUser } = useQuery({
    queryKey: ["searchUser", search],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/profile/${submit}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to search user");
        }
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!submit,
  });

  const { mutate: sendRequest, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/user/sendRequest/${searchUser._id}`, {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to send request");
        }

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      setSearch("");
      setSubmit("");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Request sent successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: removeFriend } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/user/removeFriend/${searchUser._id}`, {
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
      setSearch("");
      setSubmit("");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Friend removed successfully");
    },

    onError: (error) => {
      setSubmit("");
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(search);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <Box
        display={"flex"}
        margin={".5rem"}
        sx={{ borderBottom: "1px solid black", padding: "10px" }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "16px", width: "100%" }}
        >
          <input
            type="text"
            placeholder="USER ID"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            style={{
              borderRadius: "25px",
              padding: "8px",
              border: "1px solid black",
              outline: "none",
              flexGrow: 1,
            }}
          />
          <button
            type="submit"
            style={{
              borderRadius: "50%",
              border: "1px solid black",
              outline: "none",
              width: "40px",
              height: "40px",
            }}
          >
            <SearchIcon />
          </button>
        </form>
      </Box>

      {searchUser && (
        <Card
          sx={{
            width: "95%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "adsolute",
          }}
        >
          <CardHeader
            avatar={<Avatar src={searchUser?.profileImg}></Avatar>}
            title={searchUser?.name
              .charAt(0)
              .toUpperCase()
              .concat(searchUser?.name.slice(1))}
            subheader={formattedJoinedDate(searchUser?.createdAt)}
          />
          <Button
            onClick={() => {
              if (searchUser.friends.includes(authUser._id)) {
                removeFriend();
              } else {
                sendRequest();
              }
            }}
            variant="outlined"
            sx={{ height: "56px", marginRight: 2 }}
          >
            {searchUser.friends.includes(authUser._id) ? "Remove" : "Add"}
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default Search;
