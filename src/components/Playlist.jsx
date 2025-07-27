
import Track from "./Track";

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Playlist component to contain all tracks on the user's playlist.

  @param {Object} props
  @param {(Track | Track[])?} props.tracks
  @returns {JSX.Element}
*/
function Playlist({tracks}) {
  let playlist = tracks;
  if (!(playlist instanceof Array)) {
    playlist = playlist ? [playlist] : [];
  }

  return (
    <div className="playlist">
      <h2>Playlist Title</h2>

      <ul>
        {playlist.map((track) => (
          <li key={`playlist_${track.artist}_${track.id}`}>
            <Track name={track.name} artist={track.artist} inPlaylist={true} />
          </li>
        ))}
      </ul>

      <button>Save to Spotify</button>
    </div>
  );
}

export default Playlist;

