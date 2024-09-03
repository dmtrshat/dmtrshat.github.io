const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");
const cacheList = [];

function shouldCache(filePath) {
  const fileName = path.basename(filePath);
  const excludePatterns = [".DS_Store"];
  return !excludePatterns.includes(fileName);
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (shouldCache(dirPath)) {
      callback(path.join(dir, f));
    }
  });
}

walkDir(publicDir, (filePath) => {
  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
  cacheList.push("/" + relativePath);
});

fs.writeFileSync(
  "public/urls-to-cache.json",
  JSON.stringify(cacheList, null, 2)
);
console.log("Generated 'urls-to-cache.json`");
