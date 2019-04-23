const path = require("path");
const root = __dirname;
const srcFolder = path.join(root, "src");
const destFolder = path.join(root, "dist");
const certPath = path.join(destFolder, "cert.p12");
const package = require("./package.json");

/**
 * Converts a string to title case.
 * @param {string} input
 */
function title(input) {
    return input.split(" ")
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ");
}

module.exports = {
    cepVersion: "7.0",
    extensionBundleId: `com.${package.name}`,
    extensionBundleName: package.name,
    extensionBundleVersion: package.version,
    panelName: title(package.name.replace("-", " ")),
    width: "400",
    height: "600",
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate: {
        selfSign: {
            country: "US",
            province: "NY",
            org: "org",
            name: "Spencer Brower",
            password: "password",
            locality: "Dryden",
            orgUnit: "orgUnit",
            email: "brower.spencer@gmail.com",
            output: certPath,
        },
    },
};
