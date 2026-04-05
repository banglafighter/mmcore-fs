import fs from "fs";
import path from "path";

export function makeDir(location) {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, {recursive: true});
    }
}

export function isItGitRepo(location) {
    return fs.existsSync(path.join(location, ".git"));
}

export function fileExist(location){
    return fs.existsSync(location);
}

export function readFileContent(location) {
    if (!fileExist(location)) {
        throw new Error("File does not exist: " + location);
    }
    return fs.readFileSync(location, "utf8")
}

export function joinPath(...paths) {
    return path.join(...paths)
}

export function getCommandRoot() {
    return process.env.INIT_CWD
}