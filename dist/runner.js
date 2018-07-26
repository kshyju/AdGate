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
const perftiming_1 = require("./rules/perftiming");
const Dialog_1 = require("./rules/Dialog");
const pagemetrics_1 = require("./rules/pagemetrics");
const frames_1 = require("./rules/frames");
const debug = new debug_1.Debug();
const imageRule = new image_1.ImageRule();
const requestRule = new requests_1.Requests();
const consoleRule = new Console_1.Console();
//const errorRule = new Errors();
const perfTiming = new perftiming_1.PerfTiming();
const dialog = new Dialog_1.Dialog();
const pageMetrics = new pagemetrics_1.PageMetrics();
const frame = new frames_1.Frames();
var cosmos = new Cosmos_1.Cosmos();
class Runner {
    runRules(url, delay, includeMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            debug.log(`Analyzing URL:${url}`);
            const puppeteer = require("puppeteer");
            const browser = yield puppeteer.launch({ headless: true });
            const page = yield browser.newPage();
            /*    page.on("console", function(msg: any) {
              console.log(msg.text());
            }); */
            //await page.setRequestInterception(true);
            //Register the rules
            dialog.listen(page);
            consoleRule.listen(page);
            requestRule.listen(page);
            frame.listen(page);
            yield page.goto(url);
            if (delay > 0) {
                yield page.waitFor(delay * 1000);
            }
            let allRulesResults = [];
            // to do
            // 1. Get DOMContentLoaded time
            // 2. MB transferred
            // 3. Load time ?
            // 4. Extra images being downloaded, but not being used(visible ?)
            var promiseArray = new Array();
            promiseArray.push(consoleRule.results(includeMeta));
            promiseArray.push(dialog.results());
            // promiseArray.push(errorRule.results(includeMeta));
            promiseArray.push(imageRule.validate(page, includeMeta));
            promiseArray.push(requestRule.results(includeMeta));
            promiseArray.push(perfTiming.results(page, includeMeta));
            promiseArray.push(pageMetrics.results(page, includeMeta));
            promiseArray.push(frame.results(page, includeMeta));
            var result = Promise.all(promiseArray)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                yield browser.close();
                console.log('done');
                const d = {
                    id: "",
                    url: url,
                    delay: delay,
                    ruleResults: result
                };
                return cosmos.create(d).then(function (document) {
                    return new Result_1.Result(document.id, 0);
                });
            }))
                .catch((err) => {
                console.log(err);
                return new Result_1.Result("", 0);
            });
            return result;
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map