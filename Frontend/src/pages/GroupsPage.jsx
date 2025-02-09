import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function GroupsPage() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const createGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/groups",
        { name: groupName },
        { headers: { Authorization: authState.token } }
      );
      setGroupName("");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const searchGroups = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/search?query=${searchQuery}`,
        { headers: { Authorization: authState.token } }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching groups:", error);
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
      <button onClick={createGroup}>Create</button>

      <h2>Search Groups</h2>
      <input
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchGroups}>Search</button>

      <h3>Search Results</h3>
      {searchResults.map((group) => (
        <div key={group.id} className="group-item">
          <p>{group.name}</p>
          <button>Join Group</button>
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
            onClick={() =>
              chatDispatch({
                type: "SET_SELECTED_CONVERSATION",
                payload: group,
              })
            }
          >
            <p>{group.name}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupsPage;
