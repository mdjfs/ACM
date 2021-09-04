import { useState } from "react";
import { Track } from "../../modules/content";
import "./track.scss";

interface TrackProps {
  data: Track;
}

export default ({ data }: TrackProps) => {
  const tracks = [data, ...data.subtracks].filter((t) => !!t.content);
  const [selected, setSelected] = useState(0);
  const track = tracks[selected];
  return (
    <div className="track">
      <img
        className="preview"
        alt={`${track.content.name} preview`}
        src={URL.createObjectURL(track.preview)}
      ></img>
      <div className="data">
        <h1>{track.content.name}</h1>
        <p>{track.content.description}</p>
        <div className="footer">
          {track.content.pitboxes && (
            <i className="slots">{track.content.pitboxes} Slots</i>
          )}
          <br />
          {track.content.author && (
            <i className="author">Author: {track.content.author}</i>
          )}
        </div>
      </div>
      {tracks.length > 1 && (
        <div className="subtrack-selector">
          {tracks.map((_, i) => (
            <button
              onClick={() => setSelected(i)}
              key={`track-${i}`}
              className={`data-track ${i === selected ? "selected" : ""}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};
