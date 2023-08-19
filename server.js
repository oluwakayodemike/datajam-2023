import { WebSocketServer } from "ws";
import jsonlFile from "jsonl-db";
import { glob } from "glob";

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", async function connection(ws, req) {
  console.log("New connection:", req.url);
  try {
    const jsfiles = await glob(`**/${req.url}_events.jsonl`, {
      ignore: "node_modules/**",
    });
 
    if (jsfiles.length > 0) {
      console.log('Emitting', jsfiles[0]);
      const eventsFile = jsonlFile(jsfiles[0]);
      eventsFile.read((line) => ws.send(JSON.stringify(line)));
    } else {
      console.log('No matching files found');
    }
  } catch (error) {
    console.error("Error:", error);
  }
});