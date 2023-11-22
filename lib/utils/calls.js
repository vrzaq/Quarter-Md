/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

export class CallOn {
  constructor ({
    sock, 
    m, 
    db
  }) {
    this.sock = sock;
    this.m = m;
    this.db = db;
  };
  start () {
    if(this.db.config?.anticall) {
      if(this.m.status == "offer") {
        this.sock.rejectCall(this.m.id, this.m.from);
      };
    };
  };
};