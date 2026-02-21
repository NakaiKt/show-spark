const fs = require("fs");
const path = require("path");

const seedsDir = path.join(__dirname, "../supabase/seeds");
const outputFile = path.join(__dirname, "../supabase/seed.sql");

// seeds/配下のSQLファイルを取得して番号順にソート
const files = fs
  .readdirSync(seedsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

// ファイルを結合
let combined = "";
for (const file of files) {
  const content = fs.readFileSync(path.join(seedsDir, file), "utf8");
  combined += `-- ${file}\n${content}\n\n`;
}

fs.writeFileSync(outputFile, combined);
console.log(`✅ seed.sql generated from ${files.length} files`);
