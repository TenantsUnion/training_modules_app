const testConfig = require('./test');
module.exports = {
    ...testConfig,
    webapp: {
        ...testConfig.webapp,
        port: 8080
    }
};