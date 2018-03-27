const path = require('path');
const moduleAlias = require('module-alias');

const registerModuleAliases = (dirname, tsConfig) => {
    let {compilerOptions: {paths}} = tsConfig;
    Object.keys(paths).forEach((alias) => {
        paths[alias].forEach((targetPath) => {
            if (alias !== "*") {

                const formattedPath = targetPath.slice(0, -2);
                const pathAlias = path.resolve(dirname, formattedPath);
                moduleAlias.addAlias(alias.slice(0, -2), pathAlias);
            }
        });
    });
};

module.exports = {
    registerModuleAliases
};
