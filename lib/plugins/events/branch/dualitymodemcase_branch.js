/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { Collection } from '../../collection.js';
import { Group } from '../../index.js';
import { format } from 'util';
import axios from 'axios';
import fs from "fs";
import { getContentType } from '@whiskeysockets/baileys';

export class Execute extends Collection {
  constructor (m, sock, {
    newWASocket, 
    db, 
    store, 
    Function, 
    attribute
  }) {
    super('branch/function', {
      function: true,
      public: true
    });
    this.editor = {
      exclusive: {
        type: 'add',
        index: 1,
      },
      experiment: true,
    };
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.branch = async () => {
      if(this.editor.experiment) {
        try {
          switch (m.command) {
            case "ping": {
              return m.reply("pong!")
            };
            break;
          }
        } catch (error) {
          m.reply(format(error))
        };
      };
    };
  };
};