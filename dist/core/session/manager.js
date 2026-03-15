import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
function isSession(obj) {
    return (typeof obj === 'object' && obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        Array.isArray(obj.messages));
}
const SESSIONS_DIR = '.pantion/sessions';
function getSessionsDir(projectPath) {
    const dir = resolve(projectPath, SESSIONS_DIR);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    return dir;
}
function sessionPath(projectPath, id) {
    return resolve(getSessionsDir(projectPath), `${id}.json`);
}
function generateId() {
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.random().toString(36).slice(2, 8);
    return `${date}-${rand}`;
}
export function createSession(projectPath, name, systemPrompt) {
    const now = new Date().toISOString();
    const session = {
        id: generateId(),
        name,
        status: 'active',
        messages: [],
        systemPrompt,
        createdAt: now,
        updatedAt: now,
    };
    saveSession(projectPath, session);
    return session;
}
export function saveSession(projectPath, session) {
    session.updatedAt = new Date().toISOString();
    const path = sessionPath(projectPath, session.id);
    writeFileSync(path, JSON.stringify(session, null, 2), 'utf-8');
}
export function loadSession(projectPath, id) {
    const path = sessionPath(projectPath, id);
    if (!existsSync(path))
        return null;
    try {
        const data = JSON.parse(readFileSync(path, 'utf-8'));
        return isSession(data) ? data : null;
    }
    catch {
        return null;
    }
}
export function listSessions(projectPath) {
    const dir = getSessionsDir(projectPath);
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    const metas = [];
    for (const file of files) {
        try {
            const data = JSON.parse(readFileSync(resolve(dir, file), 'utf-8'));
            if (!isSession(data))
                continue;
            const session = data;
            metas.push({
                id: session.id,
                name: session.name,
                status: session.status,
                dialog: session.dialog,
                soul: session.soul,
                updatedAt: session.updatedAt,
                canonName: session.canonName,
                messageCount: session.messages.length,
                canonType: session.canonType,
                targetDialogName: session.targetDialogName,
            });
        }
        catch {
            // skip corrupt files
        }
    }
    return metas.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function getLastSession(projectPath) {
    const metas = listSessions(projectPath);
    if (metas.length === 0)
        return null;
    return loadSession(projectPath, metas[0].id);
}
export function findSessionByName(projectPath, name) {
    const metas = listSessions(projectPath);
    const match = metas.find((m) => m.name === name || m.canonName === name || m.id === name);
    if (!match)
        return null;
    return loadSession(projectPath, match.id);
}
export function addMessage(session, message) {
    session.messages.push(message);
}
export function updateStatus(session, status) {
    session.status = status;
}
//# sourceMappingURL=manager.js.map