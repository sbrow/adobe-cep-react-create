
/**
 * a minimalist non fancy build script
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const utils = require("./utils.js");
const webpack = require("webpack");
const pluginConfig = require("../pluginrc.js");
var env = (process.env.npm_config_production !== undefined && process.env.npm_config_production.match(/1|true/)) ? "production" : "development";
const isDev = env === "development";
const distDir = pluginConfig.destinationFolder;
const pluginDir = path.join(distDir, pluginConfig.extensionBundleId);
const srcDir = pluginConfig.sourceFolder;
const rootDir = pluginConfig.root;
const templatesFolder = path.join(fromRoot("assets"), "templates");
const webpack_client_config_path = path.join(srcDir, "client", "webpack.config.js");
const webpack_session_config_path = path.join(srcDir, "session", "webpack.config.js");
utils.log_progress(`BUILD for ${env}`, "blue");

build();

function build() {
    try {
        utils.log_progress("creating dist folder...");
        fs.mkdirSync(distDir);
        fs.mkdirSync(pluginDir);

        utils.log_progress("bundling client...");
        execSync(`webpack --config ${webpack_client_config_path} --display normal --display-chunks --env.target=node --mode ${env}`, { stdio: [0, 1, 2] });

        utils.log_progress("bundeling session...");
        execSync(`webpack --config ${webpack_session_config_path} --display normal --display-chunks --env.target=node --mode ${env}`, { stdio: [0, 1, 2] });

        utils.log_progress("transpiling host code...");
        execSync("tsc -p ./src/host/tsconfig.json", { stdio: [0, 1, 2] });
        // utils.copyRecursiveSync(fromSrc('host/out'), fromPlugin('host'))
        // copy the session's node modules folder
        utils.log_progress("copying session node-modules...");
        utils.copyRecursiveSync(fromSrc("session/node_modules"), fromPlugin("node_modules"));
        // copying libs folder
        utils.log_progress("copying libs folder...");
        utils.copyRecursiveSync(fromSrc("libs"), fromPlugin("libs"));
        // copy the index.html
        // fs.createReadStream('./src/index.html').pipe(fs.createWriteStream('./dist/index.html'));
        utils.log_progress("copying index.html...");
        utils.copyRecursiveSync(fromSrc("index.html"), fromPlugin("index.html"));
        // copy other assets
        utils.log_progress("copying Adobe assets...");
        utils.copyRecursiveSync(fromRoot("assets"), pluginDir, ["templates"]);
        // render manifest.xml
        utils.log_progress("rendering manifest.xml ...");
        var manifest_template = require(path.join(templatesFolder, "manifest.template.xml.js"));
        var rendered_xml = manifest_template(pluginConfig);
        var xml_out_file = path.join(pluginDir, "CSXS", "manifest.xml");
        fs.mkdirSync(path.dirname(xml_out_file));
        fs.writeFileSync(xml_out_file, rendered_xml, "utf-8");

        // in dev, also render the .debug file template
        if (isDev) {
            // render .debug file
            utils.log_progress("rendering .debug file ...");
            var debug_template = require(path.join(templatesFolder, ".debug.template.js"));
            var rendered_debug = debug_template(pluginConfig);
            var debug_out_file = path.join(pluginDir, ".debug");
            fs.writeFileSync(debug_out_file, rendered_debug, "utf-8");
        }

        utils.log_progress("DONE", "blue");
    } catch (err) {
        utils.log_progress(err, "red");
    }
}

function fromDist(val) {
    return path.join(distDir, val);
}

function fromPlugin(val) {
    return path.join(pluginDir, val);
}

function fromSrc(val) {
    return path.join(srcDir, val);
}

function fromRoot(val) {
    return path.join(rootDir, val);
}
