const multer = require('multer');

const fileFilter = (req, file, next) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        next(null, true);
    } else {
        next(Error('Invalid mimetype'), false)
    }
}
const limits = {
    fileSize: 1024 * 1024 * 3, // 3MB
}

const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, './public/uploads');
    },
    filename: (req, file, next) => {
        next(null, `${new Date().getTime()}--${req.params.id}`);
    },
});

const upload = multer({storage, limits, fileFilter}).single('avatar')

module.exports = upload;
