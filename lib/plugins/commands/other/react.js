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
         group : true ,
      },
    };
    this.command = [ 'react' ] 
    this.execute = async () => {
        try {
          m.react(m.args[0])
        } catch {
          m.reply("harus berupa emoji")
        }; 
}
  }
}