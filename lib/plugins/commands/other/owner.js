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
    this.command = ['owner'] 
    this.execute = async () => {
let snContact = {
        displayName: "Contact", contacts: [{displayName: db.config.authorName, vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;"+db.config.authorName+";;;\nFN:"+db.config.authorName+"\nitem1.TEL;waid="+db.config.authorNumber+":"+db.config.authorNumber+"\nitem1.X-ABLabel:Ponsel\nEND:VCARD"}]
      }
      await sock.sendMessage(m.chat, {contacts: snContact}, {ephemeralExpiration: 86400})
await m.reply("Silahkan chat dan berikan keluhan ataupun pertanyaan anda.") 
}
  }
}