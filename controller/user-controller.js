import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
export const userLogIn = async (request, response) => {
  try {
    let user = await User.findOne({
      username: request.body.username,
    });
    if (user) {
      if (comparePassword(request.body.password, user.password)) {
        console.log(user);
        const token = jwt.sign(
          { username: user.username, password: user.password },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        return response.status(200).json({ token });
      } else {
        return response.status(401).json("Invalid Login");
      }
    } else {
      return response.status(401).json("Invalid Login");
    }
  } catch (error) {
    response.json("Error: ", error.message);
  }
};

export const userSignUp = async (request, response) => {
  try {
    const exist = await User.findOne({ username: request.body.username });
    if (exist) {
      return response.status(401).json({ message: "User already exist" });
    }
    request.body.password = await hashPassword(request.body.password);
    const user = request.body;
    const newUser = await User.create(user);
    await newUser.save();
    response.status(200).json({ mesage: newUser });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
