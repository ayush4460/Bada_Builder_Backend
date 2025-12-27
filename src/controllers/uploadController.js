const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'bada_builder',
    },
    (error, result) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};
