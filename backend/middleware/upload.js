const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'hotelImages') {
      uploadPath += 'hotels/';
    } else if (file.fieldname === 'roomImages') {
      uploadPath += 'rooms/';
    } else {
      uploadPath += 'misc/';
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const uploadSingle = (fieldName = 'avatar') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

const uploadMultiple = (fieldName = 'images', maxCount = 10) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    multipleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

const uploadRoomImages = upload.array('roomImages', 5);

const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'hotelImages', maxCount: 10 },
  { name: 'roomImages', maxCount: 5 }
]);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadRoomImages,
  uploadFields
};