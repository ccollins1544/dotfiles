"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
let scripts = {};

// Excluded because they are reserved for package.json scripts (i.e, npm run <script>)
let exclude_files = ["init.js"];

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      exclude_files.includes(file) === false
    );
  })
  .forEach(function (file) {
    let script = require(path.join(__dirname, file));
    scripts = {
      ...scripts,
      ...script
    };
  });

module.exports = scripts;