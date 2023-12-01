/* Copyright (C) 2023 https://github.com/vrzaq/
Quarter-Md - Licensed under the GPL-3.0 License;
Buy premium Script contact WhatsApp https://wa.me/6285763538115/
Only updates on YouTube Arifi Razzaq Ofc (@khirazzdev)
*/

import { readFileSync, accessSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dirr = join(dirname(fileURLToPath(import.meta.url)), "file");
const dbName = "database.json";
const file = {
  user: join(dirr, "user." + dbName),
  group: join(dirr, "group." + dbName),
  config: join(dirr, "config." + dbName)
};

accessSync(file.user);
accessSync(file.group);
accessSync(file.config);

export let db = {
  user: JSON.parse(readFileSync(file.user)),
  group: JSON.parse(readFileSync(file.group)),
  config: JSON.parse(readFileSync(file.config))
};

setInterval(async() => {
  writeFileSync(file.user, JSON.stringify(db.user, null, 2));
  writeFileSync(file.group, JSON.stringify(db.group, null, 2));
  writeFileSync(file.config, JSON.stringify(db.config, null, 2));
}, 990); 
