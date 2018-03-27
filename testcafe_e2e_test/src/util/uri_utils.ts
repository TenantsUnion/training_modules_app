const config = require("config");

export const landingPage = `localhost:${config.get('e2e.port')}`;
