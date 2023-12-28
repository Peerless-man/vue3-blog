export const tagV = (rule, value, cb) => {
  if (!value.length) {
    return cb(new Error("请选择标签"));
  }
  cb();
};

export const coverV = (rule, value, cb) => {
  if (!value.length) {
    return cb(new Error("请先上传封面"));
  }
  cb();
};
