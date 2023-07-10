"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbar = void 0;
const rollbar_1 = __importDefault(require("rollbar"));
exports.rollbar = new rollbar_1.default({
    accessToken: "5362515d503c4bea9ef92fd528d54fb2",
    captureUncaught: true,
    environment: process.env.NODE_ENV,
    captureUnhandledRejections: true,
    verbose: true,
});
function logError(err, _req, _res, next) {
    exports.rollbar.info(err);
    next(err);
}
exports.default = logError;
//# sourceMappingURL=log-error.js.map