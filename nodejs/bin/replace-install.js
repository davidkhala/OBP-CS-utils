#!/usr/bin/env node
const os = require('os')
const platform = os.platform();
const childProcess = require('child_process')
const splitBySpace = (str) => {
    return str.trim().split(/\b\s+/);
};
const execStream = (command) => {
    const {spawn} = childProcess;
    const [cmd, ...args] = splitBySpace(command);
    return spawn(cmd, args, {stdio: 'inherit'});
};
switch (os.platform()){
    case "linux":
    case "darwin":
        execStream('./npm_bcs_client.sh')

        break;
    case "win32":
        execStream('npm_bcs_client_win.bat')
        break;
    default:
        console.error(`Platform ${platform} is unsupported`)
}

