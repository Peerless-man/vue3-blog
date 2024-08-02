const { Sequelize } = require("sequelize");

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = require("../config/config.default");

if (!MYSQL_PASSWORD) {
  console.error("数据库密码不能为空");
}

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
  timezone: "+08:00",
});

seq
  .authenticate()
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((err) => {
    console.log(err);
    console.log("数据库连接失败");
  });

module.exports = seq;
