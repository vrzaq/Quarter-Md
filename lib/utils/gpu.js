/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

export class GPU {
  constructor ({ 
    sock, 
    participantsUpdate, 
    db 
  }) {
    this.sock = sock;
    this.participantsUpdate = participantsUpdate;
    this.db = db;
  };
  async start () {
    const {  id, participants, action } = await this.participantsUpdate;
    const metadata = await this.sock.groupMetadata(id);
    for (const jid of participants) {
      try {
        var profile = await this.sock.profilePictureUrl(jid, "image", 3000)
      } catch {
        var profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu"
      };
      if(action == "add") {
        if(this.db.group[id]?.welcome) {
          return this.sock.sendMessage(id, { 
            text: `Halo @${jid.split("@")[0]}, Selamat datang dalam grup *${metadata.subject}*, Silahkan isi biodata untuk profil kamu dalam database bot whatsapp.\n\nSilahkan ketik "#setbiodata" untuk menyetel profil mu dan untuk menampilkan profil, Silahkan ketik "#profile"\n\nTerima kasih sudah bergabung kedalam grup ini, Semoga betah yah @${jid.split("@")[0]}`, 
            contextInfo: { 
              mentionedJid: [jid], 
              externalAdReply: { 
                title: `W E L C O M E`, 
                mediaType: 1, 
                previewType: 0, 
                renderLargerThumbnail: true,
                thumbnailUrl: profile, 
                sourceUrl: this.db.config?.homepage 
              }, 
            }, 
          });
        };
      } else if(action == "remove") {
        if(this.db.group[id]?.leave) {
          return this.sock.sendMessage(id, { 
            text: `Pengguna @${jid.split("@")[0]}, Telah keluar dalam grup *${metadata.subject}*`,
            contextInfo: { 
              mentionedJid: [jid], 
              externalAdReply: { 
                title: `L E A V E`, 
                mediaType: 1, 
                previewType: 0,
                renderLargerThumbnail: true, 
                thumbnailUrl: profile, 
                sourceUrl: this.db.config?.homepage
              },
            }, 
          });
        };
      } else if(action == "promote") {
        if(this.db.group[id]?.promote) {
          return this.sock.sendMessage(id, { 
            text: `Halo @${jid.split("@")[0]}, Selamat kamu telah menjadi admin grup *${metadata.subject}*`,
            contextInfo: { 
              mentionedJid: [jid], 
              externalAdReply: { 
                title: `P R O M O T E`, 
                mediaType: 1, 
                previewType: 0,
                renderLargerThumbnail: true, 
                thumbnailUrl: profile, 
                sourceUrl: this.db.config?.homepage
              },
            }, 
          });
        };
      } else if(action == "demote") {
        if(this.db.group[id]?.demote) {
          return this.sock.sendMessage(id, { 
            text: `Pengguna @${jid.split("@")[0]}, Kamu bukan admin grup *${metadata.subject}* lagi`,
            contextInfo: { 
              mentionedJid: [jid], 
              externalAdReply: { 
                title: `D E M O T E`, 
                mediaType: 1, 
                previewType: 0,
                renderLargerThumbnail: true, 
                thumbnailUrl: profile, 
                sourceUrl: this.db.config?.homepage
              },
            }, 
          });
        };
      };
    };
  };
};