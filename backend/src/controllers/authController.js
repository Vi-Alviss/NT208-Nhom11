const firebaseAdmin = require('firebase-admin');
const { db } = require('../config/firebase');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu!" });
    }

    try {
        const user = await firebaseAdmin.auth().getUserByEmail(email);
        const uid = user.uid;
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            await userRef.set({
                email: user.email,
                name: user.displayName || "Người dùng chưa đặt tên",
                createdAt: new Date()
            });
        }

        return res.json({
            message: "Đăng nhập thành công!",
            user: {
                uid: uid,
                email: user.email,
                name: user.displayName || "Người dùng chưa đặt tên"
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Email không tồn tại hoặc có lỗi!", error: error.message });
    }
};

module.exports = { login };