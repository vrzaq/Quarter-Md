/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import Event from 'events';
import bytes from 'bytes';
import fs from 'fs';

export let Metadata = new Map();
Event.EventEmitter.defaultMaxListeners = Infinity

const ramCheck = setInterval(() => {
  var ramUsage = process.memoryUsage().rss
  if(ramUsage >= bytes('500mb')) {
    clearInterval(ramCheck)
    process.send('reset')
  }
}, 60 * 1000)

if(!fs.existsSync('./database/temp')) fs.mkdirSync('./database/temp')
setInterval(() => {
  try {
    const tmpFiles = fs.readdirSync('./database/temp')
    if(tmpFiles.length > 0) {
      tmpFiles.filter(v => !v.endsWith('.file')).map(v => fs.unlinkSync('./database/temp/' + v))
    }
  } catch {}
}, 60 * 1000 * 10)
