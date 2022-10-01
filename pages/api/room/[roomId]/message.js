import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req); //{ username: 'admin', isAdmin: true }
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();
    //console.log(rooms);

    //check if roomId exist
    const foundRoomId = rooms.find((x) => roomId === x.roomId);
    //console.log(foundRoomId);
    //find room and return
    if (!foundRoomId) {
      //check null,false
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    return res.status(200).json({ ok: true, message: foundRoomId.messages });
    //...
  } else if (req.method === "POST") {
    const user = checkToken(req); //{ username: 'admin', isAdmin: true }
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //check token

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const foundRoomId = rooms.find((x) => roomId === x.roomId);
    console.log(foundRoomId);

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newTodo = {
      messageId: uuidv4(),
      text: req.body.text,
      username: user.username,
    };

    const findIdx = rooms.findIndex((x) => x.roomId === roomId);

    rooms[findIdx].messages.push(newTodo);

    writeChatRoomsDB(rooms);

    return res.status(200).json({ ok: true, message: newTodo });
  }
}
