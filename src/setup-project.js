import {fileExist, getCommandRoot, isItGitRepo, joinPath, makeDir, readFileContent} from "./utils/file-system.js";
import {logError, log} from "./utils/mlogger.js";
import {loadYml} from "./utils/sdlize.js";
import {runCommand} from "./utils/cli-runner.js";
import {getRepoNameFromUrl} from "./utils/git-repo.js";

function getDescriptor() {
    try {
        const descriptorPath = joinPath(getCommandRoot(), "msm.yml")
        let ymlContent = readFileContent(descriptorPath);
        return loadYml(ymlContent);
    } catch (e) {
        logError("msm.yml not found. Please make sure you are running this command in the project root directory.");
        logError(e)
        process.exit(1);
    }
}

const descriptor = getDescriptor()
if (!descriptor) {
    logError("Descriptor not found");
    process.exit(1);
}

if (descriptor.startScript) {
    log("Running start script...");
    descriptor.startScript.forEach(cmd => runCommand(cmd, getCommandRoot()));
}

for (const dependency of descriptor.dependencies || []) {
    if (!dependency.status || dependency.status !== "active") {
        continue
    }

    log(`\nProcessing: ${dependency.name}`);
    if (!dependency.dir) {
        logError(`${dependency.name} dependency directory not found!`);
        continue
    }

    const baseDir = joinPath(getCommandRoot(), dependency.dir)
    makeDir(baseDir)

    const branch = dependency.clone?.branch || "main";
    for (const repo of dependency.clone?.repo || []) {
        let repoName = getRepoNameFromUrl(repo.url);
        if (repo.name) {
            repoName = repo.name
        }
        const targetDir = joinPath(baseDir, repoName);
        if (fileExist(targetDir) && isItGitRepo(targetDir)) {
            log(`Updating ${repoName}...`);
            runCommand(`git fetch`, targetDir);
            runCommand(`git checkout ${branch}`, targetDir);
            runCommand(`git pull origin ${branch}`, targetDir);
        } else {
            log(`Cloning ${repoName}...`);
            runCommand(`git clone -b ${branch} ${repo.url} ${targetDir}`);
        }
    }
}

if (descriptor.endScript) {
    log("\nRunning end script...");
    descriptor.endScript.forEach(cmd => runCommand(cmd, getCommandRoot()));
}

log("Finished")

