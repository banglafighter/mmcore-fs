import chalk from "chalk";

export function logError(...data) {
    console.error(
        chalk.red.bold(...data)
    )
}

export function log(...data) {
    console.log(...data)
}