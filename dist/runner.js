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
const Result_1 = require("./types/Result");
const Cosmos_1 = require("./resultformatter/Cosmos");
const requests_1 = require("./rules/requests");
const Console_1 = require("./rules/Console");
const errors_1 = require("./rules/errors");
const debug = new debug_1.Debug();
const imageRule = new image_1.ImageRule();
const requestRule = new requests_1.Requests();
const consoleRule = new Console_1.Console();
const errorRule = new errors_1.Errors();
var cosmos = new Cosmos_1.Cosmos();
class Runner {
    runRules(url, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            debug.log(`Analyzing URL:${url}`);
            const puppeteer = require("puppeteer");
            const browser = yield puppeteer.launch({ headless: false });
            const page = yield browser.newPage();
            //await page.setRequestInterception(true);
            //Register the rules
            consoleRule.listen(page);
            requestRule.listen(page);
            errorRule.listen(page);
            yield page.goto(url);
            if (delay > 0) {
                yield page.waitFor(delay * 1000);
            }
            const errorEntries = errorRule.results();
            const consoleEntries = consoleRule.results();
            const requestEntries = requestRule.results();
            // to do
            // 1. Get DOMContentLoaded time
            // 2. MB transferred
            // 3. Load time ?
            return imageRule
                .validate(page)
                .then(function (validationResults) {
                return __awaiter(this, void 0, void 0, function* () {
                    const d = {
                        id: "",
                        url: url,
                        delay: delay,
                        result: {
                            image: validationResults,
                            consoleEntries: consoleEntries,
                            requestEntries: requestEntries,
                            errorEntries: errorEntries
                        },
                        issueCount: (validationResults.length + consoleEntries.length + requestEntries.length + errorEntries.length)
                    };
                    yield browser.close();
                    return cosmos.create(d).then(function (document) {
                        return new Result_1.Result(document.id, d.issueCount);
                    });
                });
            })
                .catch(reason => {
                console.log("onRejected function called: " + reason);
                return null;
            });
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map