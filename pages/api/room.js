import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  // console.log(user);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }
  const chatrooms = readChatRoomsDB();

  return res.status(200).json({
    ok: true,
    rooms: chatrooms.map((x) => {
      return { roomId: x.roomId, roomName: x.roomName };
    }),
  });
  //create room data and return response
}
