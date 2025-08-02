
import Track from "./Track"

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Container component that contains a list of tracks.

  @param {Object} props
  @param {(Track | Track[])?} props.tracks
  @param {(idx: number) => void} props.onAddTrack
  @returns {JSX.Element}
*/
function Tracklist({tracks, onAddTrack}) {
  let tracksList = tracks;
  if (!(tracksList instanceof Array)) {
    tracksList = tracksList ? [tracksList] : [];
  }

  return (
    <ul>
      {tracksList.map((track, idx) => (
        <li key={`${track.artist}_${track.id}`}>
          <Track
            name={track.name}
            artist={track.artist}
            inPlaylist={false}
            onButtonClick={() => onAddTrack(track)}
          />
        </li>
      ))}
    </ul>
  );
}

export default Tracklist;

