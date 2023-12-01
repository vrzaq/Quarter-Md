import { Collection } from '../../collection.js';
import moment from 'moment-timezone';
import { format } from 'util';

export class Execute extends Collection {
  constructor (m, sock, { 
    newWASocket, 
    db, 
    store, 
    Function, 
    attribute
  }) {
    super('other', {
      description: 'Daily information on bots',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['changelog'];
    this.execute = async () => {
      const handler = await Function.pluginLoader('../plugins/events'); 
      const properties = { 
        newWASocket, 
        db, 
        store, 
        Function, 
        attribute
      };
      new handler.resetchangelog_branch.Execute(m, sock, properties).branch();
      let text = `*CHANGELOG BOT*\n\n`;
      try {
        if(db.config?.changelogV2 || db.config?.changelogV1) {
          text += `*UPDATE* (${db.config?.changelogV2.length})\n`
          for (let i of db.config?.changelogV2) {
            text += `*• ${moment(i.time).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss').split(' ').join(' (')} WIB)*\n• Command *${m.prefix}${i.update}* telah di update!\n\n`
          }; 
          text += `\n*ADDED* (${db.config?.changelogV1.length})\n`
          for (let ii of db.config?.changelogV1) {
            text += `*• ${moment(ii.time).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss').split(' ').join(' (')} WIB)*\n• Command *${m.prefix}${ii.added}* telah di tambahkan!\n\n`
          };
        } else {
          m.reply('Tidak ada catatan untuk hari ini') 
        };
      } catch (error) {
        return m.reply(format(error))
      };
      text += `Changelog ini bakal di reset dalam Waktu 24 Jam!\n\n`
      text += `Waktu menuju reset: *${Function.timers(m.changelogTime?._idleStart)}*, Setelah 24 jam/1 Hari penuh bot aktif, Changelog ini sudah di reset sepenuhnya.`;
      return sock.sendMessage(m.chat, { text }, { quoted: m });
    };
  };
};