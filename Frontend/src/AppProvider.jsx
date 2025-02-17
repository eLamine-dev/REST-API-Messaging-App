import { createContext, useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppContext } from "./utils/AppContext";

const authInitialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return { ...state, token: null, user: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const chatInitialState = {
  chatRoom: null,
  privateConversations: [],
  groupConversations: [],
  currConversationId: null,
  selectedConversationId: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return {
        ...state,
        privateConversations: action.payload.private,
        groupConversations: action.payload.group,
      };

    case "SET_CURRENT_CONVERSATION":
      return {
        ...state,
        currConversationId: action.payload,
      };

    case "SET_SELECTED_CONVERSATION":
      return { ...state, selectedConversationId: action.payload };

    case "UPDATE_CONVERSATION_MESSAGES":
      return {
        ...state,
        privateConversations: state.privateConversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? { ...conv, messages: action.payload.messages }
            : conv
        ),
        groupConversations: state.groupConversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? { ...conv, messages: action.payload.messages }
            : conv
        ),
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        privateConversations: state.privateConversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? { ...conv, messages: [...conv.messages, action.payload.message] }
            : conv
        ),
        groupConversations: state.groupConversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? { ...conv, messages: [...conv.messages, action.payload.message] }
            : conv
        ),
        currConversation:
          state.currConversation?.id === action.payload.conversationId
            ? {
                ...state.currConversation,
                messages: [
                  ...state.currConversation.messages,
                  action.payload.message,
                ],
              }
            : state.currConversation,
      };

    case "SET_CHATROOM":
      return { ...state, chatRoom: action.payload };

    case "CREATE_CONVERSATION":
      if (action.payload.isGroup) {
        return {
          ...state,
          groupConversations: [...state.groupConversations, action.payload],
        };
      } else {
        return {
          ...state,
          privateConversations: [...state.privateConversations, action.payload],
        };
      }

    case "DELETE_CONVERSATION":
      return {
        ...state,
        privateConversations: state.privateConversations.filter(
          (c) => c.id !== action.payload
        ),
        groupConversations: state.groupConversations.filter(
          (c) => c.id !== action.payload
        ),
        currConversation:
          state.currConversation?.id === action.payload
            ? null
            : state.currConversation,
      };

    case "LEAVE_GROUP":
      return {
        ...state,
        groupConversations: state.groupConversations.filter(
          (g) => g.id !== action.payload
        ),
        currConversation:
          state.currConversation?.id === action.payload
            ? null
            : state.currConversation,
      };

    case "ADD_MEMBER":
      return {
        ...state,
        groupConversations: state.groupConversations.map((group) =>
          group.id === action.payload.groupId
            ? { ...group, members: [...group.members, action.payload.user] }
            : group
        ),
        selectedConversation:
          state.selectedConversation?.id === action.payload.groupId
            ? {
                ...state.selectedConversation,
                members: [
                  ...state.selectedConversation.members,
                  action.payload.user,
                ],
              }
            : state.selectedConversation,
      };

    case "REMOVE_MEMBER":
      return {
        ...state,
        groupConversations: state.groupConversations.map((group) =>
          group.id === action.payload.groupId
            ? {
                ...group,
                members: group.members.filter(
                  (member) => member.id !== action.payload.userId
                ),
              }
            : group
        ),
        selectedConversation:
          state.selectedConversation?.id === action.payload.groupId
            ? {
                ...state.selectedConversation,
                members: state.selectedConversation.members.filter(
                  (member) => member.id !== action.payload.userId
                ),
              }
            : state.selectedConversation,
      };

    default:
      return state;
  }
};

const friendsInitialState = {
  friends: [],
  pendingRequests: { sent: [], received: [] },
  selectedUser: null,
};

function friendsReducer(state, action) {
  switch (action.type) {
    case "SET_FRIENDS":
      return { ...state, friends: action.payload };
    case "SET_FRIEND_REQUESTS":
      return { ...state, pendingRequests: action.payload };
    case "SEND_FRIEND_REQUEST":
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          sent: [...state.pendingRequests.sent, action.payload],
        },
      };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    case "ACCEPT_FRIEND_REQUEST":
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          received: state.pendingRequests.received.filter(
            (req) => req.id !== action.payload.id
          ),
        },
        friends: [...state.friends, action.payload.sender],
      };
    case "REJECT_FRIEND_REQUEST":
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          received: state.pendingRequests.received.filter(
            (req) => req.id !== action.payload
          ),
        },
      };

    case "CANCEL_FRIEND_REQUEST":
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          sent: state.pendingRequests.sent.filter(
            (req) => req.id !== action.payload
          ),
        },
      };
    case "DELETE_FRIEND":
      return {
        ...state,
        friends: state.friends.filter((f) => f.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const [chatState, chatDispatch] = useReducer(chatReducer, chatInitialState);
  const [friendsState, friendsDispatch] = useReducer(
    friendsReducer,
    friendsInitialState
  );

  const [uiState, setUiState] = useState({
    isAddingMembers: false,
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        authDispatch({ type: "LOGOUT" });
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/validate-token",
          {
            headers: { Authorization: token },
          }
        );

        authDispatch({
          type: "LOGIN",
          payload: { token, user: response.data.user },
        });
      } catch (error) {
        authDispatch({ type: "LOGOUT" });
      }
    };

    validateToken();
  }, []);

  useEffect(() => {
    if (!authState.token) return;

    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/user",
          {
            headers: { Authorization: authState.token },
          }
        );

        chatDispatch({
          type: "SET_CONVERSATIONS",
          payload: {
            private: response.data.privateConversations,
            group: response.data.groupConversations,
          },
        });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [authState.token]);

  useEffect(() => {
    if (!authState.token) return;

    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/friends", {
          headers: { Authorization: authState.token },
        });

        friendsDispatch({ type: "SET_FRIENDS", payload: response.data });
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const fetchpendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/friends/requests",
          {
            headers: { Authorization: authState.token },
          }
        );

        friendsDispatch({
          type: "SET_FRIEND_REQUESTS",
          payload: response.data,
        });
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriends();
    fetchpendingRequests();
  }, [authState.token]);

  function isTokenExpired(token) {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  return (
    <AppContext.Provider
      value={{
        uiState,
        setUiState,
        authState,
        authDispatch,
        chatState,
        chatDispatch,
        friendsState,
        friendsDispatch,
      }}
    >
      {authState.loading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
