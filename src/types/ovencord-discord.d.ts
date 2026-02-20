/**
 * Minimal type stub for @ovencord/discord.js.
 * Prevents TypeScript from following into node_modules source files.
 */
declare module "@ovencord/discord.js" {
    export class Client {
        _eval?(script: string): any;
        emit?(event: string | symbol, ...args: any[]): boolean;
        guilds: any;
        [key: string]: any;
    }

    export const Events: {
        ERROR: string;
        [key: string]: string;
    };
}
