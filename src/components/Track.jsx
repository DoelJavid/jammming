
/**
  @import {JSX} from "react"

  @typedef {{
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: Array<"CA" | "BR" | "IT">;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    restrictions: {
      reason: "market" | "product" | "explicit";
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: "track";
    uri: string;
    is_local: boolean;
  }} Track
*/

/**
  Singular track component that contains a single track.

  @param {Object} props
  @param {string} props.author
  @param {string} props.title
  @param {boolean} props.inPlaylist
  @param {(e: PointerEvent) => void} props.onButtonClick
  @returns {JSX.Element}
*/
function Playlist({artist, name, inPlaylist, onButtonClick}) {
  return (
    <div class="track">
      <h3>{name}</h3>
      <p>by {artist}</p>
      <button onClick={onButtonClick}>{inPlaylist ? "Remove from Playlist" : "Add to Playlist"}</button>
    </div>
  );
}

export default Playlist;

