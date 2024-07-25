const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");
const cacheList = [];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(publicDir, function (filePath) {
  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
  cacheList.push("/" + relativePath);
});

fs.writeFileSync("public/urlsToCache.json", JSON.stringify(cacheList, null, 2));
console.log("Generated urlsToCache.json");
