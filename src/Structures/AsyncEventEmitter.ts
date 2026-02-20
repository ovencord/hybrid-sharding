/**
 * Minimal, pure-TypeScript EventEmitter replacement.
 * Drop-in replacement for Node's EventEmitter — zero dependencies.
 */
export class AsyncEventEmitter {
    private _listeners = new Map<string | symbol, Set<(...args: any[]) => void>>();

    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event)!.add(listener);
        return this;
    }

    public once(event: string | symbol, listener: (...args: any[]) => void): this {
        const wrapper = (...args: any[]) => {
            this.off(event, wrapper);
            listener.apply(this, args);
        };
        // Store ref so `.off(event, originalListener)` can still work if needed
        (wrapper as any)._original = listener;
        return this.on(event, wrapper);
    }

    public off(event: string | symbol, listener: (...args: any[]) => void): this {
        const set = this._listeners.get(event);
        if (!set) return this;

        // Direct match
        if (set.has(listener)) {
            set.delete(listener);
        } else {
            // Check `once` wrappers
            for (const fn of set) {
                if ((fn as any)._original === listener) {
                    set.delete(fn);
                    break;
                }
            }
        }

        if (set.size === 0) this._listeners.delete(event);
        return this;
    }

    public emit(event: string | symbol, ...args: any[]): boolean {
        const set = this._listeners.get(event);
        if (!set || set.size === 0) return false;

        for (const listener of [...set]) {
            listener.apply(this, args);
        }
        return true;
    }

    public removeAllListeners(event?: string | symbol): this {
        if (event !== undefined) {
            this._listeners.delete(event);
        } else {
            this._listeners.clear();
        }
        return this;
    }

    public listenerCount(event: string | symbol): number {
        return this._listeners.get(event)?.size ?? 0;
    }
}
