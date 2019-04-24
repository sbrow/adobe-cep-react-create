import { execSync } from "child_process";
import * as path from "path";
import { destinationFolder, extensionBundleId } from "../pluginrc";
// const path = require('path')

// const root = path.dirname(__dirname);
const root = "./";
const srcDir = path.join(root, "src");

console.log("Syncing tslint.json files...");
execSync(`echo ./src/client ./src/host ./src/session | xargs -n 1 cp ./tslint.json`);

const srcTypes = path.join(srcDir, "host", "types");
const extendScript = path.join(srcTypes, "ExtendScript.d.ts");
const premierePro = path.join(srcTypes, "PremierePro.11.1.2.d.ts");
console.log("Syncing type def files...");
execSync(`cp ${extendScript} ${path.join(srcDir, "client", "types")}`);
execSync(`cp ${premierePro} ${path.join(srcDir, "client", "types")}`);

const key = "compilerOptions.outDir";
const value = path.join(destinationFolder, extensionBundleId, "host");
const file = path.join(srcDir, "host", "tsconfig.json");
console.log(`Setting "${key}" in ${file}`);
execSync(`json -I -f ${file} -e 'this.${key}="${value}"'`);
