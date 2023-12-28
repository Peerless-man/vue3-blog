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
 * @param {*} size 文件压缩大小 实际上只压缩一次 因为有些时候用while循环想继续压缩 但是压缩不了了 压缩一次得了 不过分压缩
 */
export const imageConversion = (file, size = 800, quality = 1) => {
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

        if (Math.round(dataURL.length) / 1024 > size) {
          quality -= 0.2;
          dataURL = canvas.toDataURL(file.type, quality);
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
