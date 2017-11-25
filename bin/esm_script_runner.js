require = require("@std/esm")(module, true);
console.log(`Running script: ${process.env.SCRIPT_NAME} . . .`);
module.exports = require(`./${process.env.SCRIPT_NAME}`);