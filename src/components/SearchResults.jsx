
import {useEffect, useState} from "react";
import {getAccessToken, authenticateUser} from "../utilities/authorization";
import Tracklist from "./Tracklist";

const MAX_PAGE_SIZE = 10;

/**
  Takes an array of name strings and returns a formatted string containing all
  the names in the array.

  If only one string is given, this function will return the string itself.

  If two strings are given, this function will return a string formatted as:
  `'${string0} and ${string1}'`

  If more than two strings are given, then this function will return a list of
  the names in this format:
  `'${string0}, (${string1}, )+and ${stringX}'`

  @param {string | string[]} names
  @returns {string}
*/
function unwrapNames(names) {
  if (names instanceof Array) {
    switch (names.length) {
    case 0:
      return "";
    case 1:
      return names[0];
    case 2:
      return `${names[0]} and ${names[1]}`;
    default:
      return names.reduce(
        (nameList, name, idx) =>
          nameList + (idx < names.length - 1 ? `${name}, ` : name),
        ""
      );
    }
  }

  return names;
}

/**
  Container component for all search results.

  @param {Object} props
  @param {string} props.query
  @returns {JSX.Element}
*/
function SearchResults({query, onAddTrack}) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (query) {
      console.log(`Searching tracks for ${query}...`);

      const searchParams = new URLSearchParams({
        type: "track",
        q: query
      });
      const route = `https://api.spotify.com/v1/search?${searchParams.toString()}`;

      getAccessToken().then((token) => fetch(route, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }))
      .then((result) => result.json())
      .then((result) => {
        if (result.error) {
          console.error(`${result.error.status}: ${result.error.message}`);
          return;
        }

        setResults(result.tracks.items.map((track) =>
          ({
            artist: unwrapNames(track.artists ? track.artists.map((artist) => artist.name) : ""),
            name: track.name,
            id: track.id,
            uri: track.uri
          })
        ));
      });
    }
  }, [query, page]);

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <Tracklist tracks={results} onInteract={onAddTrack} />
    </div>
  );
}

export default SearchResults;

