import yaml from "js-yaml";
import {readFileContent} from "./file-system.js";


export function loadYml(content, error = "YML content is empty!") {
    if (!content) {
        throw new Error(error);
    }
    return yaml.load(content);
}

export function loadYmlFromFile(location, error = "YML file not found!") {
    const ymlContent = readFileContent(location, error)
    return loadYml(ymlContent)
}