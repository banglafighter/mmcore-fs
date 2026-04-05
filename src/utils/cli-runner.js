import { execSync } from "child_process";

export function runCommand(command, cwd = process.cwd(), options = {}) {
    try {
        let _options = {stdio: "inherit", cwd, ...options}
        execSync(command, _options);
        return true
    } catch (e) {
        console.error(`Run command failed: ${command} ${e}`);
        return false
    }
}
