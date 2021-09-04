import jszip from "jszip";

export interface TrackContent {
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

export interface Track {
  preview?: Blob;
  id: string;
  subtracks?: Track[];
  content?: TrackContent;
}

export async function getTrack(file: File): Promise<Track> {
  const { files } = await jszip.loadAsync(file);
  const [id] = Object.keys(files)
    .filter((path) => path.includes("/ui/"))
    .map((path) => {
      const parts = path.split("/");
      return parts[parts.lastIndexOf("ui") - 1];
    });
  const content = Object.values(files).filter((file) =>
    file.name.endsWith("ui_track.json")
  );
  const images = Object.values(files).filter((file) =>
    file.name.endsWith("preview.png")
  );
  const track: Track = { id, subtracks: [] };
  for (const trackJSON of content) {
    const parts = trackJSON.name.split("/");
    const track_id = parts[parts.length - 2];
    const json = await trackJSON.async("text");
    if (track_id === "ui") {
      track.content = JSON.parse(json);
    } else {
      track.subtracks.push({ id: track_id, content: JSON.parse(json) });
    }
  }
  for (const trackIMG of images) {
    const parts = trackIMG.name.split("/");
    const track_id = parts[parts.length - 2];
    const blob = await trackIMG.async("blob");
    const image = new Blob([blob], { type: "image/png" });
    if (track_id === "ui") {
      track.preview = image;
    } else {
      for (const subtrack of track.subtracks) {
        if (subtrack.id === track_id) {
          subtrack.preview = image;
        }
      }
    }
  }
  return track;
}

export interface SkinContent {
  skinname: string;
  drivername?: string;
  country?: string;
  team?: string;
  number?: string;
  priority?: number;
}
export interface CarContent {
  name: string;
  description: string;
  brand?: string;
  tags?: string[];
  class?: string;
  specs?: { [key: string]: string };
  torqueCurve?: [number, number][];
  powerCurve?: [number, number][];
  country?: string;
  year?: number;
  author?: string;
  version?: string;
  url?: string;
}

export interface Skin {
  content?: SkinContent;
  preview?: Blob;
  id: string;
}

export interface Car {
  id: string;
  badge?: Blob;
  content: CarContent;
  skins: Skin[];
}

export async function getCar(file: File): Promise<Car> {
  const { files } = await jszip.loadAsync(file);
  const [id] = Object.keys(files)
    .filter((path) => path.includes("/ui/"))
    .map((path) => {
      const parts = path.split("/");
      return parts[parts.lastIndexOf("ui") - 1];
    });
  const [car_content] = Object.values(files).filter((file) =>
    file.name.endsWith("ui_car.json")
  );
  const [car_badge] = Object.values(files).filter((file) =>
    file.name.endsWith("badge.png")
  );
  if (car_content) {
    const car_content_text = await car_content.async("text");
    const car: Car = { id, content: JSON.parse(car_content_text), skins: [] };
    if (car_badge) {
      const blob = await car_badge.async("blob");
      car.badge = new Blob([blob], { type: "image/png" });
    }
    for (const [path, content] of Object.entries(files)) {
      const parts = path.split("/");
      if (parts.includes("skins") && path.endsWith("preview.jpg")) {
        const id = parts[parts.length - 2];
        const blob = await content.async("blob");
        car.skins.push({
          id,
          preview: new Blob([blob], { type: "image/jpg" }),
        });
      }
    }
    for (const [path, content] of Object.entries(files)) {
      const parts = path.split("/");
      if (parts.includes("skins") && path.endsWith("ui_skin.json")) {
        const id = parts[parts.length - 2];
        const [skin] = car.skins.filter((c) => c.id === id);
        const json = await content.async("text");
        skin.content = JSON.parse(json);
      }
    }
    return car;
  }
  return null;
}
