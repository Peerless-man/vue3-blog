const { Mint } = require("mint-filter");
const request = require("request");

const sArr = ["我是你爸爸", "我是你爸", "我是你爹", "爸爸", "我是你爷爷", "操你奶奶", "我是你妈", "我日你爸", "草泥马", "草你妈", "操你妈", "傻逼"];
const badJs = /script|alert|window|prompt|location|href|iframe|onload|onerror/g;

async function filterSensitive(text) {
  // 过滤敏感词
  const mint = new Mint(sArr);

  let res = mint.filter(text).text;
  if (res.indexOf("*") != -1 || badJs.test(text)) {
    res = await getSaying();
    return res;
  } else {
    return res;
  }
}

function getSaying() {
  return new Promise((resolve, reject) => {
    request("https://open.iciba.com/dsapi/", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res = JSON.parse(body).note;
        resolve(res);
      }
    });
  });
}

module.exports = filterSensitive;
