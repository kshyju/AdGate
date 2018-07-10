import { Debug } from "../debug";
import { Result } from "../types/Result";
import { resolve } from "url";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";
const debug = new Debug();

export class ImageRule {
  ruleName: string = "ImageRule";
  ruleResult = new RuleResult([]);

  async validate(page: any, includeMeta:boolean): Promise<RuleResult> {

    let validationFailures = await page.evaluate(() => {
      function getImageUrl(s: any) {
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

      function getDimensionForImage(element: any): any {
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
      function loadImgPromise(
        imageSrc: string,
        computedHeight: number,
        computedWidth: number
      ) {
        return new Promise(function(resolve, reject) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = function() {
            //console.log('image loaded.'+imageSrc);
            resolve({
              url: imageSrc,
              computedWidth: computedWidth,
              computedHeight: computedHeight,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight
            });
          };
          img.onerror = function(e) {
            reject(e);
          };
        });
      }

      function processNonImageElements(elements: any, results: any): any {
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

              promiseArray.push(
                loadImgPromise(imageUrl, computedHeight, computedWidth)
              );
            }
          }

          Promise.all(promiseArray).then(function(items) {
            //debug.debug(`${items.length} images loaded for analysis`);

            items.forEach(function(item) {
              validateDimension(item, results);
            });
            resolve(results);
          });
        });
      }

      function validateDimension(p: any, results: any) {
        if (p != null) {
          if (
            p.computedHeight < p.naturalHeight ||
            p.computedWidth < p.naturalWidth
          ) {
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
        var results: any[] = [];
        let imgElements: any = document.querySelectorAll("img");

        for (var element of imgElements) {
          let p = getDimensionForImage(element);
          validateDimension(p, results);
        }

        //to do : This 2 (img, and non image)has to be inside Promise.all

        let nonImgElementsToLoad: any = document.querySelectorAll("div");
       
        processNonImageElements(nonImgElementsToLoad, results)
        .then(function(a: any) {
          resolve(results);
        });
      });
    });

    //Scaled Image Recommendation
    let status = 1;
    if (validationFailures.length > 1) {
      status = 3;
    }
    var scaledImageRecommendation = new Recommendation("scaled-images", status);

    var imageRuleResult = new RuleResult([]);
    imageRuleResult.recommendations.push(scaledImageRecommendation);
    if(includeMeta)
    {
      imageRuleResult.meta = validationFailures;
    }
    
    return imageRuleResult;
  }
}
