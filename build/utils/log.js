const chalk = require('chalk');

function success(msg) {
    if (Array.isArray(msg)) {
        msg.forEach(msgItem => {
            console.log(chalk.green(msgItem));
        })
    } else {
        if (typeof msg === 'object') {
            console.log(chalk.green(JSON.stringify(msg)));
        } else {
            console.log(chalk.green(msg));
        }
    }
}

function error(msg) {
    console.log(chalk.red(msg));
}

function warn(msg) {
    console.log(chalk.yellow(msg));
}

function info(msg) {
    console.log(msg);
}

module.exports = {
    success,
    error,
    warn,
    info,
}