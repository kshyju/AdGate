import { Debug } from "../debug";

const debug = new Debug();

export class ImageRule {
  ruleName: string = "ImageRule";
  async validate(page: any) {
    debug.log("image rule-validate");

    let texts = await page.evaluate(() => {
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

        if (
          p.computedHeight < p.naturalHeight ||
          p.computedWidth < p.naturalWidth
        ) {
          var validationFailure = {
            ruleName: this.ruleName,
            msg: "Scaled down images found",
            src : element.src
          };
          results.push(validationFailure);
        }
      }

      return results;
    });

    return new Promise((resolve: Function, reject: Function) => {
      var d = { name: "a" };
      return resolve(texts);
    });
  }
}
