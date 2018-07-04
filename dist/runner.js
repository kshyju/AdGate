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
const imageRule = new image_1.ImageRule();
/* const mssql = new MSSql();
 */ class Runner {
    runRules(url, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            const puppeteer = require("puppeteer");
            debug.log("URL:" + url);
            const browser = yield puppeteer.launch({ headless: false });
            const page = yield browser.newPage();
            page.on('console', function (msg) { console.log(msg.text()); });
            yield page.goto(url);
            if (delay > 0) {
                yield page.waitFor(1000);
            }
            /*     var requestId = await mssql.saveRequest(url);
             */ // to do : Get all registed rules here
            //  var validationResult:ValidationResult[] = await imageRule.validate(page);
            var a = yield imageRule.validate(page);
            //Promise.all([a]).then(function(ad){
            // console.log(ad);
            //console.log('ValidationResults1:',ad);
            //});
            //await browser.close();
            /*     await mssql.publish(requestId, validationResult);
             */ return 1; //requestId;
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map