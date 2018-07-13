import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";
import { resolve } from "url";

export class Frames {
  frameUrls: any[] = [];
  async listen(page: any) {}

  dumpFrameTree(frame: any) {
    // console.log('frame',frame);
    if (frame == null) {
      return;
    }
    var url = frame.url();
    if(url!="about:blank")
    {
      this.frameUrls.push(url);
    }
    for (let child of frame.childFrames()) {
      this.dumpFrameTree(child);
    }

  }

  results(page: any, includeMeta: boolean): Promise<RuleResult> {
    var f = page.mainFrame();
    //console.log('f',f);/*  */
    for (let child of f.childFrames()) {
      this.dumpFrameTree(child);
    }

    let t = this;
    let ruleResult = new RuleResult("frames");

    console.log("t.frameUrls", t.frameUrls);

    return new Promise(function(resolve: any, reject: any) {
      let status = t.frameUrls.length == 0 ? 1 : 2;
      var errorRecommendation = new Recommendation("frames-in-page", status);
      if (includeMeta) {
        ruleResult.meta = t.frameUrls;
      }
      ruleResult.recommendations.push(errorRecommendation);
      return resolve(ruleResult);
    });
  }
}
