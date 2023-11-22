/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import newWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC
} from "@whiskeysockets/baileys";
import axios from 'axios';
import { fileURLToPath } from "url";
import Serialize from './structure/serialize.js';
import { Boom } from '@hapi/boom';
import readline from "readline";
import { db } from '../database/index.js';
import isFiltered from './structure/handler.js';
import { 
  ConnectionOn, 
  CallOn, 
  GPU, 
  GU 
} from './utils/index.js';
import optionSocket, { logger, store } from './model/store.js';
import chalk from 'chalk';
import { parsePhoneNumber } from "libphonenumber-js";
import open from "open";
import fs from 'fs';
import path from 'path';

const { state, saveCreds } = await useMultiFileAuthState('./database/session')

class WAConnection {
  constructor () {
    this.phoneNumber = db.config?.authorNumber[0];
    this.pairingCode = !!this.phoneNumber || process.argv.includes("--pairing-code");
    this.useMobile = process.argv.includes("--mobile");
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    this.question = (text) => new Promise((resolve) => this.rl.question(text, resolve));
    this.sock = newWASocket.default(
      Object.assign(
        new optionSocket(this.pairingCode, this.useMobile), { 
          auth: { 
          creds: state.creds, 
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        }
      })
    )
  };
  async run () {
    store?.bind(this.sock.ev);
    await this.codePairingAccess();
    await this.codeMobileAccess();
    this.sock.ev.process(async (events) => {
      if(events["connection.update"]) {
        new ConnectionOn({
          sock: this.sock, 
          db, 
          update: events["connection.update"], 
          WAConnection, 
        }).start();
      };
      if(events["creds.update"]) {
        await saveCreds();
      };
      if(events["call"]) {
        new CallOn({
          sock: this.sock, 
          m: events["call"][0], 
          db
        }).start();
      };
      if(events["groups.update"]) {
        new GU({
          sock: this.sock, 
          groupsUpdate: events["groups.update"]
        }).start();
      };
      if(events["group-participants.update"]) {
        new GPU({
          sock: this.sock, 
          participantsUpdate: events["group-participants.update"], 
          db
        }).start();
      };
      if(events["messages.upsert"]) {
        for (const message of events["messages.upsert"].messages) {
          new isFiltered({
            m: new Serialize(message, this.sock, store), 
            sock: this.sock, 
            store, 
            message, 
            newWASocket
          }).start();
        };
      };
    });
    return this.sock;
  };
  async codePairingAccess () {
    if(this.pairingCode && !this.sock.authState.creds.registered) {
      if(this.useMobile) throw new Error('Cannot use pairing code with mobile api');
      if(!!this.phoneNumber) {
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '')
          if(!Object.keys(PHONENUMBER_MCC).some(v => this.phoneNumber.startsWith(v))) {
          console.log(chalk.bgBlack(chalk.redBright(`Start with country code of your WhatsApp Number, example: +${this.db.config?.authorNumber[0]}`)));
          process.exit(0);
        };
      } else {
        this.phoneNumber = await this.question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +${this.db.config?.authorNumber[0]} : `)));
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
        if(!Object.keys(PHONENUMBER_MCC).some(v => this.phoneNumber.startsWith(v))) {
          console.log(chalk.bgBlack(chalk.redBright(`Start with country code of your WhatsApp Number, example: +${this.db.config?.authorNumber[0]}`)));
          this.phoneNumber = await this.question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +${this.db.config?.authorNumber[0]} : `)));
          this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
          this.rl.close();
        };
      };
      setTimeout(async () => {
        let code = await this.sock.requestPairingCode(this.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
      }, 3000);
    };
  };
  async codeMobileAccess () {
    if(this.useMobile && !this.sock.authState.creds.registered) {
      const { registration } = this.sock.authState.creds || { registration: {} }
      if(!registration.phoneNumber) {
        this.phoneNumber = await this.question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)));
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
        if(!Object.keys(PHONENUMBER_MCC).some(v => this.phoneNumber.startsWith(v))) {
          console.log(chalk.bgBlack(chalk.redBright(`Start with your country's WhatsApp code, Example : ${db.config?.authorNumber[0]}`)));
          this.phoneNumber = await this.question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)));
          this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
        };
        registration.phoneNumber = "+" + this.phoneNumber;
      };
      this.phoneNumber = parsePhoneNumber(registration.phoneNumber);
      if(!this.phoneNumber.isValid()) throw new Error('Invalid phone number: ' + registration.phoneNumber);
      registration.phoneNumber = this.phoneNumber.format("E.164");
      registration.phoneNumberCountryCode = this.phoneNumber.countryCallingCode;
      registration.phoneNumberNationalNumber = this.phoneNumber.nationalNumber;
      const mcc = PHONENUMBER_MCC[this.phoneNumber.countryCallingCode];
      registration.phoneNumberMobileCountryCode = mcc;
      await this.askOTP();
    };  
  };
  async enterCode() {
    try {
      const code = await this.question(chalk.bgBlack(chalk.greenBright(`Please Enter Your OTP Code : `)));
      const response = await this.sock.register(code.replace(/[^0-9]/g, '').trim().toLowerCase());
      console.log(chalk.bgBlack(chalk.greenBright("Successfully registered your phone number.")));
      console.log(response);
      this.rl.close();
    } catch (e) {
      console.error('Failed to register your phone number. Please try again.\n', e);
      await this.askOTP()
    };
  };
  async enterCaptcha() {
    const response = await this.sock.requestRegistrationCode({ ...registration, method: 'captcha' });
    const pathFile = path.join(process.cwd(), "tmp", "captcha.png");
    fs.writeFileSync(pathFile, Buffer.from(response.image_blob, 'base64'));
    await open(pathFile);
    const code = await this.question(chalk.bgBlack(chalk.greenBright(`Please Enter Your Captcha Code : `)));
    fs.unlinkSync(pathFile);
    registration.captcha = code.replace(/["']/g, '').trim().toLowerCase();
  };
  async askOTP() {
    if(!registration.method) {
      let code = await this.question(chalk.bgBlack(chalk.greenBright('What method do you want to use? "sms" or "voice" : ')));
      code = code.replace(/["']/g, '').trim().toLowerCase();
      if(code !== 'sms' && code !== 'voice') return await this.askOTP();
      registration.method = code;
    };
    try {
      await this.sock.requestRegistrationCode(registration);
      await this.enterCode();
    } catch (e) {
      console.error('Failed to request registration code. Please try again.\n', e);
      if(e?.reason === 'code_checkpoint') {
        await this.enterCaptcha();
      };
      await this.askOTP();
    };
  };
};

new WAConnection().run();
