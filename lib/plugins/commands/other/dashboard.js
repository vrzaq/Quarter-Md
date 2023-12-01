/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { Collection } from '../../collection.js';
import fs from 'fs';
import path, { join } from 'path';

export class Execute extends Collection {
  constructor (m, sock, { db }) {
    super('other', {
      description: 'dashboard bot',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['dashboard'];
    this.execute = async () => {
      let dir = fs.readdirSync('database/session'), 
      _b = 0, 
      _c = dir.map(v=> _b += (fs.statSync(join('database/session', v))).size);
      let user = db.user;
      let grup = db.group;
      let count = 1;
      let text = `*DASHBOARD*\n\n`
      text += `( *${count++}* ) Time : ${this.timers(process.uptime() * 1000)}\n`
      text += `( *${count++}* ) Total RAM : ${this.sizeString(process.memoryUsage().rss)}\n`
      text += `( *${count++}* ) OS : ${process.platform + " " + process.arch}\n`
      text += `( *${count++}* ) Total Session : ${dir.length} Files\n`
      text += `( *${count++}* ) Size Session : ${this.sizeString(_b)}\n`
      text += `( *${count++}* ) Total Database user : ${Object.keys(user).length} Users\n`
      text += `( *${count++}* ) Total Database group : ${Object.keys(grup).length} groups\n`
      m.reply(text);
    };
  }
  sizeString (des) {
    if (des === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(des) / Math.log(1024));
    return parseFloat((des / Math.pow(1024, i)).toFixed(0)) + ' ' + sizes[i];
  };
  timers (date) {
    const seconds = Math.floor((date / 1000) % 60),
    minutes = Math.floor((date / (60 * 1000)) % 60), 
    hours = Math.floor((date / (60 * 60 * 1000)) % 24), 
    days = Math.floor((date / (24 * 60 * 60 * 1000)));
    return `${days ? `${days} Hari ` : ''}${hours ? `${hours} Jam ` : ''}${minutes ? `${minutes} Menit ` : ''}${seconds ? `${seconds} Detik` : ''}`;
  };
};