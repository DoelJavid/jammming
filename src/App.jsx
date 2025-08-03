
import {useCallback, useState} from "react";
import {getAccessToken} from "./utilities/authorization";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";

/**
  @import {Track} from "./Track"
  @import {JSX} from "react"
*/

/**
  The base container component for the application.

  @returns {JSX.Element}
*/
function App() {
  getAccessToken();

  // Hardcoded array of tracks to test the track list.
  // const [tracklist, setTracklist] = useState([
  //   {
  //     name: "Albuquerque",
  //     artist: "\"Weird Al\" Yankovic",
  //     album: "Running With Scissors",
  //     id: "2Ec0liSMY2h4XORHyzKCmY"
  //   },
  //   {
  //     name: "Everything You Know Is Wrong",
  //     artist: "\"Weird Al\" Yankovic",
  //     album: "Bad Hair Day",
  //     id: "3bEIbBCkFaqzvtWjKdQ74c"
  //   },
  //   {
  //     name: "Polka Face",
  //     artist: "\"Weird Al\" Yankovic",
  //     album: "Alpocalypse",
  //     id: "2ELqO1C2U6vhg1BfYp7QhG"
  //   },
  //   {
  //     name: "White & Nerdy",
  //     artist: "\"Weird Al\" Yankovic",
  //     album: "Straight Outta Lynwood",
  //     id: "60R2v9lheAu3lwZwAFxMZK"
  //   }
  // ]);
  const [query, setQuery] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");

  /**
    Event handler to handle adding tracks to the playlist.
    @type {(track: Track) => void}
  */
  const handleAdd = useCallback((track) => {
    setPlaylist((playlistData) => {
      if (!playlistData.find((playlistTrack) => playlistTrack.id === track.id)) {
        return [track, ...playlistData];
      }
      return playlistData;
    });
  }, [playlist]);

  /**
    Event handler to handle removing tracks from the playlist.
    @type {(idx: number) => void}
  */
  const handleRemove = useCallback((idx) => setPlaylist(
    (playlistData) => playlistData.filter(
      (_, playlistIdx) => playlistIdx !== idx
    )
  ), [playlist]);

  /**
    Event handler to handle searching tracks in Spotify.
    @type {(query: string) => void}
  */
  const handleSearch = useCallback((query) => {
    setQuery(query);
  }, []);

  /**
    Event handler to handle renaming the playlist.
    @type {(newName: string) => void}
  */
  const handleRename = useCallback((newName) => {
    setPlaylistName(newName);
  }, []);

  return (
    <>
      <h1>Ja<span style={{color: "var(--accent-color)"}}>mmm</span>ing</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="h-box">
        <SearchResults query={query} onAddTrack={handleAdd} />
        <Playlist name={playlistName} tracks={playlist} onRemoveTrack={handleRemove} onRename={handleRename} />
      </div>
    </>
  );
}

export default App;

