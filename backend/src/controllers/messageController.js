import database from "../config/database.js";

// Lấy tất cả tin nhắn trong một cuộc hội thoại
const getMessages = async (req, res) => {
  try {
    const { conversationID } = req.params;

    const result = await database.query(
      `SELECT * FROM messages WHERE conversationid = $1 ORDER BY createdat ASC`,
      [conversationID]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy những tin nhắn gần đây nhất của tất cả cuộc hội thoại
const getLastestMessages = async (req, res) => {
  try {
    const userID = req.user.userid;

    const result = await database.query(
      `SELECT 
          m.conversationid,
          m.content AS lastmessage,
          m.createdat,
          u.userid AS senderid,
          u.username AS sendername
      FROM messages m
      JOIN (
          SELECT conversationid, MAX(createdat) AS latestmessagetime
          FROM messages
          GROUP BY conversationid
      ) latest 
        ON m.conversationid = latest.conversationid 
        AND m.createdat = latest.latestmessagetime
      JOIN users u 
        ON m.senderid = u.userid
      WHERE m.conversationid IN (
          SELECT conversationid
          FROM user_conversations
          WHERE userid = $1
      )
      ORDER BY m.createdat DESC`,
      [userID]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching latest messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Gửi tin nhắn mới
const sendMessage = async (req, res) => {
  try {
    const userID = req.user.userid;
    const { conversationID, content } = req.body;

    if (!conversationID || !content) {
      return res
        .status(400)
        .json({ message: "Conversation ID and message are required" });
    }

    const result = await database.query(
      `INSERT INTO messages (conversationid, senderid, content, createdat) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING messageid, createdat`,
      [conversationID, userID, content]
    );

    const userResult = await database.query(
      `SELECT username FROM users WHERE userid = $1`,
      [userID]
    );

    const newMessage = {
      id: result.rows[0].messageid,
      conversationid: conversationID,
      senderid: userID,
      sendername: userResult.rows[0]?.username || "Unknown",
      content,
      createdat: result.rows[0].createdat,
    };

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getMessages, getLastestMessages, sendMessage };
