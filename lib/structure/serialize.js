/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { 
  getContentType, 
  downloadContentFromMessage, 
  jidNormalizedUser
} from "@whiskeysockets/baileys";
import { decodeJid, downloadMedia } from "./utils.js";
import { existsSync } from 'fs';

let proto;

try {
  proto = (await import("@whiskeysockets/baileys")).default.proto
} catch {
  console.error("Baileys Not installed! please install with command: npm install '@whiskeysockets/baileys'")
}

export default class Serialize {
  constructor (message, sock, store, db) {
    this.key = message.key;
    this.messageTimestamp = message.messageTimestamp;
    this.pushName = message.pushName;
    this.message = message.message;
    this.savedb = {};
    if(this.key) {
      this.id = this.key.id;
      this.fromMe = this.key.fromMe;
      this.isGroup = this.key?.remoteJid.endsWith("@g.us");
      this.chat = decodeJid(this.key?.remoteJid || (this.key?.remoteJid && this.key?.remoteJid !== "status@broadcast") || "");
      this.sender = decodeJid((this.key?.fromMe && this.sock?.user.id) || this.participant || this.key.participant || this.chat || "");
    };
    this.dlMessage = async function(mess) {
      try {
        let mime = (mess.msg || mess).mimetype || '', messageType = mess.mtype ? mess.mtype.replace(/Message/gi, '') : mime.split('/')[0], buffer = Buffer.from([]);
        const stream = await downloadContentFromMessage(mess, messageType);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        return buffer
      } catch (error) { 
        console.error(error)
      };
    };
    if(this.message) {
      if(this.message?.messageContextInfo) delete this.message.messageContextInfo;
      if(this.message?.senderKeyDistributionMessage) delete this.message.senderKeyDistributionMessage;
      this.type = getContentType(this.message);
      if(this.type === "ephemeralMessage") {
        this.message = this.message[this.type].message;
        const tipe = Object.keys(this.message)[0];
        this.type = tipe;
        if(tipe === "viewOnceMessage") {
          this.message = this.message[this.type].message;
          this.type = getContentType(this.message);
        }
      }
      if(this.type === "viewOnceMessage") {
        this.message = this.message[this.type].message;
        this.type = getContentType(this.message);
      }
      this.mtype = Object.keys(this.message).filter((v) => v.includes("Message") || v.includes("conversation"))[0];
      this.mentions = this.message[this.type]?.contextInfo ? this.message[this.type]?.contextInfo.mentionedJid : null;
      try {
        const quoted = this.message[this.type]?.contextInfo;
        if(quoted.quotedMessage["ephemeralMessage"]) {
          const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
          if(tipe === "viewOnceMessage") {
            this.quoted = {
              type: "view_once",
              stanzaId: quoted.stanzaId,
              participant: decodeJid(quoted.participant),
              message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
            };
          } else {
            this.quoted = {
              type: "ephemeral",
              stanzaId: quoted.stanzaId,
              participant: decodeJid(quoted.participant),
              message: quoted.quotedMessage.ephemeralMessage.message,
            };
          };
        } else if(quoted.quotedMessage["viewOnceMessage"]) {
          this.quoted = {
            type: "view_once",
            stanzaId: quoted.stanzaId,
            participant: decodeJid(quoted.participant),
            message: quoted.quotedMessage.viewOnceMessage.message,
          };
        } else {
          this.quoted = {
            type: "normal",
            stanzaId: quoted.stanzaId,
            participant: decodeJid(quoted.participant),
            message: quoted.quotedMessage,
          };
        };
        this.quoted.fromMe = this.quoted.participant === decodeJid(sock.user.id);
        this.quoted.mtype = Object.keys(this.quoted.message).filter((v) => v.includes("Message") || v.includes("conversation"))[0];
        this.quoted.text = this.quoted.message[this.quoted.mtype]?.text || this.quoted.message[this.quoted.mtype]?.description || this.quoted.message[this.quoted.mtype]?.caption || this.quoted.message[this.quoted.mtype]?.hydratedTemplate?.hydratedContentText || this.quoted.message[this.quoted.mtype]?.editedMessage?.extendedTextMessage?.text || this.quoted.message[this.quoted.mtype] || "";
        this.quoted.key = {
          id: this.quoted.stanzaId,
          fromMe: this.quoted.fromMe,
          remoteJid: this.chat,
        };
        let M = proto.WebMessageInfo
        let vM = this.quoted.fakeObj = M.fromObject({
          key: {
            remoteJid: this.quoted.key.remoteJid,
            fromMe: this.quoted.key.fromMe,
            id: this.quoted.key.id
          },
          message: quoted,
          ...(this.isGroup ? { participant: this.quoted.participant } : {})
        })
        this.quoted.isBot = this.quoted.key.id ? (this.quoted.key.id.startsWith("BAE5") || this.quoted.key.id.startsWith("30EB")) && this.quoted.key.id.length < 31 : false
        this.quoted.delete = () => sock.sendMessage(this.chat, { delete: vM.key });
        this.quoted.download = (pathFile) => downloadMedia(this.quoted.message, pathFile);
        this.quoted.react = (text) => sock.sendMessage(this.chat, { 
          react: { 
            text, 
            key: this.quoted.key 
          } 
        });
      } catch {
        this.quoted = null;
      }
      this.body = this.message?.conversation || this.message?.[this.type]?.text || this.message?.[this.type]?.caption || this.message?.[this.type]?.editedMessage?.extendedTextMessage?.text || (this.type === "listResponseMessage" && this.message?.[this.type]?.singleSelectReply?.selectedRowId) || (this.type === "buttonsResponseMessage" && this.message?.[this.type]?.selectedButtonId) || (this.type === "templateButtonReplyMessage" && this.message?.[this.type]?.selectedId) || "";
      this.msg = (this.type == 'viewOnceMessage' ? this.message?.[this.type].message[getContentType(message[this.type].message)] : this.message?.[this.type])
      this.text = this.msg?.text || this.msg?.caption || this.message?.conversation || this.msg?.contentText || this.msg?.selectedDisplayText || this.msg?.title || '';
      this.budy = (this.type === 'conversation') ? this.message.conversation : (this.type == 'imageMessage') ? this.message.imageMessage.caption : (this.type == 'videoMessage') ? this.message.videoMessage.caption :  (this.type == 'extendedTextMessage') ? this.message.extendedTextMessage.text : ''.slice(1).trim().split(/ +/).shift().toLowerCase()
      this.prefix = /^[/\.!#]/.test(this.budy) ? this.budy.match(/^[/\.!#]/) : '-';
      this.cmd = (this.type === 'conversation' && this.message.conversation.startsWith(this.prefix)) ? this.message.conversation : (this.type == 'imageMessage' && this.message.imageMessage.caption.startsWith(this.prefix)) ? this.message.imageMessage.caption : (this.type == 'videoMessage' && this.message.videoMessage.caption.startsWith(this.prefix)) ? this.message.videoMessage.caption : (this.type == 'extendedTextMessage' && this.message.extendedTextMessage.text.startsWith(this.prefix)) ? this.message.extendedTextMessage.text : (this.type == 'buttonsResponseMessage' && this.message.buttonsResponseMessage.selectedButtonId) ? this.message.buttonsResponseMessage.selectedButtonId : (this.type == 'listResponseMessage') ? this.message.listResponseMessage.singleSelectReply.selectedRowId : (this.type == 'templateButtonReplyMessage' && this.message.templateButtonReplyMessage.selectedId) ? this.message.templateButtonReplyMessage.selectedId : (this.type === 'messageContextInfo') ? (this.message.buttonsResponseMessage?.selectedButtonId || this.message.listResponseMessage?.singleSelectReply.selectedRowId || this.text) : '';
      this.args = this.cmd.trim().split(/ +/).slice(1);
      this.query = this.args.join(" ");
      this.command = this.cmd.slice(1).trim().split(/ +/).shift().toLowerCase();
      this.quots = this.quoted ? this.quoted : this;
      this.mime = (this.quots.msg || this.quots).mimetype || this.quots.mediaType || "";
      this.validGroup = (id,array) => {
        for (var i = 0; i <array.length; i++) {
          if(array[i]==id) {
            return !0
          };
        };
        return !1
      };
      this.sendTextProfileImage = async (text, options = {}) => {
        try {
          var profile = await sock.profilePictureUrl(this.sender, "image", 3000)
        } catch {
          var profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu"
        };
        return sock.sendMessage(this.chat, {
          text,
          contextInfo: { 
            mentionedJid: [this.sender, jidNormalizedUser(sock.user.id), ...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"),
            externalAdReply: { 
              title: db.config.botName, 
              body: db.config.description, 
              thumbnail: new Uint32Array(Buffer.from(profile)), 
              thumbnailUrl: profile, 
              renderLargerThumbnail: true, 
              mediaType: 1, 
              previewType: "PHOTO", 
              sourceUrl: db.config.homepage
            }, 
          }, 
        }, { 
          quoted: {
            key: { 
              fromMe: false, 
              participant: `0@s.whatsapp.net`, 
              ...(this.chat ? { 
                remoteJid: this.chat 
              } : {}), 
            }, 
            message: { 
              extendedTextMessage: { 
                text: db.user[this.sender].fakeQuoted, 
              }, 
            }, 
          }, 
          ...options 
        })
      };
      this.editMessage = (text, keys, options = {}) => {
        return sock.sendMessage(this.chat, { 
          text, mentions: [this.sender, jidNormalizedUser(sock.user.id), ...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"), 
          edit: keys, 
          ...options 
        }, { 
          quoted: this, 
          ...options 
        })
      };
      this.fakeReply = (text, options = {}) => {
        return sock.sendMessage(this.chat, { 
          text, 
          mentions: [this.sender, jidNormalizedUser(sock.user.id), ...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"), 
          ...options 
        }, { 
          quoted: {
            key: { 
              fromMe: false, 
              participant: `0@s.whatsapp.net`, 
              ...(this.chat ? { 
                remoteJid: this.chat 
              } : {}), 
            }, 
            message: { 
              extendedTextMessage: { 
                text: db.user[this.sender].fakeQuoted.replace(/%name/, this.pushName)
              }, 
            }, 
          }, 
          ...options 
        })
      };
      this.reply = (text, options = {}) => {
        return sock.sendMessage(this.chat, { 
          text, 
          mentions: [this.sender, jidNormalizedUser(sock.user.id), ...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"), 
          ...options 
        }, { 
          quoted: this,
          ...options 
        })
      };
      this.download = (pathFile) => downloadMedia(this.message, pathFile);
      this.react = (text) => sock.sendMessage(this.chat, { 
        react: { 
          text, 
          key: this.key 
        } 
      });
    }; 
    return this;
  };
};