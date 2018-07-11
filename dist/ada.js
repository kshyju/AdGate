"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./debug");
const runner_1 = require("./runner");
const debug = new debug_1.Debug();
const runner = new runner_1.Runner();
const run = function () {
    return __awaiter(this, void 0, void 0, function* () {
        debug.log("Inside ada");
        const args = process.argv.slice(2);
        const url = args[0];
        debug.log('Processing url:' + url);
        yield runner.runRules(url, 1, true);
    });
};
run();
// $ npm run adas
//# sourceMappingURL=ada.js.map