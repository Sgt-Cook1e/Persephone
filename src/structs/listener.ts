import { ClientEvents } from "oceanic.js";
import { Yuui } from "./Yuui";

export default class Listener<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once?: boolean | undefined;
    listener: (this: Yuui, ...args: ClientEvents[K]) => void;
    constructor(name: K, once: boolean | undefined = undefined, listener: (this: Yuui, ...args: ClientEvents[K]) => void) {
        this.name = name,
        this.once = once,
        this.listener = listener;
    }
}