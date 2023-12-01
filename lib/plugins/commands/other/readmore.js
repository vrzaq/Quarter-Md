import { Collection } from '../../collection.js';

export class Execute extends Collection {
  constructor (m, sock, {
    newWASocket, 
    db, 
    store, 
    Function, 
    attribute
  }) {
    super("other", {
      parameter: '',
      description: "",
    });
    this.options = {
      permission: 0,
      setup: {
         group : false ,
      },
    };
    this.command = [ 'readmore' ] 
    this.execute = async () => {
      const more = String.fromCharCode(8206)
      const readMore = more.repeat(4001)
      m.reply(readMore)
    }
  }
}