require = require("@std/esm")(module, true);
const scriptName = process.env.SCRIPT_NAME;
console.log(`Running script: ${scriptName} . . .`);
module.exports = (async () => {
    try {
        let main = require(`./${scriptName}`);
        await main.run();
    } catch (e) {
        console.error(`Exception running script: ${scriptName}, ${e.toString()}`);
    }
})();
