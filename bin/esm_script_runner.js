require = require("esm")(module, true);
const scriptName = process.env.SCRIPT_NAME;
console.log(`Running in env: ${process.env.NODE_ENV}`);
console.log(`Running script: ${scriptName} . . .`);
(async () => {
    try {
        let run = require(`./${scriptName}`);
        await run();
    } catch (e) {
        console.error(`Exception running script: ${scriptName}`);
        console.error(e);
    }
})();
