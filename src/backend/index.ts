import Express from "express";
import Path from "path";

const app = Express();

app.get("/", (_, res) => {
  res.sendFile(Path.join(__dirname, "../build/index.html"));
});

app.get("/js", (_, res) => {
  res.sendFile(Path.join(__dirname, "../build/build.js"));
});

export default app;
