/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { jidDecode, downloadContentFromMessage } from "@whiskeysockets/baileys";
import fs, { promises, readdirSync, statSync, watchFile } from "fs";
import { dirname, join, basename } from 'path';
import { promisify } from 'util';
import { fileURLToPath } from "url"
import { resolve } from 'import-meta-resolve';
import chalk from 'chalk';
import cheerio from 'cheerio';
import axios from 'axios';
import ytdl from 'ytdl-core';
import jimp from "jimp";
import got from "got"
import yts from "yt-search";

export async function getBuffer(url) {
  return await got(url).buffer();
};
export async function getJson(url) {
  return await got(url).json();
};
export async function getText(url) {
  return await got(url).text();
};
export async function resize (image, width, height) {
  const read = await jimp.read(image);
  const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
  return data;
};
export async function downloadMedia(message, pathFile) {
  const type = Object.keys(message)[0];
  const mimeMap = {
    imageMessage: "image",
    videoMessage: "video",
    stickerMessage: "sticker",
    documentMessage: "document",
    audioMessage: "audio",
  };
  try {
    if (pathFile) {
      const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      await promises.writeFile(pathFile, buffer);
      return pathFile;
    } else {
      const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      };
      return buffer;
    };
  } catch (e) {
    Promise.reject(e);
  };
};
export async function pluginLoader(dir) {
  let pluginFolder = join(dirname(fileURLToPath(import.meta.url)), dir)
  let pluginFilter = filename => /\.js$/.test(filename)
  let plugins = {}
  function Scandir(dir) {
    let subdirs = readdirSync(dir)
    let files = subdirs.map((sub) => {
      let res = join(dir, sub)
      return statSync(res).isDirectory() ? Scandir(res) : res
    });
    return files.reduce((a, f) => a.concat(f), [])
  }
  for (let filelist of Scandir(pluginFolder).filter(pluginFilter)) {
    let filename = basename(filelist, '.js')
    try {
      plugins[filename] = await import(filelist)
      nocache(filelist, module => module)
    } catch (e) {
      console.log(e);
      delete plugins[filename]
    }
  }
  return plugins
}
export async function nocache(module, cb = () => { }) {
  watchFile(resolve(module, import.meta.url), async() => {
    await uncache(resolve(module, import.meta.url))
    cb(module)
  })
}
export async function uncache(module = '.') {
  return new Promise((resolve, reject) => {
    try {
      if (!!import.meta && !!import.meta.cache) {
        for (let p in import.meta.cache) {
          delete import.meta.cache[resolve(module, import.meta.url)]
        }
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })
} 
export function color (text, color) {
  return !color ? chalk.green(text) : chalk.keyword(color)(text)
};
export function bgcolor (text, bgcolor) {
  return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
};
export function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
export function query (command, text) {
  return `Maaf, Perintah yang anda masukkan salah, Harap kirim perintah dengan contoh seperti ini: ${command} ${text}`
};
export function input (type, command, text) {
  return `Maaf, Input pemasukan salah, Bagian ${type} belum di isi, contoh yang benar: ${command} ${text}`
};
export function wait (sender) {
  return `Halo @${sender.split("@")[0]}, Mohon tunggu sebentar yah, Permintaan anda sedang di proses!`
};
export function success (status, query) {
  return `Permintaan anda berhasil di proses!\nJenis proses '${status}', Hasil yang di ${status} adalah '${query}'`
};
export function error (type, reason) {
  return `Maaf, Terjadi kesalahan pada ${type}, Penyebab: ${reason}`
};
export function certainGroup (number, title) {
  return `Maaf, Perintah ini hanya bisa di gunakan dalam grup tertentu, Jika anda ingin masuk ke dalam grup khusus agar bisa akses fitur ini, Silahkan sewa bot terlebih dahulu, Informasi selengkapnya hubungi https://wa.me/${number} (${title})`
};
export function decodeJid (jid) {
  if (/:\d+@/gi.test(jid)) {
    const decode = jidDecode(jid) || {};
    return (
      (decode.user && decode.server && decode.user + "@" + decode.server) ||
      jid
    ).trim();
  } else {
    return jid.trim();
  };
};
export function isUrl (url) {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
};
export function formatNumber (num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  };
};
export function sizeString (des) {
  if (des === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(des) / Math.log(1024));
  return parseFloat((des / Math.pow(1024, i)).toFixed(0)) + ' ' + sizes[i];
};
export function formatMoney (money) {
  const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'Td', 'qd', 'Qd', 'sd', 'Sd', 'od', 'nd', 'V', 'Uv', 'Dv', 'Tv', 'qv', 'Qv', 'sv', 'Sv', 'ov', 'nv', 'T', 'UT', 'DT', 'TT', 'qt', 'QT', 'st', 'ST', 'ot', 'nt'];
  const suffixIndex = Math.floor(Math.log10(money) / 3);
  const suffix = suffixes[suffixIndex];
  const scaledmoney = money / Math.pow(10, suffixIndex * 3);
  return scaledmoney.toFixed(2) + suffix;
};
export function runtime (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s ") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};
export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}; 
export function timers (date) {
  const seconds = Math.floor((date / 1000) % 60),
  minutes = Math.floor((date / (60 * 1000)) % 60), 
  hours = Math.floor((date / (60 * 60 * 1000)) % 24), 
  days = Math.floor((date / (24 * 60 * 60 * 1000)));
  return `${days ? `${days} Hari ` : ''}${hours ? `${hours} Jam ` : ''}${minutes ? `${minutes} Menit ` : ''}${seconds ? `${seconds} Detik` : ''}`;
};