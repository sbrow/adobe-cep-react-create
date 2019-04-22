const path = require("path");
const root = __dirname;
const srcFolder = path.join(root, "src");
const destFolder = path.join(root, "dist");
const certPath = path.join(destFolder, "cert.p12");
const package = require("./package.json");

module.exports = {
    cepVersion: "7.0",
    extensionBundleId: `com.${package.name}`,
    extensionBundleName: package.name,
    extensionBundleVersion: package.version,
    panelName: package.name,
    width: "400",
    height: "600",
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate: {
        customCert: {
            path: "",
            password: "password",
        },
        selfSign: {
            country: "US",
            province: "CA",
            org: "org",
            name: "name",
            password: "password",
            locality: "locality",
            orgUnit: "orgUnit",
            email: "your@email.com",
            output: certPath,
        },
    },
};
