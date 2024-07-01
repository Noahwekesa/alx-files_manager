const crypto = require("crypto"); // For password hashing
const dbClient = require("../utils/db"); // Assuming db.js is in utils folder

class UsersController {
  static async postNewUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }

    const existingUser = await dbClient.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Already exist" });
    }

    const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");

    const newUser = { email, password: hashedPassword };

    try {
      const insertedUser = await dbClient.createUser(newUser);
      return res.status(201).json({ id: insertedUser._id, email });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMe(req, res) {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await dbClient.findUserById(userId);
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
