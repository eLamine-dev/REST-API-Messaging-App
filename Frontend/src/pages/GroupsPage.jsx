import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import useConversations from "../hooks/useConversations";

function GroupsPage() {
  const { chatState } = useContext(AppContext);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const {
    createConversation,
    openConversationDetails,
    searchGroups,
    joinGroup,
  } = useConversations();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await searchGroups(searchQuery);
      console.log(results);

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="groups-page">
      <h2>Create a Group</h2>
      <input
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={() => createConversation(groupName, true)}>
        Create
      </button>

      <h2>Search Groups</h2>
      <input
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h3>Search Results</h3>
      {searchResults.map((group) => (
        <div key={group.id} className="group-item">
          <p>{group.name}</p>
          <button onClick={() => joinGroup(group)}>Join Group</button>
        </div>
      ))}

      <h2>Your Groups</h2>
      {chatState.groupConversations.length === 0 ? (
        <p>No groups yet</p>
      ) : (
        chatState.groupConversations.map((group) => (
          <div
            key={group.id}
            className="group-item"
            onClick={() => openConversationDetails(group)}
          >
            <p>{group.name}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupsPage;
