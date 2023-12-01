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
    this.command = [ 'test' ] 
    this.execute = async () => {
      m.fakeReply("work as command")
    }
  }
}