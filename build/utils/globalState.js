"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalState {
    constructor() {
        this.state = {};
    }
    static getInstance() {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState();
        }
        return GlobalState.instance;
    }
    setState(key, value) {
        this.state[key] = value;
    }
    getState(key) {
        return this.state[key];
    }
    getAllState() {
        return this.state;
    }
}
exports.default = GlobalState.getInstance();
