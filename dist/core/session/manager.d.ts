import type { Session, SessionMeta, SessionStatus, Message } from '../types.js';
export declare function createSession(projectPath: string, name: string, systemPrompt: string): Session;
export declare function saveSession(projectPath: string, session: Session): void;
export declare function loadSession(projectPath: string, id: string): Session | null;
export declare function listSessions(projectPath: string): SessionMeta[];
export declare function getLastSession(projectPath: string): Session | null;
export declare function findSessionByName(projectPath: string, name: string): Session | null;
export declare function addMessage(session: Session, message: Message): void;
export declare function updateStatus(session: Session, status: SessionStatus): void;
//# sourceMappingURL=manager.d.ts.map