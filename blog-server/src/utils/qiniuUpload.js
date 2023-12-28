// 上传到七牛
let qiniu = require("qiniu"); // 需要加载qiniu模块的

const { ACCESSKEY, SECRETKEY, BUCKET } = require("../config/config.default");

const mac = new qiniu.auth.digest.Mac(ACCESSKEY, SECRETKEY);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const upToQiniu = (filePath, key) => {
  const accessKey = ACCESSKEY; // AK密钥
  const secretKey = SECRETKEY; // SK密钥
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  // bucket是存储空间名称
  const options = {
    scope: BUCKET, // 存储空间名称
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  // 生成token 作为个人七牛云账号的识别标识
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config();
  // 空间对应的机房 一定要按自己属区Zone对象
  config.zone = qiniu.zone.Zone_z2;
  const localFile = filePath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolved, reject) => {
    // 以文件流的形式进行上传
    // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
    // putExtra是上传的文件参数，采用源码中的默认参数
    formUploader.putStream(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr);
      } else {
        resolved(respBody);
      }
    });
  });
};

const deleteImgs = (imgList) => {
  let deleteOperations = [];
  imgList.forEach((v) => {
    deleteOperations.push(qiniu.rs.deleteOp(BUCKET, v));
  });

  bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
    if (err) {
      console.log(err);
      //throw err;
    } else {
      // 200 is success, 298 is part success
      if (parseInt(respInfo.statusCode / 100) == 2) {
        respBody.forEach(function (item) {
          if (item.code == 200) {
            console.log(item.code + "\tsuccess");
          } else {
            console.log(item.code + "\t" + item.data.error);
          }
        });
      } else {
        console.log(respInfo.deleteusCode);
        console.log(respBody);
      }
    }
  });
};

module.exports = {
  deleteImgs,
  upToQiniu,
};
