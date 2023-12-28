const ipnet = require("xz-ipnet")();

/**
 * 随机生成昵称
 * @param {*} prefix  前缀
 * @param {*} randomLength 长度
 * @returns nickname
 */
function randomNickname(prefix, randomLength) {
  // 兼容更低版本的默认值写法
  prefix === undefined ? (prefix = "") : prefix;
  randomLength === undefined ? (randomLength = 8) : randomLength;

  // 设置随机用户名
  // 用户名随机词典数组
  let nameArr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  ];
  // 随机名字字符串
  let name = prefix;
  // 循环遍历从用户词典中随机抽出一个
  for (var i = 0; i < randomLength; i++) {
    // 随机生成index
    let index = Math.floor(Math.random() * 2);
    let zm = nameArr[index][Math.floor(Math.random() * nameArr[index].length)];
    // 拼接进名字变量中
    name += zm;
  }
  // 将随机生成的名字返回
  return name;
}

function getIpAddress(ip) {
  const arr = ipnet.find(ip);

  if (!arr) {
    return "本机地址";
  }
  return arr[1] || arr[0];
}

// 获取当前type类型数字的公共方法
function getCurrentTypeName(type) {
  let res = 0;
  switch (type + '') {
    case "1":
      res = "文章";
      break;
    case "2":
      res = "说说";
      break;
    case "3":
      res = "留言";
      break;
  }

  return res;
}
// 判断网址是否带http / https
function isValidUrl(url) {

  return url.indexOf('http') != -1 || url.indexOf('https') != -1
}

module.exports = {
  isValidUrl,
  getIpAddress,
  randomNickname,
  getCurrentTypeName
};
