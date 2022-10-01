import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body; // {"username":"user1","password": "1234"}
    //validate body

    const users = readUsersDB(); //array of user
    const foundUser = users.find(
      (x) => x.username === username && bcrypt.compareSync(password, x.password)
    );
    //console.log(foundUser);

    if (!foundUser) {
      // check null || false ?
      return res
        .status(400)
        .json({ ok: false, message: "Invalid username or password" });
    }
    //find users with username, password

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        username: foundUser.username,
        isAdmin: foundUser.isAdmin,
      },
      secret,
      { expiresIn: "1800s" }
    );
    //sign token

    return res.json({
      ok: true,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
      token: token,
    });
    //return response
  }
}
