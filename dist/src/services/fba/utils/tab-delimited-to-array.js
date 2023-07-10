"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabDelimitedToArray = void 0;
const lodash_1 = __importDefault(require("lodash"));
const papaparse_1 = __importDefault(require("papaparse"));
const log_error_1 = require("../../../error/log-error");
async function tabDelimitedToArray(tabDelimitedBuffer) {
    return await new Promise((resolve, reject) => {
        const doc = tabDelimitedBuffer.toString("utf-8");
        papaparse_1.default.parse(doc, {
            header: true,
            transformHeader: (header) => lodash_1.default.camelCase(header.trim()),
            transform: (value) => (value === "" ? null : value),
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    log_error_1.rollbar.error("Error parsing", results.errors);
                    reject(new Error(JSON.stringify(results.errors)));
                }
                resolve(results.data);
            },
        });
    });
}
exports.tabDelimitedToArray = tabDelimitedToArray;
//# sourceMappingURL=tab-delimited-to-array.js.map