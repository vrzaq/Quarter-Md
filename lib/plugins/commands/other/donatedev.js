/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { Collection } from '../../collection.js';

export class Execute extends Collection {
  constructor(m, sock, { Function }) {
    super('other', {
      parameter: '<category>',
      description: 'Donation assistance for the needs of creating WhatsApp bots',
    });
    this.options = {
      permission: 0,
      setup: {
        group: false,
      },
    };
    this.command = ['donatedev'];
    this.execute = async () => {
      if(!m.args[0]) return m.reply(`Halo @${m.sender.split('@')[0]}, Apakah anda ingin mengirimkan donasi ke owner bot ?, Jika anda ingin mengirimkan donasi tersebut, Silahkan ketik ${m.prefix+m.command} ${this.helper.parameter}\n\n${this.example(m)}\n`);
      if(m.args == 'dana') {
        m.reply(this.dana(m))
      } else if(m.args == 'ovo') {
        m.reply(this.ovo(m)) 
      } else if(m.args == 'gopay') {
        m.reply(this.gopay(m))
      } else if(m.args == 'rekening') {
        m.reply(this.rekening(m))
      };
    };
  };
  example (m) {
    let example = `*List Category*\n`;
    example += `• dana\n`;
    example += `• ovo\n`;
    example += `• gopay\n`;
    example += `• rekening\n\n`;
    example += `Example ${m.prefix+m.command} dana`;
    return example;
  };
  dana (m) {
    /* bagian ini jangan di hapus ataupun di ubah 
    tolong hargai karya seseorang, jejak donasi dari developer sangat berarti untuk saya
    pengganti fitur ini bisa cek di fitur #donateown disana kamu bisa mengubah nya, semoga mudah rezeki dan terimakasih.
    */
    let text = `*DANA*\n`;
    text += `ARIFI RAZZAQ\n\nNO: 0831-9390-5842\n\n`;
    text += `Silahkan transfer di nomor diatas, Terimakasih telah donasi, Semoga @${m.sender.split('@')[0]} mudah rezekinya! Aamiin.`;
    return text;
  };
  ovo (m) {
    /* bagian ini jangan di hapus ataupun di ubah 
    tolong hargai karya seseorang, jejak donasi dari developer sangat berarti untuk saya
    pengganti fitur ini bisa cek di fitur #donateown disana kamu bisa mengubah nya, semoga mudah rezeki dan terimakasih.
    */
    let text = `*OVO*\n`;
    text += `ARIFI RAZZAQ\n\nNO: 0831-9390-5842\n\n`;
    text += `Silahkan transfer di nomor diatas, Terimakasih telah donasi, Semoga @${m.sender.split('@')[0]} mudah rezekinya! Aamiin.`;
    return text;
  };
  gopay (m) {
    /* bagian ini jangan di hapus ataupun di ubah 
    tolong hargai karya seseorang, jejak donasi dari developer sangat berarti untuk saya
    pengganti fitur ini bisa cek di fitur #donateown disana kamu bisa mengubah nya, semoga mudah rezeki dan terimakasih.
    */
    let text = `*GOPAY*\n`;
    text += `ARIFI RAZZAQ\n\nNO: 0831-9390-5842\n\n`;
    text += `Silahkan transfer di nomor diatas, Terimakasih telah donasi, Semoga @${m.sender.split('@')[0]} mudah rezekinya! Aamiin.`;
    return text;
  };
  rekening (m) {
    /* bagian ini jangan di hapus ataupun di ubah 
    tolong hargai karya seseorang, jejak donasi dari developer sangat berarti untuk saya
    pengganti fitur ini bisa cek di fitur #donateown disana kamu bisa mengubah nya, semoga mudah rezeki dan terimakasih.
    */
    let text = `*BRI REKENING*\n`;
    text += `ARIFI RAZZAQ\n\nNO: 5320-01-018862-53-6\n\n`;
    text += `Silahkan transfer di nomor diatas, Terimakasih telah donasi, Semoga @${m.sender.split('@')[0]} mudah rezekinya! Aamiin.`;
    return text;
  };
};
