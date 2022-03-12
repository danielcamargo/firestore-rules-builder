const fs = require("fs");
const path = require('path');

const defaultConfig = {
    rulesVersion: 2,
    rulesFolder: "rules",
    output: "firestore.rules",
};

function buildConfig() {
    const currentWorkingDirectory = process.cwd();
    const resultingConfig = defaultConfig;
    const firebaseConfigPath = `${currentWorkingDirectory}/firebase.json`;
    if (fs.existsSync(firebaseConfigPath)) {
        const firebaseConfigRaw = fs.readFileSync(firebaseConfigPath).toString();
        const firebaseConfig = JSON.parse(firebaseConfigRaw);
        const {firestore} = firebaseConfig;
        if (firestore && firestore.rules) {
            resultingConfig.output = firestore.rules;
        }
    }

    resultingConfig.rulesFolder = path.join(currentWorkingDirectory, defaultConfig.rulesFolder);

    return resultingConfig;
}

module.exports = buildConfig;
