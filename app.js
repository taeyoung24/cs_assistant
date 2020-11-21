const io = require("socket.io-client");
const Discord = require('discord.js');
const hangul = require('hangul-js');
const konlp = require('korean-text-analytics');
const fs = require('fs');
const client = new Discord.Client();

const userId = "startaey1024";
const admin = 'jtyoung24';
// const channelNo = 330657513744; // 단체 채팅방
const channelNo = 661738695697; // 실험실 (레이)
// const channelNo = 646924191760;
const P = '$';
const B = '\u200b'.repeat(3000);
const Operation_Startin = new Date().getTime();

// file import
let chatDB = JSON.parse(fs.readFileSync('data/temp_chatdb.json', 'utf-8').trim());
let wordDB = JSON.parse(fs.readFileSync('data/words.json', 'utf-8').trim());

const token = 'NID_AUT=Y+iDIH6ryQxUE4Rn0GPH90t5MInuLP3FwYRLqRORF1izlQMvEtzmox0eSn7P89L6; NID_SES=AAABhz9lTAA4fjw5OeRHFA5RF4XFNv/fp4ohEpD+lJ4ZbufeAj47CYtCMtEZ3fPiJ2jQdLFSq5jmj3sG3Ejdd2gljz58Up2+qVfjsNvqtp1LsjSIPVrSigTnYS3qsDGgfdUkubAi7eeNw8R5dtI1gEjxNYKIEOaqjTkf43/S4sZbScIR5W88hB7Ro3QxKiGVFagGFZbmJB30iIs8O/LPWnN9om3IzLU/JN1ew6yW1qbZLA6lWC5YdC/3gvtkydvlIPKhjDCrQhcnNaMhtkzaefAegMXfqcgUQgm4OlpBItphJQj5Ie4REUAg5jCctnin2lElRmmQIgx5E3DJp6ho0VQLm84zzEm45AlT/BmpgOiEF0gTujusizyZV0Z1yycdJF89FaItf92rCFmn7l4Q0R2hiGTadfZ44OhPsSgcXBBkGGQ8Gxfq6HXdH/07D/PHrwob7ow1NrIZCffrSdJ5mvf2XLJRBRueBODkXwo5fE184bEHcuCSgCHmOCGyMl4m6f136DBPpSARH2RfIzlsELb7rfI=;';

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

let baseChannel = null;

function sendText(socket, msg) {
  var msg = String(msg);
  socket.emit("send", {"tempId": 0, "message": msg, "messageTypeCode": 1, "sessionKey": token });
  msgList.push(msg);
}

function sendLink(socket, option) {
  if (option.title == undefined) option.title = '';
  if (option.content == undefined) option.content = '';
  if (option.tag == undefined) option.tag = '';
  if (option.url == undefined) option.url = 'https://cafe.naver.com/gameppt';
  if (option.img == undefined) option.img = '';
  var res = `{"snippet":{"title":"${option.title}","url":"${option.url}","description":"${option.content}","domain":"${option.tag}","type":null,"image":{"url":"${option.img}","height":100,"width":100}}}`;
  socket.emit("send", {"tempId": 0, "extras": res, "message": '\0', "messageTypeCode": 1, "sessionKey": token });
}

socket.connect();
sendLink(socket, {title: '[CS] 시에스가 왔다!', content: '명령어는 \'$도움\'으로 확인하세요.', img: 'https://blogfiles.pstatic.net/MjAyMDA1MDVfMTI1/MDAxNTg4Njg5NTc2Njky.ZkWAdJXzzs_nOHEIheo8C89RnjH9p_nxNBaPzqnzNE0g._gZm787G9Ewc85V2Jb9DI7KRItAmlrpBVOSS9xaESdAg.PNG.jtyoung24/csprofile.png', tag: 'Release Ver ' + '1.3.52'});
console.log('[CS] Socket connected');

socket.on("msg", (e) => {
  console.log('baseChannel');
  var msg = String(e.message.contents);
  var sender = String(e.message.userId);
  // if (baseChannel !== null) baseChannel.send(`[캎챗] ${sender}: ${msg}`);
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('자연어 공부', { type: 'PLAYING' })
});

