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
const debug_1 = require("../debug");
const debug = new debug_1.Debug();
class ImageRule {
    constructor() {
        this.ruleName = "ImageRule";
    }
    validate(page) {
        return __awaiter(this, void 0, void 0, function* () {
            debug.log("image rule-validate");
            let texts = yield page.evaluate(() => {
                let results = [];
                let elements = document.getElementsByTagName("img");
                for (var element of elements) {
                    // to do : refactor
                    let s = getComputedStyle(element);
                    let computedHeightStr = s.getPropertyValue("height");
                    let computedWidthStr = s.getPropertyValue("width");
                    let computedWidth = +computedWidthStr.replace("px", "");
                    let computedHeight = +computedHeightStr.replace("px", "");
                    let p = {
                        naturalWidth: element.naturalWidth,
                        naturalHeight: element.naturalHeight,
                        computedHeight: computedHeight,
                        computedWidth: computedWidth
                    };
                    if (p.computedHeight < p.naturalHeight ||
                        p.computedWidth < p.naturalWidth) {
                        var validationFailure = {
                            ruleName: this.ruleName,
                            msg: "Scaled down images found",
                            src: element.src
                        };
                        results.push(validationFailure);
                    }
                }
                return results;
            });
            return new Promise((resolve, reject) => {
                return resolve(texts);
            });
        });
    }
}
exports.ImageRule = ImageRule;
//# sourceMappingURL=image.js.map