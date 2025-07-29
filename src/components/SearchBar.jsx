
import {useState} from "react";

/**
  @import {JSX} from "react";
*/

/**
  Component used to search the user's Spotify library.

  @param {Object} props
  @param {(query: string) => void} props.onSearch
  @returns {JSX.Element}
*/
function SearchBar({onSearch}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="search">
      <input
        className="search-input"
        value={searchQuery}
        placeholder="Search"
        onKeyDown={(e) => (e.key === "Enter" || e.code === 13) && onSearch(searchQuery)}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-button" onClick={() => onSearch(searchQuery)}>Search</button>
    </div>
  );
}

export default SearchBar;

