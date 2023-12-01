import { Collection } from '../../collection.js';
import fs from 'fs';

export class Execute extends Collection {
  constructor (m, sock, { 
    newWASocket, 
    db, 
    store, 
    Function, 
    attribute
  }) {
    super('other', {
      description: 'Displaying features on bots',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['menu'];
    this.execute = async () => {
      let text = `Subscribe : ${Function.formatMoney(Object.keys(db.user).length)}\n`
      text += `View : ${Function.formatMoney(db.config.chat)}\n`
      text += `Total Command : ${JSON.parse(fs.readFileSync('./database/costume/totalcommand.json'))}\n`
      return m.reply(await this.indexMenu(text, count, m))
    };
  };
};