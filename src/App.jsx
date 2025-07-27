
import Tracklist from "./components/Tracklist";
import "./App.css";

/**
  @import {Track} from "./Track"
  @import {JSX} from "react"
*/

// Hardcoded array of tracks to test the track list.
const testTracks = [
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
];

/**
  The base container component for the application.

  @returns {JSX.Element}
*/
function App() {
  return (
    <>
      <Tracklist tracks={testTracks} />
    </>
  );
}

export default App;

