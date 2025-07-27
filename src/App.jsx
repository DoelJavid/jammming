
import {useCallback, useState} from "react";
import Tracklist from "./components/Tracklist";
import Playlist from "./components/Playlist";
import "./App.css";

/**
  @import {Track} from "./Track"
  @import {JSX} from "react"
*/

/**
  The base container component for the application.

  @returns {JSX.Element}
*/
function App() {
  // Hardcoded array of tracks to test the track list.
  const [tracklist, setTracklist] = useState([
    {
      name: "Albuquerque",
      artist: "\"Weird Al\" Yankovic",
      album: "Running With Scissors",
      id: "2Ec0liSMY2h4XORHyzKCmY"
    },
    {
      name: "Everything You Know Is Wrong",
      artist: "\"Weird Al\" Yankovic",
      album: "Bad Hair Day",
      id: "3bEIbBCkFaqzvtWjKdQ74c"
    },
    {
      name: "Polka Face",
      artist: "\"Weird Al\" Yankovic",
      album: "Alpocalypse",
      id: "2ELqO1C2U6vhg1BfYp7QhG"
    },
    {
      name: "White & Nerdy",
      artist: "\"Weird Al\" Yankovic",
      album: "Straight Outta Lynwood",
      id: "60R2v9lheAu3lwZwAFxMZK"
    }
  ]);
  const [playlist, setPlaylist] = useState([]);

  /**
    Event handler to handle adding tracks to the playlist.
    @type {(idx: number) => void}
  */
  const handleAdd = useCallback((idx) => {
    setPlaylist((playlistData) => {
      if (!playlistData.find((track) => track.id === tracklist[idx].id)) {
        return [tracklist[idx], ...playlistData];
      }
      return playlistData;
    });
  }, [tracklist, playlist]);

  /**
    Event handler to handle removing tracks from the playlist.
    @type {(idx: number) => void}
  */
  const handleRemove = useCallback((idx) => setPlaylist(
    (playlistData) => playlistData.filter(
      (_, playlistIdx) => playlistIdx !== idx
    )
  ), [playlist]);

  return (
    <div>
      <Tracklist tracks={tracklist} onAddTrack={handleAdd} />
      <Playlist tracks={playlist} onRemoveTrack={handleRemove} />
    </div>
  );
}

export default App;

