import { db } from "../index.js";

export class Group {
  constructor(m) {
    this.m = m;
  }
  Expose() {
    if(!this.m) return;
    if(!this.m.isGroup) return;
    let c = this.m.chat, chat = db.group[c];
    if(!chat) db.group[c] = {};
    if(chat) {
      if(!("afk" in chat)) db.group[c].afk = -1;
      if(!("rafk" in chat)) db.group[c].rafk = "";
      if(!("antilinkgroup" in chat)) db.group[c].antilinkgroup = false;
      if(!("antilinkwhatsapp" in chat)) db.group[c].antilinkwhatsapp = false;
      if(!("antilinkyoutube" in chat)) db.group[c].antilinkyoutube = false;
      if(!("antilinktelegram" in chat)) db.group[c].antilinktelegram = false;
      if(!("antilinksnackvideo" in chat)) db.group[c].antilinksnackvideo = false;
      if(!("antilinkinstagram" in chat)) db.group[c].antilinkinstagram = false;
      if(!("antilinkfacebook" in chat)) db.group[c].antilinkfacebook = false;
      if(!("antilinktiktok" in chat)) db.group[c].antilinktiktok = false;
      if(!("antilinktwitter" in chat)) db.group[c].antilinktwitter = false;
      if(!("antibadword" in chat)) db.group[c].antibadword = false;
      if(!("antilinkthreads" in chat)) db.group[c].antilinkthreads = false;
      if(!("kickdetector" in chat)) db.group[c].kickdetector = true;
      if(!("mute" in chat)) db.group[c].mute = false;
      if(!("autosticker" in chat)) db.group[c].autosticker = false;
      if(!("badword" in chat)) db.group[c].badword =  ["anjeng", "anjing", "asu", "babi", "ngentot", "pepek", "kontol", "bangsat", "memek", "tetek"];
      if(!("welcome" in chat)) db.group[c].welcome = false;
      if(!("leave" in chat)) db.group[c].leave = false;
      if(!("promote" in chat)) db.group[c].promote = false;
      if(!("demote" in chat)) db.group[c].demote = false;
      if(!("rednumber" in chat)) db.group[c].rednumber = [
        {
          user: "Nstar",
          julukan: "Mastah Pecundang! Ngaku Developers Bot Tapi Bad Attitude, Tukang Kudeta / Ambil Alih Grup Orang!",
          id: "62882003889958 Tukang ",
        }, {
          user: "Putri Lestari",
          julukan: "Modus Vcs Gratis! Pertama dia minta akun sosmed dia di follow, Lalu dikasih vc, setelah vc beberapa detik di matiin dia lalu dia vc lagi, detik detik dia matiin dia sudah record vc yang beberapa detik tersebut buat kirim ke teman teman akun sosmed kita, Sebelumnya kan dia minta follow baik akun ig atau tiktok, pastinya saat kita follow akun dia, disitu dia ambil data kita buat nyebar aib, dan minta uang tebusan agar video vcs tersebut engga di Viral kan dan engga di Share, Janganlah tergoda dengan wanita-wanita pelacur, Allah telah menutupi aib mu, Tapi terkadang kamu lupa menutupi aib mu sendiri!",
          id: "62831690369818",
        },
      ];
      if(!("antirednumber" in chat)) db.group[c].antirednumber = false;
      if(!("autosticker" in chat)) db.group[c].autosticker = false;
      if(!("deletemedia" in chat)) db.group[c].deletemedia = false;
      if(!("deletemediaTime" in chat)) db.group[c].deletemediaTime = 7000;
    } else db.group[c] = {
      afk: -1,
      rafk: "",
      antilinkgroup: false,
      antilinkwhatsapp: false,
      antilinkyoutube: false,
      antilinktelegram: false,
      antilinksnackvideo: false,
      antilinkinstagram: false,
      antilinkfacebook: false,
      antilinktiktok: false,
      antilinktwitter: false,
      antibadword: false,
      antilinkthreads: false,
      kickdetector: true,
      mute: false,
      autosticker: false,
      badword:  ["anjeng", "anjing", "asu", "babi", "ngentot", "pepek", "kontol", "bangsat", "memek", "tetek"],
      welcome: false,
      leave: false, 
      promote: false,
      demote: false,
      rednumber: [
        {
          user: "Nstar",
          id: ["62882003889958"],
          julukan: "Mastah Pecundang! Ngaku Developers Bot Tapi Bad Attitude, Tukang Kudeta / Ambil Alih Grup Orang!",
        }, {
          user: "Putri Lestari (Lonte)",
          id: ["62831690369818"],
          julukan: "Modus Vcs Gratis! Pertama dia minta akun sosmed dia di follow, Lalu dikasih vc, setelah vc beberapa detik di matiin dia lalu dia vc lagi, detik detik dia matiin dia sudah record vc yang beberapa detik tersebut buat kirim ke teman teman akun sosmed kita, Sebelumnya kan dia minta follow baik akun ig atau tiktok, pastinya saat kita follow akun dia, disitu dia ambil data kita buat nyebar aib, dan minta uang tebusan agar video vcs tersebut engga di Viral kan dan engga di Share, Janganlah tergoda dengan wanita-wanita pelacur, Allah telah menutupi aib mu, Tapi terkadang kamu lupa menutupi aib mu sendiri!",
        },
      ],
      antirednumber: false,
      autosticker: false,
      deletemedia: false,
      deletemediaTime: 7000,
    };
  };
};