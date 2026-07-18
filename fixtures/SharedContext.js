class SharedContext {
    constructor() {
        this.context = new Map();
    }
    set(key, value) {
        this.context.set(key, value);
    }
    get(key) {
        return this.context.get(key);
    }
    has(key) {
        return this.context.has(key);
    }
    remove(key) {
        this.context.delete(key);
    }
    clear() {
        this.context.clear();
    }
}
module.exports = SharedContext;