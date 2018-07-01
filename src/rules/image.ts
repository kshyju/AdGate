import { Debug } from "../debug";

const debug = new Debug();



export class ImageRule {
  ruleName: string = "ImageRule";

  async validate(page: any):Promise<any>  {
    debug.log("image rule-validate");



    let validatonFailures = await page.evaluate(() => {
      let results= [];
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

        if (
          p.computedHeight < p.naturalHeight ||
          p.computedWidth < p.naturalWidth
        ) {
          var validationFailure = {msg :`${p.naturalHeight} * ${p.naturalHeight} has been scaled down to ${p.computedHeight} * ${p.computedWidth}`,
         url  :element.src};
          results.push(validationFailure);
        }

      }
      return results;
    });
    return validatonFailures;
  }
}
