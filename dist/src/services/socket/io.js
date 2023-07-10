"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.redisClient = void 0;
const redis_emitter_1 = require("@socket.io/redis-emitter");
const redis_1 = require("redis");
const log_error_1 = require("src/error/log-error");
exports.redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "17516"),
    },
});
exports.redisClient.on("error", (error) => {
    log_error_1.rollbar.error("REDIS ERROR", error);
});
exports.io = new redis_emitter_1.Emitter(exports.redisClient);
//# sourceMappingURL=io.js.map