import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";
import { resolve } from "url";

export class Frames {
  

  frameUrls: any[] = [];
  async listen(page: any) {
   
  }

  dumpFrameTree(frame:any) {
    var url = frame.url();
    for (let child of frame.childFrames())
    {
      this.dumpFrameTree(child);
    }
    this.frameUrls.push(url);      
  }


  results(page:any, includeMeta: boolean): Promise<RuleResult> {


    let t = this;
    let ruleResult = new RuleResult("frames");

    console.log("t.frameUrls",t.frameUrls);

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
