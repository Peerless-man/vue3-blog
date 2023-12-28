// https://www.npmjs.com/package/minio
const Minio = require("minio");

const { MINIO_ACCESSKEY, MINIO_SECRETKEY, MINIO_BUCKET, MINIO_PATH } = require("../config/config.default");

const minioClient = new Minio.Client({
  endPoint: MINIO_PATH,
  port: 9000,
  useSSL: false,
  accessKey: MINIO_ACCESSKEY,
  secretKey: MINIO_SECRETKEY,
});

// 生成随机文件名
const generateRandomFileName = (length) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // ASCII编码表中包含所有英文字母及其大写形式
  var fileName = "";

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    fileName += chars[randomIndex];
  }

  return fileName;
};

function bucketExists() {
  // 判断bucket是否存在
  return new Promise((resolve) => {
    minioClient.bucketExists(MINIO_BUCKET, function (err) {
      if (err) {
        if (err.code == "NoSuchBucket") return console.log("bucket does not exist.");
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function upload(filePath) {
  const metaData = {
    "Content-Type": "application/octet-stream",
    "X-Amz-Meta-Testing": 1234,
    example: 5678,
  };

  const fileName = generateRandomFileName(12);

  // fPutObject(bucketName, objectName, filePath, metaData[, callback])
  return new Promise((resolve) => {
    minioClient.fPutObject(MINIO_BUCKET, fileName, filePath, metaData, function (err) {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        resolve("/blog-images/" + fileName);
      }
    });
  });
}

// 删除minio图片
function deleteMinioImgs(imgList) {
  imgList.forEach((v) => {
    minioClient.removeObject(MINIO_BUCKET, v);
  });
}
// 上传文件
const minioUpload = async (filePath) => {
  const exist = await bucketExists();
  if (!exist) {
    console.log("bucket不存在");
    return;
  }

  const url = await upload(filePath);
  if (url) {
    return url;
  } else {
    return false;
  }
};

module.exports = {
  minioUpload,
  generateRandomFileName,
  deleteMinioImgs,
};
