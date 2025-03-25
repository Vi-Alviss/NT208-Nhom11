const { db } = require('../config/firebase');

const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách user!', error });
  }
};

module.exports = { getUsers };