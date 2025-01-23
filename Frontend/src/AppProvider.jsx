import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppContext } from "./utils/AppContext";

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
    conversation: { type: "chat-room", id: null },
    chatRoomId: null,
  });

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        setState({
          token: null,
          user: null,
        });
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/validate-token",
          {
            headers: { Authorization: `${token}` },
          }
        );

        // setState((prevState) => ({
        //    ...prevState,
        //    token,
        //    user: response.data.user,
        // }));

        const chatRoomIdResponse = await axios.get(
          "http://localhost:5000/api/conversations/get-chatroom",
          { headers: { Authorization: `${token}` } }
        );

        console.log(chatRoomIdResponse);

        setState((prevState) => ({
          ...prevState,
          token,
          user: response.data.user,
          chatRoomId: chatRoomIdResponse.data,
          conversation: { type: "chat-room", id: chatRoomIdResponse.data },
        }));
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
        setState({
          token: null,
          user: null,
        });
      }
    };

    validateToken();
  }, []);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
