const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');

const { admin } = require('../config/firebase');

const firebaseConfig = {
    apiKey: "AIzaSyA-gWnMuwF8s-7ZAyvO_wU4uJUp1JTMM_s",
    authDomain: "login-backend-3f181.firebaseapp.com",
    projectId: "login-backend-3f181",
    storageBucket: "login-backend-3f181.firebasestorage.app",
    messagingSenderId: "109807957436",
    appId: "1:109807957436:web:2336f6db236d97c8bd67b9",
    measurementId: "G-D6B7EPE87X"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Chưa nhập email hoặc mật khẩu!" });
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return res.json({
            message: "Đăng nhập thành công!",
            user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName || "Người dùng chưa đặt tên"
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!", error: error.message });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email!" });
    }

    try {
        const resetLink = await admin.auth().generatePasswordResetLink(email);
        return res.json({ message: "Đã gửi tới email!", resetLink });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi gửi email!", error: error.message });
    }
};

module.exports = { login, forgotPassword };