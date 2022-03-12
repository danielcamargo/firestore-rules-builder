const fs = require("fs");

const defaultConfig = {
    rules_version: 2,
    rules_folder: "rules",
    rules_output: "firestore.rules",
};

function mergeConfig() {

}

async function buildConfig() {
    const currentWorkingDirectory = process.cwd();
    const resultingConfig = defaultConfig;
    const firebaseConfigPath = `${currentWorkingDirectory}/firebase.json`;
    if (fs.existsSync(firebaseConfigPath)) {
        const firebaseConfigRaw = fs.readFileSync(firebaseConfigPath).toString();
        const firebaseConfig = JSON.parse(firebaseConfigRaw);
        const {firestore} = firebaseConfig;
        if (firestore && firestore.rules) {
            resultingConfig.rules_output = firestore.rules;
        }
    }

    return resultingConfig;
}

module.exports = buildConfig;
