import yaml from "js-yaml";


export function loadYml(content) {
    return yaml.load(content);
}