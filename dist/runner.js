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
const MSSql_1 = require("./resultformatter/MSSql");
const Result_1 = require("./types/Result");
const PerfTiming_1 = require("./types/PerfTiming");
const Cosmos_1 = require("./resultformatter/Cosmos");
const { PerformanceObserver, performance } = require("perf_hooks");
const debug = new debug_1.Debug();
const imageRule = new image_1.ImageRule();
const mssql = new MSSql_1.MSSql();
var cosmos = new Cosmos_1.Cosmos();
class Runner {
    runRules(url, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            const puppeteer = require("puppeteer");
            debug.log("URL:" + url);
            const browser = yield puppeteer.launch({ headless: false });
            const page = yield browser.newPage();
            page.on("console", function (msg) {
                console.log(msg.text());
            });
            yield page.goto(url);
            if (delay > 0) {
                yield page.waitFor(1000);
            }
            performance.mark("imageRuleStart");
            return imageRule
                .validate(page)
                .then(function (validationResults) {
                return __awaiter(this, void 0, void 0, function* () {
                    performance.mark("imageRuleEnd");
                    performance.measure("imageValidation", "imageRuleStart", "imageRuleEnd");
                    const marks = performance.getEntriesByType("measure");
                    performance.clearMarks();
                    const d = {
                        id: "",
                        url: url,
                        result: {
                            image: validationResults
                        },
                        resultCount: validationResults.length,
                        perfTimings: marks.map(function (measure) {
                            var p = new PerfTiming_1.PerfTiming();
                            p[measure.name] = measure.duration;
                            return p;
                        })
                    };
                    yield browser.close();
                    return cosmos.create(d).then(function (document) {
                        return new Result_1.Result(document.id, d.resultCount);
                    });
                    //await mssql.publish(requestId, validationResult);
                });
            })
                .catch(reason => {
                console.error("onRejected function called: " + reason);
                return null;
            });
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map