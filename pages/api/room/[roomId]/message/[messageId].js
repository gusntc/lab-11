import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token
  const username = checkToken(req);
  if (!username) {
    return res
      .status(401)
      .json({ ok: false, message: "You don't permission to access this api" });
  }

  const rooms = readChatRoomsDB();

  //check if roomId exist
  const checkroomid = rooms.find((x) => x.roomId === roomId);

  if (!checkroomid) {
    return res.status(404).json({ ok: false, message: "Invalid room id" });
  }

  //check if messageId exist
  const messageIdx = checkroomid.messages.findIndex(
    (x) => x.messageId === messageId
  );

  if (messageIdx === -1) {
    res.status(404).json({
      ok: false,
      message: "Invalid message id",
    });
  }

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
  if (username.isAdmin) {
    checkroomid.messages.splice(messageIdx, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  } else if (username.username === checkroomid.messages[messageIdx].username) {
    checkroomid.messages.splice(messageIdx, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  } else {
    return res.status(403).json({
      ok: false,
      message: "You do not have permission to access this data",
    });
  }
}
