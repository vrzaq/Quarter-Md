# Quarter-Md
## Opsi Plugin Pada Command

### Contoh isi Pada Fungsi Opsi Plugin
this.command = [ 'ping' ]
this.parameter = 'silahkan tag seseorang atau reply chat nya!'
this.description = 'Follow https://github.com/vrzaq'
this.category = 'other'
this.public = true || false
this.function = true || false
this.exp = 0

### Contoh buat fitur (Execute)
this.execute = async () => {
    if(m.mentions ? m.mentions[0] : m.quoted.participant) {
        return m.reply(`Pengguna @${m.sender.split(`@`)[0]}, Telah ngeping kamu silahkan cek pesan pribadi dari bot.`).then(() => {
        return sock.sendMessage(m.mentions ? m.mentions[0] : m.quoted.participant, { text: `ping\n\ndari @${m.sender.split("@")[0]}, Pesan ini di teruskan oleh bot whatsapp, Jika Ingin merespon silahkan chat orang yang di tag tersebut.`, mentions: [m.quoted.participant, m.sender] })
    } else {
        throw m.reply(this.parameter)
    };
};

### Contoh buat function (Branch)
this.branch = async () => {
    if(m.command) {
        this.exp++
    } else {
        throw m.reply('Maaf perintah yang anda cari tidak di temukan.')
    };
};

### Contoh buat fitur kostum prefix / no prefix
this.options: {
    permission: 0,
    setup: {
        group: false,
    },
    prefix: 'SAVE'
};
this.costume = async (query) => {
    if(!query) throw 'Nomornya mana ?'
    if(!isNaN(query)) {
        db.config.aave.push(query)
        return m.reply('Berhasil menyimpan!')
    } else {
        return m.reply('harus berupa nomor')
    }
};

### Kostum isi (Filter Pilihan Editor)
this.editor = {
    exclusive: {
        type: 'add',
        index: 1
    },
    experiment:  false,
    beta: false,
};

### Kostum opsi (Respon Khusus)
this.options: {
    permission: 0,
    setup: {
        group: false,
        private: false,
        premium: false,
        mods: false,
    },
    prefix: ''
};

- **permission: 0** `all`
- **permission: 1** `owner`
- **permission: 2** `admin`
- **permission: 3** `botAdmin`

### Seluruh Akses dalam konstruktor
const properties = { 
  newWASocket,
  db,
  store,
  Function,
  attribute
};

constructor(m, sock, properties)
