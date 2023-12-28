// 可以百度一下dotenv
const dotenv = require("dotenv");
// 这里读取的是.env文件下的配置
dotenv.config();

// console.log(process.env)

module.exports = process.env;
