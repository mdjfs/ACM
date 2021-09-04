import { useEffect, useState } from "react";
import { getTrack } from "../../modules/content";
import Track from "../../components/track";
import Container from "../../components/container";
import "./track.scss";

export default function Tracks() {
  const [tracks, setTracks] = useState([]);

  return (
    <Container>
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files[0];
          const track = await getTrack(file);
          setTracks([track, ...tracks]);
        }}
      />
      <div className="track-grid">
        {tracks.map((track) => (
          <Track data={track} />
        ))}
      </div>
    </Container>
  );
}
