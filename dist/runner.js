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
const image_1 = require("./rules/image");
const debug_1 = require("./debug");
const debug = new debug_1.Debug();
let imageRule = new image_1.ImageRule();
class Runner {
    runRules() {
        return __awaiter(this, void 0, void 0, function* () {
            debug.log("Runner runRules");
            const puppeteer = require("puppeteer");
            (() => __awaiter(this, void 0, void 0, function* () {
                const browser = yield puppeteer.launch({ headless: false });
                const page = yield browser.newPage();
                page.once('load', () => debug.log('Page loaded!'));
                //run rules?
                const handleRequestFinished = (request) => {
                    debug.log('handleRequestFinished');
                    console.log(request._resourceType);
                };
                page.on("requestfinished", handleRequestFinished);
                yield page.goto("https://news.ycombinator.com/");
                yield page.waitFor(3000);
                yield browser.close();
            }))();
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map