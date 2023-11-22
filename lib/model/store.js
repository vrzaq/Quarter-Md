/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import pino from 'pino';
import NodeCache from "node-cache";
import { 
  makeInMemoryStore, 
  jidNormalizedUser
} from '@whiskeysockets/baileys';

export const logger = pino({ level: "silent", stream: "store" }).child({ level: "silent" })
export const store = makeInMemoryStore(logger);
export default class optionSocket {
  constructor (pairingCode, useMobile) {
    this.logger = logger;
    this.printQRInTerminal = !pairingCode;
    this.mobile = useMobile;
    this.browser = ['Chrome (Linux)', '', ''];
    this.msgRetryCounterCache = new NodeCache();
    this.defaultQueryTimeoutMs = undefined;
    this.markOnlineOnConnect = true;
    this.generateHighQualityLinkPreview = true;
    this.getMessage = async (key) => {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)
      return msg?.message || ""
    };
    this.patchMessageBeforeSending = (message) => {
      const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
      if(requiresPatch) message = { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} }, ...message } } };
      return message;
    };
  };
};
