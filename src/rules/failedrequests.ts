import { Debug } from "../debug";
import { Result } from "../types/Result";

export class FailedRequests {
  reqData: any = {};
  listen(page: any) {
    let t = this;
    page.on("request", function(request: any) {
      t.reqData[request._requestId] = {
        url: request._url,
        type: request._resourceType
      };
    });

    page.on("requestfailed", function(request: any) {
      var r = t.reqData[request._requestId];
      r.status = -1;
      r.method = request._method;
    });

    page.on("requestfinished", function(request: any) {
      var r = t.reqData[request._requestId];
      if (r != undefined) {
        if(request._response._status>=204)
        r.status = request._response._status;
        r.method = request._method;
      }
    });
  }

  results(): any {
    return this.reqData;
  }
}