client.on('message', msg => {
  if (baseChannel === null) baseChannel = msg.channel;
  if (msg.author.tag === client.user.tag) return;
  if (msg.content.startsWith('$')) {
    if (msg.content.startsWith('$소개')) {
      const instruction = [
        '\`\`\`$소개 [(쪽수): Number(int)]\n$형태소 [(문자열): String]\n$유사도v1 [(문자열1): String]_vs_[(문자열2): String]\`\`\`'
      ];
      let targ_page = msg.content.trim().length == 3 ? 1 : msg.content.substr(3).trim();
      if (isNaN(targ_page)) {
        msg.reply(`소개 명령어의 인자(쪽수)는 1 ~ ${instruction.length}의 정수만 가능해요`);
        return;
      }else targ_page--;
      const embed = new Discord.MessageEmbed()
      .setColor('0FF8E0')
      .setTitle('CS Assistant의 사용가능한 기능들!')
      .setDescription('> \`Version 1.3.55\`  \`단어 유사도 개선\`  \`NeuralNetwork\`\n> 시에스는 더욱 유연한 __자연어 처리__를 기반으로 한 챗봇입니다. 대부분의 절대명령어는 자연스러운 대화 속에서 자동으로 인식하여 처리합니다. 아래 도움말을 참고하여 시에스가 질 좋은 학습을 하도록 도움을 주세요!')
      .addField(`- 명령어 __Page ${targ_page + 1} of ${instruction.length}__`, instruction[targ_page]);
      msg.channel.send(embed);
    }else if (msg.content.startsWith('$형태소 ')) {
      const target = msg.content.substr(4).trim();
      konlp.ExecuteMorphModule(target, (err, got) => {
        let retl = [];
        got.morphed.forEach(v => {
          retl.push(`(${v.word}, ${v.tag})`);
        });
        msg.channel.send(`__[NodeJS] korean-text-analytics__에 의한 형태소 분석 결과: \`\`\`${retl.join(', ')}\`\`\``);
      });
    }else if (msg.content.startsWith('$유사도v1 ')) {
      try {
        const param = msg.content.substr(6).trim();
        if (!param.includes('_vs_')) { msg.reply(' `_vs_` 구분자가 필요해요.'); return }
        const str = [param.split('_vs_')[0].trim(), param.split('_vs_')[1].trim()];
        msg.reply(`\n> "${str[0]}"\n> "${str[1]}"\n**_howsimilar_\\\__v1_** 에 의한 유사도 결과: \`${howsimilar_v1(str[0], str[1])}%\``);
      } catch(e) {
        console.log(e);
        msg.reply('명령어 처리를 하지 못했어요.');
      }
    }
    return;
  }
  let answer = botAnswer(msg.content);
  if (answer !== "") msg.reply(answer);
});

client.login(process.env.TOKEN);

process.on('SIGINT', () => {
  saveFile();
  process.exit(1);
});

function saveFile() {
  console.log('Files Saving...');
  fs.writeFileSync('data/temp_chatdb.json', JSON.stringify(chatDB, null, 2), 'utf-8');
  fs.writeFileSync('data/words.json', JSON.stringify(wordDB, null, 2), 'utf-8');
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function botAnswer(query) {
  let pli = [];
  
  for (let key in chatDB) {
    pli.push({key: key, p: howsimilar_v1(key, query)});
  }
  pli.sort((a, b) => {return a.p - b.p > 0 ? -1 : 1;});
  let stdData = chatDB[pli[0].key];
  if (pli[0].p > 70) return stdData[randint(0, stdData.length - 1)];
  else return "";
}

const howsimilar_v1 = function(s1, s2) {
  // 자모 분해 단순 비교
  let wordValue = function(str1, str2) {
    var num = 0; var num2 = 0; var renum = 0;
    str1 = hangul.assemble(str1); str2 = hangul.assemble(str2);
  
    if (str1.length < str2.length) {
      for (var i = 0; i < str1.length; i++) {
        for (var j = 0; j < str2.length; j++) {
          if (str1[i] == str2[j]) {
            num++;
            break;
          }
        }
      }
      for (var i = 0; i < str1.length; i++) {
        if (str1[i] == str2[i]) {
          num2++;
        }
      }
      num = num / str2.length * 100;
      num2 = num2 / str2.length * 100;
      //renum = (num * 0.3 + num2 * 0.7) / (str2.length * 2) * 100;
    }else {
      for (var i = 0; i < str2.length; i++) {
        for (var j = 0; j < str1.length; j++) {
          if (str2[i] == str1[j]) {
            num++;
            break;
          }
        }
      }
      for (var i = 0; i < str2.length; i++) {
        if (str1[i] == str2[i]) {
          num2++;
        }
      }
      num = num / str1.length * 100;
      num2 = num2 / str1.length * 100;
      //renum = (num * 0.3 + num2 * 0.7) / (str1.length * 2) * 100;
    }
  
    renum = num * 0.4 + num2 * 0.6;
  
    return Math.round(renum, 2);
  };
  return wordValue(s1, s2);
};