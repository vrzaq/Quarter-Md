/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { pluginLoader } from './utils.js';
import moment from 'moment-timezone';
import { db } from '../../database/index.js';
import { User, Group, Config, Werewolf } from '../../database/schema/index.js';
import { Metadata } from './cache.js';
import * as Function from './utils.js'; 
import { format } from 'util';
import { Print, Sockets } from './response/index.js';
import { createRequire } from 'module';
import fs from 'fs';

export default class isFiltered {
  constructor ({ 
    m, 
    sock, 
    store, 
    messages,
    newWASocket
  }) {
    this.m = m;
    this.sock = sock;
    this.store = store;
    this.messaging = messages;
    this.newWASocket = newWASocket;
  };
  async start() {
    this.msgqueue = this.msgqueue || []
    new Config(this.m).Expose()
    db.config.chat += 1;
    new User(this.m).Expose()
    if(this.m.message && this.m.sender) {
      db.user[this.m.sender].chat += 1;
    };
    if(this.m.chat == "status@broadcast") return;
    const blockList = typeof await (await this.sock.fetchBlocklist()) != 'undefined' ? await (await this.sock.fetchBlocklist()) : [];
    const isROwner = [Function.decodeJid(this.sock.user.id), ...db.config.authorNumber.map((number) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(this.m.sender)
    const isOwner = isROwner || this.m.fromMe
    const isMods = isOwner || db.config.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(this.m.sender)
    const isPrems = isROwner || db.config.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(this.m.sender)
    if(this.m.text && !(isMods || isPrems)) {
      let queque = this.msgqueue, time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(this.m.id || this.m.key.id)
      setInterval(async function () {
        if(queque.indexOf(previousID) === -1) clearInterval(this)
        const isNumber = x => typeof x === 'number' && !isNaN(x)
        const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
          clearTimeout(this)
          resolve()
        }, ms))
        await delay(time)
      }, time)
    };
    const groupMetadata = (this.m.isGroup ? (await this.sock.groupMetadata(this.m.chat).catch(_ => null)) : {}) || {}
    const participants = (this.m.isGroup ? groupMetadata.participants : []) || []
    const user = (this.m.isGroup ? participants.find(u => Function.decodeJid(u.id) === this.m.sender) : {}) || {}
    const bot = (this.m.isGroup ? participants.find(u => Function.decodeJid(u.id) == Function.decodeJid(this.sock.user.id)) : {}) || {}
    const isRAdmin = user?.admin == 'superadmin' || false
    const isAdmin = isRAdmin || user?.admin == 'admin' || false
    const isBotAdmin = bot?.admin || false 
    if(isOwner || isROwner || isPrems || isMods) {
      db.user[this.m.sender].limit = Infinity;
      db.user[this.m.sender].limit = db.user[this.m.sender].premium ? Infinity : db.user[this.m.sender].limit;
    } else {
      db.user[this.m.sender].limit -= 1;
      db.user[this.m.sender].limit = db.user[this.m.sender].premium ? Infinity : db.user[this.m.sender].limit;
    };
    new Print(this, db, groupMetadata, Function).animation();
    new Sockets(this.m, this.sock, Function, this.store, this.newWASocket, db).Socket_Utils_1();
    const commandPlugin = await pluginLoader('../plugins/commands');
    const eventsPlugin = await pluginLoader('../plugins/events');
    const plugins = Object.assign(commandPlugin, eventsPlugin); 
    for (const name in plugins) {
      const data = await plugins[name]
      const attribute = { 
        blockList, 
        isROwner, 
        isOwner, 
        isMods,
        isPrems,
        groupMetadata,
        participants, 
        user, 
        bot, 
        isRAdmin, 
        isAdmin, 
        isBotAdmin, 
        msgqueue: this.msgqueue 
      };
      const plugin = new data.Execute(this.m, this.sock, { newWASocket: this.newWASocket, db, store: this.store, Function, attribute });
      if(!plugin) return;
      if('exp' in plugin ? parseInt(plugin.exp) : 17) this.m.exp += 'exp' in plugin ? parseInt(plugin.exp) : 17
      if(plugin.branch && typeof plugin.branch === "function") {
        if(!db.config?.pluginbranch && !this.m.chat) return;
        else if(!db.config?.pluginbranch && !this.m.fromMe && !(isOwner || isROwner) && this.m.chat) return; 
        await plugin.branch();
      };
      if(plugin.execute && typeof plugin.execute === "function") {
        if(!plugin.command) continue;
        if(plugin.command?.includes(this.m?.command) && this.m?.args[0] == "-i") {
          let text = `*I N F O  C O M M A N D*\n\n`;
          text += `• *Command:* ${plugin.command?.join(", ")}\n`;
          text += `• *Category:* ${plugin.category}\n`;
          text += `• *Parameter:* ${plugin.helper?.parameter ? plugin.helper?.parameter : '-'}\n`;
          text += `• *Description:* ${plugin.helper?.description ? plugin.helper?.description : '-'}\n`;
          text += `• *File Plugin:* ../../${plugin.category}/${Object.keys(plugins).filter(v => v === plugin.command?.join(", "))[0]+'.js'}\n`;
          return this.sock.sendMessage(this.m?.chat, { text }, { quoted: this.m })
          continue;
        };
        if(plugin.command.includes(this.m.command)) {
          if(plugin.options?.permission === 1 && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          } else if(plugin.options?.permission === 2 && !isAdmin && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          } else if(plugin.options?.permission === 3 && !isBotAdmin && !isAdmin && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          };
          if(plugin.options?.setup?.premium && typeof plugin.options?.setup?.premium && !isPrems) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini khusus pengguna mods' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.mods && typeof plugin.options?.setup?.mods && !isMods) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini khusus pengguna premium' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.group && typeof plugin.options?.setup?.group === 'boolean' && !this.m.isGroup) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini hanya bisa di gunakan dalam grup' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.private && typeof plugin.options?.setup?.private === 'boolean' && this.m.isGroup) { 
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini hanya bisa di gunakan dalam pesan pribadi' }, { quoted: this.m });
            continue;
          };
          try {
            const isInfinity = db.user[this.m.sender].limit == Infinity ? true : false
            if(!db.config?.isPublic && !this.m.chat) return;
            else if(!db.config?.isPublic && !this.m.fromMe && !(isOwner || isROwner) && this.m.chat) return; 
            if(db.user[this.m.sender].limit < 0) {
              return this.sock.sendMessage(this.m.chat, { text: `Maaf, Limit kamu sudah habis dan limit akan di reset setiap 24 jam, Informasi selengkapnya ketik ${this.m.prefix}checklimit` }, { quoted: this.m })
            } else if(isInfinity) {
              await plugin.execute();
              db.user[this.m.sender].hit += 1;
            } else {
              await plugin.execute();
              db.user[this.m.sender].hit += 1;
            };
          } catch (error) {
            return this.sock.sendMessage(this.m.chat, { text: format(error) }, { quoted: this.m })
          };
        };
      };
      if(plugin.special && typeof plugin.special === "function") {
        if(!plugin.options?.prefix) continue;
        let query = this.m?.text?.slice((plugin.options?.prefix.length)); 
        if(plugin.options?.prefix && this.m?.body?.startsWith(plugin.options?.prefix)) {
          if(plugin.options?.permission === 1 && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          } else if(plugin.options?.permission === 2 && !isAdmin && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          } else if(plugin.options?.permission === 3 && !isBotAdmin && !isAdmin && !(isROwner || isOwner) && !this.m.fromMe) {
            continue;
          };
          if(plugin.options?.setup?.premium && typeof plugin.options?.setup?.premium && !isPrems) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini khusus pengguna mods' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.mods && typeof plugin.options?.setup?.mods && !isMods) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini khusus pengguna premium' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.group && typeof plugin.options?.setup?.group === 'boolean' && !this.m.isGroup) {
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini hanya bisa di gunakan dalam grup' }, { quoted: this.m });
            continue;
          } else if(plugin.options?.setup?.private && typeof plugin.options?.setup?.private === 'boolean' && this.m.isGroup) { 
            return this.sock.sendMessage(this.m.chat, { text: 'Maaf, Perintah ini hanya bisa di gunakan dalam pesan pribadi' }, { quoted: this.m });
            continue;
          };
          if(this.m?.body?.startsWith(plugin.options?.prefix)) {
            if(!db.config?.isPublic && !this.m.chat) return;
            else if(!db.config?.isPublic && !this.m.fromMe && !(isOwner || isROwner) && this.m.chat) return; 
            await plugin.special(query);
          };
        };
      };
    };
  };
};