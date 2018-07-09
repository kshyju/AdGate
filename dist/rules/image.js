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
const RuleResult_1 = require("../types/RuleResult");
const Recommendation_1 = require("../types/Recommendation");
const debug = new debug_1.Debug();
class ImageRule {
    constructor() {
        this.ruleName = "ImageRule";
        this.ruleResult = new RuleResult_1.RuleResult([]);
    }
    validate(page) {
        return __awaiter(this, void 0, void 0, function* () {
            debug.log("Inside ImageRule.validate");
            let validationFailures = yield page.evaluate(() => {
                function getImageUrl(s) {
                    //could be in bg
                    var background = s.getPropertyValue("background-image");
                    if (background === "none") {
                        return null;
                    }
                    var imageUrl = background
                        .replace(/url\((['"])?(.*?)\1\)/gi, "$2")
                        .split(",")[0];
                    if (!imageUrl) {
                        return null;
                    }
                    return imageUrl;
                }
                function getDimensionForImage(element) {
                    let s = getComputedStyle(element);
                    if (element.tagName === "IMG") {
                        let computedHeightStr = s.getPropertyValue("height");
                        let computedWidthStr = s.getPropertyValue("width");
                        let p = {
                            url: element.src,
                            naturalWidth: element.naturalWidth,
                            naturalHeight: element.naturalHeight,
                            computedWidth: +computedWidthStr.replace("px", ""),
                            computedHeight: +computedHeightStr.replace("px", "")
                        };
                        return p;
                    }
                    return null;
                }
                // Return a promise which will be resolved when the image is "loaded"
                function loadImgPromise(imageSrc, computedHeight, computedWidth) {
                    return new Promise(function (resolve, reject) {
                        const img = new Image();
                        img.src = imageSrc;
                        img.onload = function () {
                            //console.log('image loaded.'+imageSrc);
                            resolve({
                                url: imageSrc,
                                computedWidth: computedWidth,
                                computedHeight: computedHeight,
                                naturalWidth: img.naturalWidth,
                                naturalHeight: img.naturalHeight
                            });
                        };
                        img.onerror = function (e) {
                            reject(e);
                        };
                    });
                }
                function processNonImageElements(elements, results) {
                    return new Promise((resolve, reject) => {
                        // debug.debug(`processing ${elements.length} non image elements`);
                        var promiseArray = [];
                        for (var i = 0; i < elements.length; i++) {
                            let element = elements[i];
                            let s = getComputedStyle(element);
                            var imageUrl = getImageUrl(s);
                            if (imageUrl != null) {
                                let computedHeightStr = s.getPropertyValue("height");
                                let computedWidthStr = s.getPropertyValue("width");
                                var computedWidth = +computedWidthStr.replace("px", "");
                                var computedHeight = +computedHeightStr.replace("px", "");
                                promiseArray.push(loadImgPromise(imageUrl, computedHeight, computedWidth));
                            }
                        }
                        Promise.all(promiseArray).then(function (items) {
                            //debug.debug(`${items.length} images loaded for analysis`);
                            items.forEach(function (item) {
                                validateDimension(item, results);
                            });
                            resolve(results);
                        });
                    });
                }
                function validateDimension(p, results) {
                    if (p != null) {
                        if (p.computedHeight < p.naturalHeight ||
                            p.computedWidth < p.naturalWidth) {
                            var validationFailure = {
                                naturalWidth: p.naturalWidth,
                                naturalHeight: p.naturalHeight,
                                computedWidth: p.computedWidth,
                                computedHeight: p.computedHeight,
                                url: p.url
                            };
                            results.push(validationFailure);
                        }
                    }
                }
                return new Promise((resolve, reject) => {
                    var results = [];
                    let imgElements = document.querySelectorAll("img");
                    //debug.debug(`Processing ${imgElements.length} image elements`);
                    for (var element of imgElements) {
                        let p = getDimensionForImage(element);
                        validateDimension(p, results);
                    }
                    //to do : This 2 (img, and non image)has to be inside Promise.all
                    let nonImgElementsToLoad = document.querySelectorAll("div");
                    processNonImageElements(nonImgElementsToLoad, results).then(function (a) {
                        //debug.debug("Non image elements validated");
                        resolve(results);
                    });
                });
            });
            //Scaled Image Recommendation
            let status = 1;
            if (validationFailures > 1) {
                status = 3;
            }
            var scaledImageRecommendation = new Recommendation_1.Recommendation("scaled-images", status);
            var imageRuleResult = new RuleResult_1.RuleResult([]);
            imageRuleResult.recommendations.push(scaledImageRecommendation);
            return imageRuleResult;
        });
    }
}
exports.ImageRule = ImageRule;
//# sourceMappingURL=image.js.map