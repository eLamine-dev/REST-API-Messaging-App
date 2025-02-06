import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppContext } from "./utils/AppContext";

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
  });
  //TODO: move user friends state here to share it between friendsList and Friends page
  // const [userFriends, setUserFriends] = useState([]);

  const [userConversations, setUserConversations] = useState({
    chatRoom: null,
    privateConversations: [],
    groupConversations: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/auth/validate-token",
          {
            headers: { Authorization: `${token}` },
          }
        );

        setState((prevState) => ({
          ...prevState,
          token,
          user: response.data.user,
        }));
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
        setState({
          token: null,
          user: null,
        });
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        selectedUser,
        setSelectedUser,
        selectedGroup,
        setSelectedGroup,
        userConversations,
        setUserConversations,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
