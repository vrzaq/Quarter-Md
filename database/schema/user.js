import { db } from "../index.js";

export class User {
  constructor(m) {
    this.m = m;
  }
  Expose() {
    if(!this.m) return;
    let s = this.m.sender, user = db.user[s];
    if(!user) db.user[s] = {};
    if(user) {
      if(!("afk" in user)) db.user[s].afk = -1;
      if(!("rafk" in user)) db.user[s].rafk = "";
      if(!("lastseen" in user)) db.user[s].lastseen = new Date() * 1;
      if(!("warning" in user)) db.user[s].warning = 0;
      if(!("premium" in user)) db.user[s].premium = false;
      if(!("premiumTime" in user)) db.user[s].premiumTime = 0;
      if(!("banned" in user)) db.user[s].banned = false;
      if(!("transaction" in user)) db.group[c].transaction = [{
        fromId: {
          sender: s,
          date: new Date().toDateString(),
          order: '',
          item: 1,
          price: 0,
          paid: '',
          status: ''
        },
      }];
      if(!("hit" in user)) db.user[s].hit = 1;
      if(!("chat" in user)) db.user[s].chat = 1;
      if(!("nama" in user)) db.user[s].nama = "";
      if(!("status" in user)) db.user[s].status = "";
      if(!("hobi" in user)) db.user[s].hobi = "";
      if(!("kelas" in user)) db.user[s].kelas = "";
      if(!("instagram" in user)) db.user[s].instagram = "";
      if(!("instagram_url" in user)) db.user[s].instagram_url = "";
      if(!("tiktok" in user)) db.user[s].tiktok = "";
      if(!("tiktok_url" in user)) db.user[s].tiktok_url = "";
      if(!("fakeQuoted" in user)) db.user[s].fakeQuoted = 'halo kak %name';
      if(!("modelreply" in user)) db.user[s].modelreply = 'fake';
      if(!("lastclaim" in user)) db.user[s].lastclaim = 0;
      if(!("jid" in user)) db.user[s].jid = s;
      if(!("registered" in user)) db.user[s].registered = false;
    } else db.user[s] = {
      afk: -1,
      rafk: "",
      lastseen: new Date() * 1,
      warning: 0,
      limit: 50,
      premium: false,
      premiumTime: 0,
      banned: false,
      transaction: [{
        fromId: {
          sender: s,
          date: new Date().toDateString(),
          order: '',
          item: 1,
          price: 0,
          paid: '',
          status: ''
        },
      }],
      hit: 1,
      chat: 1,
      nama: "",
      status: "",
      hobi: "",
      kelas: "",
      instagram: "",
      instagram_url: "",
      tiktok: "",
      tiktok_url: "",
      fakeQuoted: 'halo kak %name',
      modelreply: 'fake',
      lastclaim: 0,
      jid: s,
      registered: false,
    };
  };
};