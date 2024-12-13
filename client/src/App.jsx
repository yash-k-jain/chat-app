import "./App.css";
import Navbar from "./components/common/Navbar.jsx";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import MessageState from "./context/MessageState.jsx";
import SocketState from "./context/socket/SocketState.jsx";

import { useQuery } from "react-query";

const App = () => {

  const { data: requestsArray } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/getRequests");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch requests");
        }

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  return (
    <>
      <MessageState>
        <SocketState>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/:type" element={<Auth />} />
            </Routes>
          </Router>
        </SocketState>
      </MessageState>

      <Toaster />
    </>
  );
};

export default App;
