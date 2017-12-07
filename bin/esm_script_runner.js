require = require("@std/esm")(module, true);
console.log(`Running script: ${process.env.SCRIPT_NAME} . . .`);
module.exports = (async () => {
    try {
        let main = require(`./${process.env.SCRIPT_NAME}`);
        await main.run();
    } catch (e) {
        console.log(e);
    }
})();
