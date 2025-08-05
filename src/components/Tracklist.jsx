
import Track from "./Track";
import styles from "./Tracklist.module.css";

/**
  @import {JSX} from "react"
  @import {Track} from "./Track"
*/

/**
  Container component that contains a list of tracks.

  @param {Object} props
  @param {(Track | Track[])?} props.tracks
  @param {boolean} props.inPlaylist
  @param {(idx: number) => void} props.onInteract
  @returns {JSX.Element}
*/
function Tracklist({tracks, inPlaylist, onInteract}) {
  let tracksList = tracks;
  if (!(tracksList instanceof Array)) {
    tracksList = tracksList ? [tracksList] : [];
  }

  return (
    <ul className={styles.tracklist}>
      {tracksList.map((track, idx) => (
        <li key={`${track.artist}_${track.id}`} className={styles.listitem}>
          <Track
            name={track.name}
            artist={track.artist}
            thumbnail={track.thumbnail}
            inPlaylist={inPlaylist}
            onButtonClick={() => onInteract(track)}
          />
        </li>
      ))}
    </ul>
  );
}

export default Tracklist;

