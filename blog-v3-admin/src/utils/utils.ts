export function deepClone(obj: any) {
  const objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/**
 * 图片压缩
 * @param {*} file 图片
 * @param {*} size 文件压缩至大小 但是可能压缩不到那么小
 * @param {*} quality 质量
 * @param {*} maxTime 最多压缩次数
 */
export const imageConversion = (file, size = 800, quality = 1, maxTime = 3) => {
  return new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = image.width;
        let height = image.height;
        width = image.width;
        height = image.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        let dataURL = canvas.toDataURL(file.type, quality);

        // 在有限的时间内压缩
        while (maxTime && quality > 0.2) {
          if (Math.round(dataURL.length) / 1024 > size) {
            maxTime--;
            quality -= 0.2;
            dataURL = canvas.toDataURL(file.type, quality);
          } else {
            break;
          }
        }

        const arr = dataURL.split(",");
        let mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        mime = file.type;
        resolve(
          new Blob([u8arr], {
            type: mime
          })
        );
      };
    };
  });
};
