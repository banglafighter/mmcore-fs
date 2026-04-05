export function getRepoNameFromUrl(url) {
    return url.split("/").pop().replace(".git", "");
}