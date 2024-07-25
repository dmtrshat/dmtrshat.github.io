import { exec } from "child_process";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { Command } from "commander";
import dotenv from "dotenv";

dotenv.config();

const SRC_JS = path.resolve("src/js");
const TEMPLATES = path.resolve("templates/**/*.html");
const CONTENT = path.resolve("content/**/*");
const STATIC_JS = path.resolve("static/js");
const GRIMOIRE_CSS_PATH = process.env.GRIMOIRE_CSS_PATH;

const program = new Command();

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red(`Error executing ${command}: ${stderr}`));
        reject(err);
      } else {
        console.log(chalk.green(stdout));
        resolve(stdout);
      }
    });
  });
}

async function compressJS(dir) {
  console.log(chalk.blue(`Compressing JavaScript files in ${dir}...`));
  const entryPoint = path.join(SRC_JS, dir, "index.mjs");
  const outputFile = path.join(STATIC_JS, `${dir}.js`);
  try {
    const startTime = Date.now();
    await runCommand(
      `npx esbuild ${entryPoint} --bundle --minify --outfile=${outputFile}`
    );
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(chalk.green(`Compressed JS output to ${outputFile}`));
    console.log(chalk.green(`Done in ${duration} ms`));
  } catch (error) {
    console.error(chalk.red(`Failed to compress JS for ${dir}`, error));
  }
}

async function grimoireBuild() {
  console.log(chalk.blue("Building CSS with Grimoire..."));
  try {
    const startTime = Date.now();
    await runCommand(`node ${GRIMOIRE_CSS_PATH} build`);
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(chalk.green("Grimoire CSS build complete"));
    console.log(chalk.green(`Done in ${duration} ms`));
  } catch (error) {
    console.error(chalk.red("Failed to build Grimoire CSS", error));
  }
}

async function zolaBuild() {
  console.log(chalk.blue("Building site with Zola..."));
  try {
    const startTime = Date.now();
    await runCommand("zola build");
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(chalk.green("Zola build complete"));
    console.log(chalk.green(`Done in ${duration} ms`));
  } catch (error) {
    console.error(chalk.red("Failed to build site with Zola", error));
  }
}

async function generateCacheList() {
  console.log(chalk.blue("Generating cache list..."));
  try {
    const startTime = Date.now();
    await runCommand("node generate-cache-list.js");
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(chalk.green("Cache list generation complete"));
    console.log(chalk.green(`Done in ${duration} ms`));
  } catch (error) {
    console.error(chalk.red("Failed to generate cache list", error));
  }
}

function getDirectories(srcPath) {
  return fs
    .readdirSync(srcPath)
    .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory());
}

async function buildAll() {
  const dirs = getDirectories(SRC_JS);
  for (const dir of dirs) {
    await compressJS(dir);
  }
  await grimoireBuild();
  await zolaBuild();
  await generateCacheList();
  console.log(
    chalk.cyan(`Full build complete [${new Date().toLocaleTimeString()}]`)
  );
}

async function handleChange(filePath) {
  console.log(chalk.yellow(`File changed: ${filePath}`));
  try {
    if (filePath.startsWith(SRC_JS)) {
      const dir = path.basename(path.dirname(filePath));
      await compressJS(dir);
    } else {
      await grimoireBuild();
    }
    console.log(
      chalk.cyan(`Rebuild complete [${new Date().toLocaleTimeString()}]`)
    );
  } catch (error) {
    console.error(chalk.red(`Error handling change for ${filePath}`, error));
  }
}

function startWatcher() {
  const watcher = chokidar.watch([SRC_JS, TEMPLATES, CONTENT], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  console.log(chalk.magenta("Watching for JavaScript and Grimoire changes..."));

  watcher
    .on("change", handleChange)
    .on("error", (error) =>
      console.error(chalk.red(`Watcher error: ${error}`))
    );
}

program
  .command("dev")
  .description("Run the development watcher")
  .action(() => {
    startWatcher();
  });

program
  .command("build")
  .description("Build the entire project")
  .action(async () => {
    await buildAll();
  });

program
  .command("buildGrimoire")
  .description("Build only Grimoire CSS")
  .action(async () => {
    await grimoireBuild();
  });

program
  .command("buildJS")
  .description("Build only JavaScript")
  .action(async () => {
    const dirs = getDirectories(SRC_JS);
    for (const dir of dirs) {
      await compressJS(dir);
    }
  });

program
  .command("buildZola")
  .description("Build only Zola")
  .action(async () => {
    await zolaBuild();
    await generateCacheList();
  });

program.parse(process.argv);
