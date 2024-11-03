const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/react', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

// Định nghĩa mô hình User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, sparse:true},
    password: { type: String, required: true },
    avatar: { type: String, default: 'default.png' }
}, { versionKey: false });

// Định nghĩa mô hình User với collection tên là 'react_db'
const User = mongoose.model('User', userSchema, 'react_db');



// Setup đường dẫn upfile
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Lấy danh sách người dùng
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Đăng ký người dùng mới
// const { v4: uuidv4 } = require('uuid');
app.post('/register', upload.single('avatar'), async (req, res) => {
    const { username, password } = req.body;
    const avatar = req.file ? req.file.filename : 'default.png';
    // const id = uuidv4(); // Tạo id duy nhất

    try {
        // Kiểm tra tài khoản đã tồn tại
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'Tài khoản đã tồn tại' });
        }

        // Tạo người dùng mới
        const newUser = new User({username, password, avatar });
        await newUser.save();
        res.json({ success: true, message: 'Đã thêm người dùng' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, message: 'Đăng nhập thành công', user });
        } else {
            res.json({ success: false, message: 'Tài khoản hoặc mật khẩu sai' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Đổi mật khẩu
app.put('/reset-password', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        user.password = password;
        await user.save();
        res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Xóa tài khoản
app.delete('/delete-account', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        await user.deleteOne();
        res.json({ success: true, message: 'Đã xóa tài khoản' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
