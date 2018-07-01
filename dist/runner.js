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
            const puppeteer = require("puppeteer");
            (() => __awaiter(this, void 0, void 0, function* () {
                const browser = yield puppeteer.launch({ headless: false });
                const page = yield browser.newPage();
                yield page.goto("http://brokenlinks.azurewebsites.net/Home/Ads/");
                yield page.waitFor(1000); // Hopefully images are loaded by now
                // to do : Get all registed rules here
                var validationResult = yield imageRule.validate(page);
                console.log(validationResult);
                yield browser.close();
            }))();
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map