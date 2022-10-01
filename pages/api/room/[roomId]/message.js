import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const username = checkToken(req);
    if (!username)
      return res.status(401).json({
        ok: false,
        message: "You don't permission to access this api",
      });

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const checkroomid = rooms.find((x) => x.roomId === roomId);

    if (!checkroomid) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }

    //find room and return
    //...

    return res.json({
      ok: true,
      messages: checkroomid.messages,
    });
  } else if (req.method === "POST") {
    //check token
    const username = checkToken(req);
    if (!username)
      return res.status(401).json({
        ok: false,
        message: "You don't permission to access this api",
      });

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const checkroomid = rooms.find((x) => x.roomId === roomId);

    if (!checkroomid) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    //validate body
    if (
      typeof req.body.text !== "string" ||
      req.body.text.length === 0 ||
      req.body.text === undefined
    )
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newId = uuidv4();
    const newText = {
      messageId: newId,
      text: req.body.text,
      username: username.username,
    };
    // console.log(newText);

    const newchat = rooms.find((x) => x.roomId === roomId).messages;
    // console.log(rooms.find((x) => x.roomId === roomId).messages);
    newchat.push(newText);
    writeChatRoomsDB(rooms);

    return res.json({ ok: true, message: newText });
  }
}
