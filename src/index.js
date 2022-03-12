const buildConfig = require('./utils/config.utils');
const {buildRulesFile, buildTemplate, registerRuleFiles} = require('./utils/rules.utils');

const config = buildConfig();
registerRuleFiles(config);
const template = buildTemplate();

buildRulesFile(template, config);
