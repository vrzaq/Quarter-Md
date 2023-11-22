`use strict`;
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { platform } from "os";
import { watchFile, unwatchFile, readFileSync } from "fs";
import express from 'express';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const unhandledRejections = new Map();
const port = process.env.PORT || 8080;

var app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
});

function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  if(/(\/\/|\.)undefined\./.test(url)) return;
  setInterval(() => {
   fetch(url).catch(console.error);
  }, 5 * 1000 * 60);
};

app.listen(port, () => {
  console.log('App listened on port', port)
  keepAlive()
});

var isRunning = false;

function start(file) {
  if(isRunning) return;
  isRunning = true;
  console.log("[System] Starting bot...");
  let args = [path.join(__dirname, file), ...process.argv.slice(2)];
  let p = spawn(process.argv[0], args, {
    stdio: ["inherit", "inherit", "inherit", "ipc"] 
  });
  p.on("message", (data) => {
    switch (data) {
      case "reset": {
        platform() === "win32" ? p.kill("SIGINT") : p.kill();
        isRunning = false;
        start.apply(this, arguments);
        console.log("[System] Restarting bot...");
      };
      break;
      case "uptime": {
        p.send(process.uptime());
      };
      break;
    };
  });
  p.on("exit", (code) => {
    isRunning = false;
    console.error("Exited with code:", code);
    if(code === 0) return;
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });
};
start("lib/main.js");

process.on('unhandledRejection', function (reason, promise) {
  unhandledRejections.set(promise, reason)
});
process.on('rejectionHandled', function (promise) {
  unhandledRejections.delete(promise)
});