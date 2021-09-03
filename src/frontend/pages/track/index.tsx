import jszip from "jszip";
import { ChangeEvent, useState } from "react";

export interface ConfigurationData {
  name: string;
  description: string;
  tags?: string[];
  geotags?: string[];
  country?: string;
  city?: string;
  length?: string;
  width?: string;
  pitboxes?: string;
  author?: string;
  version?: string;
  url?: string;
  year?: number;
}

export interface Configuration {
  preview?: Blob;
  subtrack?: string;
  data?: ConfigurationData;
}

export interface TrackData {
  name: string;
  configurations: Configuration[];
}

export default function Track() {
  const [trackData, setTrackData] = useState<TrackData>();
  const read = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const { files } = await jszip.loadAsync(file);
      const tracks: { [key: string]: Configuration } = {};
      let trackName: string;
      for (const [key, content] of Object.entries(files)) {
        if (key.endsWith("ui_track.json") || key.endsWith("preview.png")) {
          const path = key.split("/");
          const track = path[path.lastIndexOf("ui") - 1];
          if (!trackName) trackName = track;
          const isSubTrack = path.lastIndexOf("ui") + 2 !== path.length;
          const addData: Configuration = {};
          if (key.endsWith("preview.png")) {
            const blob = await content.async("blob");
            addData.preview = new Blob([blob], { type: "image/png" });
          }
          if (key.endsWith("ui_track.json")) {
            const str = await content.async("text");
            addData.data = JSON.parse(str);
          }
          const name = isSubTrack ? path[path.length - 2] : "index";
          tracks[name] = {
            ...tracks[name],
            ...addData,
          };
        }
        const configurations: Configuration[] = [];
        for (const [key, content] of Object.entries(tracks)) {
          if (content.data) {
            configurations.push({
              subtrack: key === "index" ? null : key,
              ...content,
            });
          }
        }
        setTrackData({ name: trackName, configurations });
      }
    }
  };

  return (
    <>
      <input type="file" onChange={read} accept="application/octet-stream" />
      {trackData && (
        <>
          {trackData.name}
          <br />
          {trackData.configurations.map((track) => (
            <div>
              <p>Title: {track.data.name}</p>
              <p>Description: {track.data.description}</p>
              <img
                src={URL.createObjectURL(track.preview)}
                alt={`${track.data.name} preview`}
              ></img>
            </div>
          ))}
        </>
      )}
    </>
  );
}
