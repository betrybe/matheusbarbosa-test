const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, image, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, image, cb) => {
        const extensaoArquivo = image.mimetype.split('/')[1];
        cb(null, `${req.params.id}.${extensaoArquivo}`);
        req.arqExt = extensaoArquivo;
    },
});

module.exports = multer({ storage });
