/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { Collection } from '../../collection.js';
import { format } from 'util';
import { exec } from 'child_process';

export class Execute extends Collection {
  constructor (m, sock) {
    super('costume/function', {
      parameter: '<code>',
      description: 'Run terminal code directly',
    });
    this.options = { 
      permission: 1,
      setup: {
        group: false,
      },
      prefix: "$",
    };
    this.special = async (query) => {
      await exec(query, (stderr, stdout) => {
        if(stderr) return sock.sendMessage(m.chat, { text: `${format(stderr)}` }, { quoted: m })
        if(stdout) return sock.sendMessage(m.chat, { text: `${format(stdout)}` }, { quoted: m })
      });
      console.log("EXEC : "+ query)
    };
  };
};