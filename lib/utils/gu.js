/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

export class GU {
  constructor ({ 
    sock, 
    groupsUpdate 
  }) {
    this.sock = sock;
    this.groupsUpdate = groupsUpdate;
  };
  async start () {
    for (const gu of await this.groupsUpdate) {
      if(gu.announce == true) {
        return this.sock.sendMessage(gu.id, { text: `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, });
      } else if(gu.announce == false) {
        return this.sock.sendMessage(gu.id, { text: `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, });
      } else if(gu.restrict == true) {
        return this.sock.sendMessage(gu.id, { text: `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, });
      } else if(gu.restrict == false) {
        return this.sock.sendMessage(gu.id, { text: `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, });
      } else {
        return this.sock.sendMessage(gu.id, { text: `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${gu.subject}*`, });
      };
    };
  };
};