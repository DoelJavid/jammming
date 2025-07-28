
import {useState} from "react";
import Track from "./Track";

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Playlist component to contain all tracks on the user's playlist.

  @param {Object} props
  @param {string} props.name
  @param {(Track | Track[])?} props.tracks
  @param {(idx: number) => void} props.onRemoveTrack
  @param {(newName: string) => void} props.onRename
  @returns {JSX.Element}
*/
function Playlist({name, tracks, onRemoveTrack, onRename}) {
  const [editName, setEditName] = useState(false);

  let playlist = tracks;
  if (!(playlist instanceof Array)) {
    playlist = playlist ? [playlist] : [];
  }

  return (
    <div className="playlist">
      {editName ? (
        <input
          className="playlist-name"
          value={name}
          onChange={(e) => onRename(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" || e.code === 13) && setEditName(false)}
          onBlur={() => setEditName(false)}
          autoFocus
        />
      ) : (
        <h2 className="playlist-name">
          {name}
          <button className="playlist-edit-name" onClick={() => setEditName(true)}>
            Set Name
          </button>
        </h2>
      )}

      <ul>
        {playlist.map((track, idx) => (
          <li key={`playlist_${track.artist}_${track.id}`}>
            <Track
              name={track.name}
              artist={track.artist}
              inPlaylist={true}
              onButtonClick={() => onRemoveTrack(idx)}
            />
          </li>
        ))}
      </ul>

      <button>Save to Spotify</button>
    </div>
  );
}

export default Playlist;

