import { execSync } from 'node:child_process';
export function checkNodeVersion() {
    try {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0], 10);
        if (major >= 20) {
            return { name: 'Node.js', passed: true, version, message: `Node.js ${version} (>= 20 required)` };
        }
        return { name: 'Node.js', passed: false, version, message: `Node.js ${version} found, but >= 20 required` };
    }
    catch {
        return { name: 'Node.js', passed: false, message: 'Node.js not found' };
    }
}
export function checkNpx() {
    try {
        const output = execSync('npx --version', { encoding: 'utf-8', timeout: 10000 }).trim();
        return { name: 'npx', passed: true, version: output, message: `npx ${output}` };
    }
    catch {
        return { name: 'npx', passed: false, message: 'npx not found — install Node.js >= 20' };
    }
}
export function checkAllPrereqs() {
    return [checkNodeVersion(), checkNpx()];
}
//# sourceMappingURL=prereqs.js.map