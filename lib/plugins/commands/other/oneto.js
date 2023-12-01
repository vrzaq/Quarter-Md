import { Collection } from '../../collection.js';

export class Execute extends Collection {
  constructor (m, sock) {
    super('other', {
      description: 'Write the sequence of numbers from 1 to the specified target',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['oneto'];
    this.execute = async () => {
      if(!m.args[0]) return sock.sendMessage(m.chat, { text: `Satu Sampai Berapa? Misalnya ${m.prefix}oneto 5` }, { quoted: m });
      if(10000 < m.args[0]) return sock.sendMessage(m.chat, { text: `Maaf @${m.sender.split("@")[0]}, Jumlah Kamu Melebihi Batas!`, mentions: [m.sender] }, { quoted: m }); 
      if(!Number(m.args[0])) return sock.sendMessage(m.chat, { text: `Maaf @${m.sender.split("@")[0]}, Harus Berupa Nomor`, mentions: [m.sender] }, { quoted: m });
      let text = "";
      let i = 0;
      do {
        i += 1;
        text += `${i} `;
      } while (i > 0 && i < m.args[0]);
      return sock.sendMessage(m.chat, { text }, { quoted: m });
    };
  };
};