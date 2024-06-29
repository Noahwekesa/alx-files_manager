const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

class AppController {
  static async getStatus(req, res) {
    const isRedisAlive = redisClient.isAlive();
    const isDBAlive = dbClient.isAlive();
    try {
      await dbClient.connect();
      return res.status(200).json({ redis: isRedisAlive, db: isDBAlive });
    } catch (error) {
      consoe.error(`Error checking DB connection:${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getStats(req, res) {
    try {
      await dbClient.connect();
      const userCount = await dbClient.nbUsers();
      const fileCount = await dbClient.nbFiles();
      return res.status(200).json({ users: userCount, files: fileCount });
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
