/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import PhoneNumber from 'awesome-phonenumber';
import { toAudio } from '../function/converter.js';
import { imageToWebp, writeExifImg } from '../function/exif.js';
import fs from "fs";
import { fileTypeFromBuffer } from "file-type"
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Sockets {
  constructor (m, sock, Function, store, newWASocket, db) {
    this.m = m;
    this.sock = sock;
    this.Function = Function;
    this.store = store;
    this.newWASocket = newWASocket;
    this.db = db;
  };
  async Socket_Utils_1 () {
    this.sock.getName = (jid = '', withoutContact = false) => {
      jid = this.Function?.decodeJid(jid)
      withoutContact = this.withoutContact || withoutContact
      let v
      if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
        v = this.db.user[jid] || {}
        if (!(v.name || v.subject)) v = await this.sock.groupMetadata(jid) || {}
        resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
      })
      else v = jid === '0@s.whatsapp.net' ? { jid, vname: 'WhatsApp' } : this.newWASocket.areJidsSameUser(jid, this.sock.user.id) ? this.sock.user : (this.db.user[jid] || {})
      return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    };
    this.sock.waChatKey = (pin) => ({ 
      key: (c) => (pin ? (c.pin ? '1' : '0') : '') 
      + (c.archive ? '0' : '1') 
      + (c.conversationTimestamp ? c.conversationTimestamp.toString(16).padStart(8, '0') : '') 
      + c.id, compare: (k1, k2) => {
        k2.localeCompare(k1)
      }
    });
    this.sock.getFile = async (PATH, saveToFile = false) => {
      let res, filename
      const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      const type = await fileTypeFromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
      }
      if (data && saveToFile && !filename) (filename = path.join(__dirname, '../../../temp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
      return {
        res,
        filename,
        ...type,
        data,
        deleteFile() {
          return filename && fs.promises.unlink(filename)
        }
      }
    };
    this.sock.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
      let type = await this.sock.getFile(path, true)
      let { res, data: file, filename: pathFile } = type
      if (res && res.status !== 200 || file.length <= 65536) {
        try { 
          throw { 
            json: JSON.parse(file.toString()) 
          }
        }
        catch (e) {
          if (e.json) throw e.json 
        }
      }
      const fileSize = fs.statSync(pathFile).size / 1024 / 1024
      if (fileSize >= 1800) throw new Error('Ukuran file terlalu besar')
      let opt = {}
      if (quoted) opt.quoted = quoted
      if (!type) options.asDocument = true
      let mtype = '', mimetype = options.mimetype || type.mime, convert
      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
      else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
      else if (/video/.test(type.mime)) mtype = 'video'
      else if (/audio/.test(type.mime)) (
        convert = await toAudio(file, type.ext),
        file = convert.data,
        pathFile = convert.filename,
        mtype = 'audio',
        mimetype = options.mimetype || 'audio/ogg; codecs=opus'
      )
      else mtype = 'document'
      if (options.asDocument) mtype = 'document'
      delete options.asSticker
      delete options.asLocation
      delete options.asVideo
      delete options.asDocument
      delete options.asImage
      let message = {
        ...options,
        caption,
        ptt,
        [mtype]: { 
          url: pathFile
        },
        mimetype,
        fileName: filename || pathFile.split('/').pop()
      }
      let m
      try {
        m = await this.sock.sendMessage(jid, message, { ...opt, ...options })
      } catch (e) {
        console.error(e)
        m = null
      } finally {
        if (!m) m = await this.sock.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
        file = null // releasing the memory
        return m
      };
    };
    this.sock.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
      let m = this.newWASocket.generateForwardMessageContent(message, !!forwardingScore)
      let mtype = Object.keys(m)[0]
      if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
      m = this.newWASocket.generateWAMessageFromContent(jid, m, { ...options, userJid: this.sock.user.id })
      await this.sock.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
      return m
    };
    this.sock.mentions = (content) => {
      return content.match("@") ? [...content.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + "@s.whatsapp.net") : []
    }
    this.sock.createJid = (chat) => {
      let decode = this.newWASocket.jidDecode(chat)
      if(/:\d+@/gi.test(chat)) return decode.user && decode.server && decode.user + '@' + decode.server || chat;
      else return chat;
    }
    this.sock.sendText = (chat, teks, q = "", options = {}) => {
      return this.sock.sendMessage(chat, { text: teks, ...options }, { quoted: q });
    }
    this.sock.sendSticker = (chat, buffer, quoted = "", options = {}) => {
      return this.sock.sendMessage(chat, { sticker: buffer, ...options}, {quoted})
    }
    this.sock.sendImage = (chat, buffer, quoted = "", options = {}) => {
      return this.sock.sendMessage(chat, { image: buffer, ...options }, {quoted})
    }
    this.sock.sendContact = (chat, teks, arr = [...[satu = "", dua = "", tiga = ""]], quoted = '', opts = {}) => {
      return this.sock.sendMessage(chat, { contacts: { displayName: teks, contacts: arr.map(i => ({displayName: '', vcard: 'BEGIN:VCARD\n'+'VERSION:3.0\n'+'FN:'+i[0]+'\n'+'ORG:'+i[2]+';\n'+'TEL;type=CELL;type=VOICE;waid='+i[1]+':'+i[1]+'\n'+'END:VCARD' })) }, ...opts}, {quoted})
    }
    this.sock.sendLink = (chat, teks, foot, but = [...[type, text, content]], options = {}) => {
      let tutu = but.map(v => {
        if(v[0] == "url") return ({ urlButton: {displayText: v[1], url: v[2] }});
        else if(v[0] == "call") return ({ callButton: {displayText: v[1], phoneNumber: v[2] }});
        else if(v[0] == "button") return ({ quickReplyButton: { displayText: v[1], id: v[2] }});
        else if(v[0] == "otp") return ({ urlButton: { displayText: v[1], url: "https://www.whatsapp.com/otp/copy/"+v[2] }});
      });
      return this.sock.sendMessage(chat, { text: teks, footer: foot, templateButtons: tutu, viewOnce: true, ...options});
    };
    this.sock.sendButton = (chat, teks, foot, but = [...[content, id]], quoted = "", options = {}) => {
      return this.sock.sendMessage(chat, {text: teks, footer: foot, buttons: but.map(i => ({buttonId: i[1], buttonText: { displayText: i[0] }, type: 1})), headerType: 2,...options}, { quoted })
    };
    this.sock.getUrlPhotoProfile = (from) => {
      return this.sock.profilePictureUrl(from, 'image', 3000).catch(() => 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg');
    };
    this.sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await this.Function.getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      let buffer
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options)
      } else {
        buffer = await imageToWebp(buff)
      }
      await this.sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
      return buffer
    }
    this.sock.reply = this.sock.sendText = (from, text, quoted, options = {}) => {
      return this.sock.sendMessage(from, { text, ...options }, { quoted })
    }
    return this.sock;
  };
  nullish(args) {
    return !(args !== null && args !== undefined)
  }
};