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
      };

    case "LEAVE_GROUP":
      return {
        ...state,
        groupConversations: state.groupConversations.filter(
          (g) => g.id !== action.payload
        ),
      };

    case "ADD_MEMBER":
      return {
        ...state,
        groupConversations: state.groupConversations.map((group) =>
          group.id === action.payload.groupId
            ? { ...group, members: [...group.members, action.payload.user] }
            : group
        ),
      };

    case "JOIN_GROUP":
      return {
        ...state,
        groupConversations: state.groupConversations.some(
          (group) => group.id === action.payload.id
        )
          ? state.groupConversations
          : [...state.groupConversations, action.payload],
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
      };
    case "RESET_CHAT_STATE":
      return { ...chatInitialState };

    default:
      return state;
  }
};

const friendsInitialState = {
  acceptedRequests: [],
  pendingRequests: { sent: [], received: [] },
  selectedUserId: null,
};

function friendsReducer(state, action) {
  switch (action.type) {
    case "SET_FRIENDS":
      return { ...state, friends: action.payload };
    case "SET_FRIEND_REQUESTS":
      return {
        ...state,
        acceptedRequests: action.payload.acceptedRequests,
        pendingRequests: {
          sent: action.payload.pendingRequests.sent,
          received: action.payload.pendingRequests.received,
        },
      };
    case "SEND_FRIEND_REQUEST":
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          sent: [...state.pendingRequests.sent, action.payload],
        },
      };
    case "SET_SELECTED_USER":
      return { ...state, selectedUserId: action.payload };
    case "ACCEPT_FRIEND_REQUEST":
      return {
        ...state,
        acceptedRequests: [...state.acceptedRequests, action.payload],
        pendingRequests: {
          ...state.pendingRequests,
          received: state.pendingRequests.received.filter(
            (req) => req.id !== action.payload.id
          ),
        },
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
    case "RESET_FRIENDS_STATE":
      return { ...friendsInitialState };
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

        const user = response.data.user;

        authDispatch({
          type: "LOGIN",
          payload: { token, user },
        });
      } catch (error) {
        authDispatch({ type: "LOGOUT" });
      }
    };

    validateToken();
  }, []);

  // useEffect(() => {
  //   if (!authState.token || authState.user) return;

  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/api/users/profile",
  //         {
  //           headers: { Authorization: authState.token },
  //         }
  //       );
  //       console.log(response.data);

  //       const { acceptedRequests, pendingRequests, conversations } =
  //         response.data;

  //       friendsDispatch({
  //         type: "SET_FRIEND_REQUESTS",
  //         payload: { acceptedRequests, pendingRequests },
  //       });

  //       chatDispatch({
  //         type: "SET_CONVERSATIONS",
  //         payload: {
  //           private: conversations.filter((c) => !c.isGroup),
  //           group: conversations.filter((c) => c.isGroup),
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };

  //   fetchUserProfile();
  // }, [authState.token]);

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
