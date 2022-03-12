const fs = require("fs");
const path = require('path');
const handlebars = require("handlebars");

function buildTemplate(config) {
    const currentWorkingDirectory = process.cwd();
    const templatePath = path.join(currentWorkingDirectory, 'firestore.rules.hbs');
    const fileBuffer = fs.readFileSync(templatePath);

    return handlebars.compile(fileBuffer.toString(), {
        preventIndent: false,
    });
}

function _cleanRuleFile(buffer) {
    const raw = buffer.toString();
    const lines = raw.split(`\n`);

    let cleanLines = [];
    for (const line of lines) {
        if (/rules_version/s.exec(line)) continue;
        if (/cloud\.firestore/s.exec(line)) continue;
        if (/^}/s.exec(line)) continue;

        let cleanLine = line;
        // remove one indentation level
        cleanLine = cleanLine.replace(/^\s{4}/s, '');

        if (!cleanLine.length) continue;
        cleanLines.push(cleanLine);
    }
    const final = cleanLines.join('\n').concat(`\n`);
    console.log(final);
    return final;
}

function readdirRecursive(dir, subFolder = '', level = 0) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(readdirRecursive(filePath, file, level + 1));
            continue;
        }
        results.push(`${subFolder}${subFolder ? '/' : ''}${file}`);
    }
    return results;
}

function registerRuleFiles(config) {
    const rulesFolderFiles = readdirRecursive(config.rulesFolder);
    for (const fileName of rulesFolderFiles) {
        const fileBuffer = fs.readFileSync(path.join(config.rulesFolder, fileName));
        handlebars.registerPartial(fileName, _cleanRuleFile(fileBuffer));
        console.log("Registering partial", fileName);
    }
}

function buildRulesFile(template, config) {
    const raw = template({});
    fs.writeFileSync(config.output, raw);
}

module.exports = {
    buildTemplate, registerRuleFiles, buildRulesFile,
}
