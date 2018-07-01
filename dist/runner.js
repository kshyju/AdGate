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
const AzureSqlFormatter_1 = require("./resultformatter/AzureSqlFormatter");
const MSSql_1 = require("./resultformatter/MSSql");
const debug = new debug_1.Debug();
let imageRule = new image_1.ImageRule();
const formatter = new AzureSqlFormatter_1.AzureSqlFormatter();
const mssql = new MSSql_1.MSSql();
class Runner {
    runRules(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const puppeteer = require("puppeteer");
            console.log("URL:" + url);
            // let url = "http://brokenlinks.azurewebsites.net/Home/Ads/";
            const browser = yield puppeteer.launch({ headless: false });
            const page = yield browser.newPage();
            yield page.goto(url);
            yield page.waitFor(1000);
            // to do : Get all registed rules here
            var validationResult = yield imageRule.validate(page);
            yield browser.close();
            var resultId = yield mssql.publish(url, validationResult);
            return resultId;
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map