import { execSync } from "child_process";
import * as path from "path";
import { destinationFolder, extensionBundleId } from "../pluginrc";
// const path = require('path')

// const root = path.dirname(__dirname);
const root = "./";
const srcDir = path.join(root, "src");

console.log("Syncing tslint.json files...");
execSync(`echo ./src/client ./src/host ./src/session | xargs -n 1 cp ./tslint.json`);

const key = "compilerOptions.outDir";
const value = path.join(destinationFolder, extensionBundleId, "host");
const file = path.join(srcDir, "host", "tsconfig.json");
console.log(`Setting "${key}" in ${file}`);
execSync(`json -I -f ${file} -e 'this.${key}="${value}"'`);
