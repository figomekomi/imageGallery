const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ filename: req.file.filename });
});

app.get('/images', (req, res) => {
    const { name, type, date } = req.query;
    fs.readdir('uploads/', (err, files) => {
        if (err) return res.status(500).send(err);

        const filtered = files.filter(file => {
            const stats = fs.statSync(path.join('uploads', file));
            const ext = path.extname(file).toLowerCase();
            const fileDate = stats.birthtime.toISOString().split('T')[0];

            return (!name || file.includes(name)) &&
                   (!type || ext.includes(type)) &&
                   (!date || fileDate === date);
        });

        res.json(filtered);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});