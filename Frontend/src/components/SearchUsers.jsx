import { useState } from "react";
import axios from "axios";
import ProfileModal from "./ProfileModal";

function SearchFriends() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${query}`,
        { headers: { Authorization: `${token}` } }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="search-friends">
      <input
        type="text"
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="search-results">
        {results.map((user) => (
          <div
            key={user.id}
            className="user-result"
            onClick={() => setSelectedUser(user)}
          >
            <p>{user.username}</p>
            <span>{user.status === "ONLINE" ? "🟢" : "⚪"}</span>
          </div>
        ))}
      </div>

      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onFriendRequest={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default SearchFriends;
