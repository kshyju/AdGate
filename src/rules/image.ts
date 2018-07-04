import { Debug } from "../debug";
import { ValidationResult } from "../types/ValidationResult";
import { resolve } from "url";
const debug = new Debug();



export class ImageRule {
  ruleName: string = "ImageRule";




  async validate(page: any): Promise<Array<ValidationResult>> {
    debug.log("image rule-validate");



    let validatonFailures = await page.evaluate(() => {

      function getImageUrl(s: any) {
        //could be in bg
        var background = s.getPropertyValue("background-image");
        if (background === "none") {
          return null;
        }
        var imageUrl = background
          .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
          .split(',')[0];
        if (!imageUrl) {
          return null;
        }
        return imageUrl;
      }

      function getDiamensionForImage(element: any): any {
        let s = getComputedStyle(element);

        let p = { naturalWidth: 0, naturalHeight: 0, computedWidth: 0, computedHeight: 0, src: "" };
        let imageUrl = "";
        if (element.tagName === "IMG") {
          p.src = element.src;
          p.naturalWidth = element.naturalWidth;
          p.naturalHeight = element.naturalHeight;
        }
        return null;
      }

      // Return a promise which will be resolved when the image is "loaded"
      function loadImgPromise(imageSrc: string, computedHeight: number, computedWidth: number) {
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


      function processNonImageElements(elements: any, results: any): any {

        return new Promise((resolve, reject) => {
          console.log(`processing ${elements.length} non image elements`);
          var promiseArray = [];
          for (var i = 0; i < elements.length; i++) {

            let element = elements[i];

            let s = getComputedStyle(element);
            var imageUrl = getImageUrl(s);
            //console.log('imageUrl',imageUrl);

            if (imageUrl != null) {

              let computedHeightStr = s.getPropertyValue("height");
              let computedWidthStr = s.getPropertyValue("width");
              var computedWidth = +computedWidthStr.replace("px", "");
              var computedHeight = +computedHeightStr.replace("px", "");

              promiseArray.push(loadImgPromise(imageUrl, computedHeight, computedWidth));
            }
          }

          Promise.all(promiseArray).then(function (items) {
            console.log(`${items.length} images loaded`);
            console.log(JSON.stringify(items));

            items.forEach(function (item) {
              validateDiamension(item, results);
            });
            console.log('results1', JSON.stringify(results));
            //return results;
            resolve(results);
          });

        });
      }

      function validateDiamension(p: any, results: any) {

        if (p != null) {
          if (p.computedHeight < p.naturalHeight || p.computedWidth < p.naturalWidth) {
            var validationFailure2 = {
              msg: `${p.naturalWidth} * ${p.naturalHeight} has been scaled down to ${p.computedWidth} * ${p.computedHeight}`,
              url: p.url
            };
            results.push(validationFailure2);

          }
        }
      }


      return new Promise((resolve, reject) => {
        var results: any[] = [];
        let imgElements: any = document.querySelectorAll("img");
        console.log(`Processing ${imgElements.length} image elements`);

        for (var element of imgElements) {
          let p = getDiamensionForImage(element);
          validateDiamension(p, results);
        }

        let nonImgElementsToLoad: any = document.querySelectorAll("div");
        processNonImageElements(nonImgElementsToLoad, results).then(function (a: any) {
          console.log('non image elements validated');
          resolve(results);
        });
      });

    });

    return validatonFailures;
  }
}
