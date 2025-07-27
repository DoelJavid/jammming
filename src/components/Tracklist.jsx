
import Track from "./Track"

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Container component that contains a list of tracks.

  @param {Object} props
  @param {(Track | Track[])?} props.tracks
  @returns {JSX.Element}
*/
function Tracklist({tracks}) {
  let tracksList = tracks;
  if (!(tracksList instanceof Array)) {
    tracksList = tracklist ? [tracksList] : [];
  }

  return (
    <ul>
      {tracksList.map((track, idx) => (
        <li key={`${track.artist}_${track.id}`}>
          <Track name={track.name} artist={track.artist} inPlaylist={false} />
        </li>
      ))}
    </ul>
  );
}

export default Tracklist;

