// const channelNo = 330657513744; // 단체 채팅방
const channelNo = 661738695697; // 실험실 (레이)
// const channelNo = 646924191760;

const io = require("socket.io-client");

const request = require("request");

const fs = require("fs");
const { createHash } = require("crypto");


let BotVersion = '1.1.1';

const userId = "startaey1024";
const admin = 'jtyoung24';
const P = '$';
const B = '\u200b'.repeat(3000);
const Operation_Startin = new Date().getTime();

const token = 'NID_AUT=Y+iDIH6ryQxUE4Rn0GPH90t5MInuLP3FwYRLqRORF1izlQMvEtzmox0eSn7P89L6; NID_SES=AAABhz9lTAA4fjw5OeRHFA5RF4XFNv/fp4ohEpD+lJ4ZbufeAj47CYtCMtEZ3fPiJ2jQdLFSq5jmj3sG3Ejdd2gljz58Up2+qVfjsNvqtp1LsjSIPVrSigTnYS3qsDGgfdUkubAi7eeNw8R5dtI1gEjxNYKIEOaqjTkf43/S4sZbScIR5W88hB7Ro3QxKiGVFagGFZbmJB30iIs8O/LPWnN9om3IzLU/JN1ew6yW1qbZLA6lWC5YdC/3gvtkydvlIPKhjDCrQhcnNaMhtkzaefAegMXfqcgUQgm4OlpBItphJQj5Ie4REUAg5jCctnin2lElRmmQIgx5E3DJp6ho0VQLm84zzEm45AlT/BmpgOiEF0gTujusizyZV0Z1yycdJF89FaItf92rCFmn7l4Q0R2hiGTadfZ44OhPsSgcXBBkGGQ8Gxfq6HXdH/07D/PHrwob7ow1NrIZCffrSdJ5mvf2XLJRBRueBODkXwo5fE184bEHcuCSgCHmOCGyMl4m6f136DBPpSARH2RfIzlsELb7rfI=;';
const msgList = [];

const socket = io(`https://talkwss.cafe.naver.com/chat`, {
  query: {
    "accessToken": token,
    "channelNo": channelNo,
    "userId": userId
  },
  transportOptions: {
    polling: {
      extraHeaders: {
        'Origin': 'https://talk.cafe.naver.com'
      }
    }
  }
});

function sendText(socket, msg) {
  var msg = String(msg);
  socket.emit("send", {"tempId": 0, "message": msg, "messageTypeCode": 1, "sessionKey": token });
  msgList.push(msg);
}

function addNotice(socket, content) {
  socket.emit("event", {"channelNo": channelNo, "body": {"messageNo": 4194, "channelNo": channelNo, "registerId": userId, "type": "ADD_NOTICE", "cafeId": 16854404,
   "content": "흐음..", "registerDate": 1595580165771}});
}

function removeNotice(socket, content) {
   socket.emit("event", {"channelNo": channelNo, "body": {"type": "REMOVE_NOTICE"}});
}

function sendSticker(socket, type) {
  let stickerDB = {
    'ㅎㅎ': ['ogq_5747936e7d55d/original_22.png', 'ogq_58146d6d0ab0a/original_11.png', 'ogq_58146d6d0ab0a/original_5.png', 'ogq_58146d6d0ab0a/original_24.png'],
    'ㅎㅇ': ['ogq_58146d6d0ab0a/original_8.png', 'ogq_57f2b52920a55/original_1.png', 'ogq_57f2b2e5a6f2e/original_1.png', 'ogq_58146d6d0ab0a/original_1.png'],
    'ㄱㅅ': ['ogq_57f2b2e5a6f2e/original_2.png', 'ogq_5747936e7d55d/original_8.png'],
    'ㄷㄷ': ['ogq_56b08cac71421/original_5.png', 'ogq_5747936e27e7c/original_1.png', 'ogq_57f2b2e5a6f2e/original_9.png'],
    'ㅂㅂ': ['ogq_57f2b2e5a6f2e/original_8.png', 'ogq_58146d6d0ab0a/original_8.png']
  };
  var res = `{"sticker":{"stickerId":"ogq_58146d6d0ab0a-8-185-160","seq":8,"packName":"ogq_58146d6d0ab0a","width":185,"height":160,"imageUrl":"https://gfmarket-phinf.pstatic.net/${stickerDB[type][randint(0, stickerDB[type].length - 1)]}"}}`;
  socket.emit("send", {"tempId": 0, "extras": res, "message": '', "messageTypeCode": 10, "sessionKey": token });
  msgList.push("");
}

function sendImage(socket, option) {
  if (option.url == undefined) option.url = '';
  if (option.width == undefined) option.width = 256;
  if (option.height == undefined) option.height = 256;
  var res = `{"image":{"width":${option.width},"url":"${option.url}","height":${option.height},"is_original_size":false}}`;
  socket.emit("send", {"tempId": 0, "extras": res, "message": '', "messageTypeCode": 11, "sessionKey": token });
  msgList.push("");
}

function sendLink(socket, option) {
  if (option.title == undefined) option.title = '';
  if (option.content == undefined) option.content = '';
  if (option.tag == undefined) option.tag = '';
  if (option.url == undefined) option.url = 'https://cafe.naver.com/gameppt';
  if (option.img == undefined) option.img = '';
  var res = `{"snippet":{"title":"${option.title}","url":"${option.url}","description":"${option.content}","domain":"${option.tag}","type":null,"image":{"url":"${option.img}","height":100,"width":100}}}`;
  socket.emit("send", {"tempId": 0, "extras": res, "message": '\0', "messageTypeCode": 1, "sessionKey": token });
  msgList.push("");
}



socket.connect();
sendLink(socket, {title: '[CS] 시에스가 왔다!', content: '명령어는 \'$도움\'으로 확인하세요.', img: 'https://blogfiles.pstatic.net/MjAyMDA1MDVfMTI1/MDAxNTg4Njg5NTc2Njky.ZkWAdJXzzs_nOHEIheo8C89RnjH9p_nxNBaPzqnzNE0g._gZm787G9Ewc85V2Jb9DI7KRItAmlrpBVOSS9xaESdAg.PNG.jtyoung24/csprofile.png', tag: 'Release Ver ' + BotVersion});
console.log('[CS] Socket connected');



socket.on("msg", (e) => {
  var msg = String(e.message.contents);
  var sender = String(e.message.userId);
  if (msgList.indexOf(msg) != -1) {
    msgList.splice(msgList.indexOf(msg), 1);
    return
  }

});

