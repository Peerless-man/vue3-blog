const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const filterSensitive = require("./sensitive");
const { getOneUserInfo } = require("../service/user");
const { createChat } = require("../service/chat/index");
const onlineList = [];

const initWebsocket = () => {
  // 我们的 port 是 8889
  const wss = new WebSocketServer({ port: 8889 });

  if (wss) {
    console.log("websocket Initialized successfully on port: " + 8889);
  }

  wss.on("connection", function connection(ws, request) {
    ws.on("error", console.error);

    ws.on("message", async function message(data) {
      const message = JSON.parse(data);
      switch (message.type) {
        // 用户在连接成功以后会发送消息 我们会在此获取用户信息
        case "init":
          if (message.user_id) {
            // 为当前用户的 ws连接绑定 用户id 用于用户断开链接时 改变用户在线状态
            ws.user_id = message.user_id;
            const user = await getOneUserInfo({ id: message.user_id });
            if (user) {
              message.nick_name = user.nick_name;
              message.avatar = user.avatar;
              // 上线
              keepLatestOnlineList("online", message);
            }
          } else {
            sendOnlineToAll();
          }
          break;
        // 群发消息
        case "message":
          message.content = await filterSensitive(message.content);
          const user = await getOneUserInfo({ id: message.user_id });
          if (user) {
            message.nick_name = user.nick_name;
            message.avatar = user.avatar;
          }
          const res = await createChat(message);
          if (res) {
            message.id = res.id;
          }
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message), { binary: false });
            }
          });
          break;
        // 撤回消息 群发撤回消息的 id
        case "revert":
          if (message.message_id) {
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message), { binary: false });
              }
            });
          }
          break;
        // 下线用户
        case "offline":
          if (message.user_id) {
            // 下线用户
            getOneUserInfo({ id: message.user_id }).then((user) => {
              if (user) {
                keepLatestOnlineList("close", { user_id: user.id, nick_name: user.nick_name });
              }
            });
          }
          break;
        default:
          break;
      }
    });

    // 被动断开 说明用户已经离开网站了 我们只能去除在线列表
    ws.on("close", function () {
      if (ws.user_id) {
        getOneUserInfo({ id: ws.user_id }).then((user) => {
          if (user) {
            keepLatestOnlineList("close", { user_id: ws.user_id, nick_name: user.nick_name });
          }
        });
      }
    });
  });

  function keepLatestOnlineList(type, message) {
    let index = onlineList.findIndex((item) => item.user_id === message.user_id);
    switch (type) {
      case "online":
        if (index !== -1) {
          onlineList.splice(index, 1);
        }
        onlineList.push({
          user_id: message.user_id,
          nick_name: message.nick_name,
          avatar: message.avatar,
          createTime: new Date(),
        });
        console.log(message.nick_name + " 上线了...");
        break;
      case "close":
        if (index !== -1) {
          onlineList.splice(index, 1);
          if (message.nick_name) {
            console.log(message.nick_name + " 断开连接...");
          }
        }
        break;
      default:
        break;
    }
    sendOnlineToAll();
  }

  function sendOnlineToAll() {
    // 群发在线人数
    let latestList = [];
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        latestList.push(client.user_id);
        let message = JSON.stringify({
          type: "onlineList",
          list: onlineList,
        });
        // console.log(onlineList);
        client.send(message, { binary: false });
      }
    });
  }
};

module.exports = {
  initWebsocket,
};
