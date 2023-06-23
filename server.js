const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8000;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/file-server');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const uploadedFile = {
      id: Math.random().toString(),
      name: req.file.originalname,
      type: getFileType(req.file.originalname),
      path: `/file-server/${req.file.filename}`,
    };
    res.status(200).json(uploadedFile);
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// Serve static files
app.use(express.static('public'));

// Helper function to get file type
const getFileType = (fileName) => {
  const extension = path.extname(fileName).toLowerCase();
  switch (extension) {
    case '.mp4':
    case '.mov':
      return 'video';
    case '.mp3':
    case '.wav':
      return 'audio';
    case '.pdf':
    case '.doc':
    case '.docx':
      return 'document';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
    default:
      return 'unknown';
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
