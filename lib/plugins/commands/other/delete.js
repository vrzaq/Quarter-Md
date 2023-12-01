import { Collection } from '../../collection.js';

export class Execute extends Collection {
  constructor (m, sock) {
    super('other', {
      parameter: '',
      description: '',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['delete'];
    this.execute = async () => {
      if(!m.quoted) return m.reply("reply chat yg ingin di hapus")
      sock.sendMessage(m.chat, { 
        delete: {
          remoteJid: m.chat, 
          fromMe: m.quoted && m.quoted.isBot ? true : false, 
          id: m.quoted ? m.quoted.key.id : m.key.id, 
          participant: m.quoted ? m.quoted.participant : m.sender
        },
      });
    };
  };
};