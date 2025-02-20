import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import useFriendActions from "../hooks/useFriendActions";
import useConversations from "../hooks/useConversations";

function FriendList() {
  const { friendsState, uiState, chatState, authState } =
    useContext(AppContext);
  const { openUserDetails, searchUsers } = useFriendActions();
  const { addMember } = useConversations();
  const { acceptedRequests } = friendsState;

  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (acceptedRequests) {
      const friends = acceptedRequests.map((req) =>
        req.sender ? req.sender : req.receiver
      );

      setFriends(friends);
    }
  }, [acceptedRequests]);

  const isMember = (user) => {
    return chatState.selectedConversation?.members.some(
      (member) => member.id === user.id
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleCancelSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="friend-list">
      <h3>{isSearching ? "Search Results" : "Friends"}</h3>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {isSearching && <button onClick={handleCancelSearch}>Cancel</button>}

      {isSearching ? (
        searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div key={user.id} className="friend-item">
              <p onClick={() => openUserDetails(user.id)}>
                <span>{user.status === "ONLINE" ? "🟢" : "⚪"}</span>{" "}
                {user.username}
              </p>
              {uiState.isAddingMembers && !isMember(user) && (
                <button
                  onClick={() =>
                    addMember(chatState.selectedConversationId, user)
                  }
                >
                  +
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )
      ) : (
        friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <p onClick={() => openUserDetails(friend.id)}>
              <span>{friend.status === "ONLINE" ? "🟢" : "⚪"}</span>{" "}
              {friend.username}
            </p>
            {uiState.isAddingMembers && !isMember(friend) && (
              <button
                onClick={() =>
                  addMember(chatState.selectedConversationId, friend)
                }
              >
                +
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FriendList;
