import { Collection } from '../../collection.js';

export class Execute extends Collection {
  constructor (m, sock) {
    super('other', {
      description: 'Untuk ngetes command bot nya bisa atau engga',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['vnone'];
    this.execute = async () => {
      return sock.sendMessage(m.chat, {audio: {url: 'https://filezone.my.id/file/7f95dfa7ccfa04d6a7d6.mp3'}, mimetype: 'audio/mpeg', ptt: true,  viewOnce: true})
    };
  };
};