const path = require('path');

module.exports = {
    server: {
        port: 3000,
    },
    webapp: {
        context: path.resolve(__dirname, "../webapp"),
        dist: path.resolve(__dirname, "../webapp/dist")
    },
    log: {
        fileLogging: true,
        directory: "logs",
        level: "info",
        useConfigLevel: false
    },
    database: {
        schemaVersion: "tu_schema_version"
    }
};
