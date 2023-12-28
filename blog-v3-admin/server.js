const express = require("express");

const app = express();

const port = 8080; // 自定义端口号（不要与已存在端口冲突）

app.use(express.static("dist")); // dist 是项目的打包资源路径

app.listen(port, () => console.log(`服务器 ${port} 开启成功!`));
