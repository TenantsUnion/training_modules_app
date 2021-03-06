module.exports = {
    express: {
        secret: "1212lkasf23sksdf"
    },
    webapp: {
        port: 3000
    },
    database: {
        db_user: "tu_dev_db_user",
        db_password: "development_only",
        db_host: "127.0.0.1",
        db_port: 5432,
        db: "test_tu_training",
        schemaVersion: "test_tu_schema_version"
    },
    log: {
        level: "warning",
        useConfigLevel: true,
        fileLogging: false
    },
    e2e: {
        port: 3000
    }
};
