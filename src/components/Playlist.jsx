
import {useCallback, useState} from "react";
import Track from "./Track";
import Tracklist from "./Tracklist";
import {getAccessToken, getUserProfile} from "../utilities/authorization";

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Creates a playlist with the given tracks

  @param {string} name
  @param {Track[]} tracks
  @returns {Promise}
*/
async function createPlaylist(name, tracks) {
  const [token, profile] = await Promise.all([getAccessToken(), getUserProfile()]);
  const createResponse = await fetch(
    `https://api.spotify.com/v1/users/${profile.id}/playlists`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        public: false
      })
    }
  );
  const createdPlaylist = await createResponse.json();

  if (!createResponse.ok) {
    const {error} = createdPlaylist;
    throw Error(`${error.status}: ${error.message}`);
  }

  const addTrackResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${createdPlaylist.id}/tracks`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uris: tracks.map((track) => track.uri),
        position: 0
      })
    }
  );

  if (!addTrackResponse.ok) {
    const {error} = await addTrackResponse.json();
    throw Error(`${error.status}: ${error.message}`);
  }

  console.log("Created new playlist successfully!");
}

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

  /**
    Event handler to handle saving the playlist.

    @type {() => void}
  */
  const handleSave = useCallback(() => {
    createPlaylist(name, playlist);

    console.log("Saved playlist to Spotify.");
  }, [name, playlist]);

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

      <Tracklist
        tracks={tracks}
        inPlaylist={true}
        onInteract={(track) =>
          onRemoveTrack(
            playlist.findIndex((playlistTrack) => playlistTrack.id === track.id)
          )
        }
      />
      {/*<ul>
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
      </ul>*/}

      <button onClick={handleSave}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;

