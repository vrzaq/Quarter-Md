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
    this.command = [ 'checkusage' ] 
    this.execute = async () => {
let data = Function.sizeString(process.memoryUsage().rss)
return m.reply(`Memory Di Pakai: ${data}`)
}
  }
}