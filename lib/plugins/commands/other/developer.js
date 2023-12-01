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
         group: false ,
      },
    };
    this.command = ['developer'] 
    this.execute = async () => {
sock.sendContact(m.chat, "Arifi Razzaq", [["6283193905842", "6283193905842"], [db.config.authorNumber[0], db.config.authorNumber[0]]], m)

}
  }
}