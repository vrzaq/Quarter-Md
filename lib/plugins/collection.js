/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import fs from 'fs/promises';
import { readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { format } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Collection {
  constructor(category, helper = {}) {
    this.category = category;
    this.helper = helper;
  };
  async readFitur () {
    let pathdir = path.join(__dirname, "./commands");
    let fitur = readdirSync(pathdir);
    for (let fold of fitur) {
      for (let filename of readdirSync(__dirname + `/commands/${fold}`)) {
        let plugins = import(path.join(__dirname + `/commands/${fold}`, filename));
        await plugins
      };
    };
  };
  async indexMenu (text, count, m) {
    const path = `./lib/plugins/commands/`;
    const Cmdlist = [];
    const files = await fs.readdir(path);
    const groups = {};
    for (const file of files) {
      const nestedFile = await fs.readdir(path + file);
      nestedFile.forEach((name) => {
        if(!name.endsWith('.js')) return;
        const names = name.replace(/\.js/g, '');
        Cmdlist.push({
          name: names,
          group: file,
          path: `./commands/${file}/${name}`,
        });
      });
    };
    Cmdlist.forEach((item) => {
      if(!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item.name);
    });
    for (const group in groups) {
      text +=  `\n*${group}* (${groups[group].length})\n`
      for(let member of groups[group]) {
        text += `(${count++}) ${m.prefix+member}\n`
      };
    };
    text += `\n*Add -i to display information in the command, Example ${m.prefix}${m.command} -i*`
    writeFileSync('./database/costume/totalcommand.json', format(count))
    return text
  };
};
