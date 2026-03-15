import { createRequire } from 'node:module';
import { success } from '../utils/response.js';
const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');
export function registerVersion(server, _context) {
    server.tool('pantion_version', 'Show the installed Pantion version.', {}, async () => {
        return success({
            version: packageJson.version,
            package: '@pantion/dialogs',
        });
    });
}
//# sourceMappingURL=version.js.map