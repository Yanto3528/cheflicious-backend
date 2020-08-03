const sharp = require("sharp");
const AWS = require("aws-sdk");
const { v4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.uploadImage = async (req, res) => {
  const imageKey = `${req.user._id}/${v4()}.jpg`;
  try {
    const image = await sharp(req.file.buffer)
      .resize(500)
      .jpeg({ quality: 50 })
      .toBuffer();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Body: image,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json(data);
    });
  } catch (error) {
    res.json({
      error:
        "There was something wrong when uploading image. Please try again later.",
    });
  }
};
