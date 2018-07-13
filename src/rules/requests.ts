import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

const url = require("url");

export class Requests {
  
  reqData: any = {};

  

  listen(page: any) {
    let t = this;
    t.reqData = {};
    
    page.on("request", function (request: any) {
      t.reqData[request._requestId] = {
        url: request._url,
        type: request._resourceType
      };
    });

    page.on("requestfailed", function (request: any) {
      var r = t.reqData[request._requestId];
      r.status = -1;
      r.method = request._method;
    });

    page.on("requestfinished", function (request: any) {

      var r = t.reqData[request._requestId];
      if (r != undefined) {
        r.status = request._response._status;
        r.method = request._method;
      }
    });
  }

  results(includeMeta: boolean): Promise<RuleResult> {

    let ruleResult = new RuleResult("requests");
    let requests: any[] = [];
    let t = this;

    return new Promise(function (resolve: any, reject: any) {

      Object.keys(t.reqData).forEach(function (key, index) {
        requests.push(t.reqData[key]);
      });



      var hostNames = requests.map(function (item: any) {
        return url.parse(item.url).hostname;
      });

      var uniqueHostNames = hostNames.filter((v, i, a) => a.indexOf(v) === i);

      // Recommendation for too many DNS lookups
      var dnsLookupRuleStatus = 1;
      if (uniqueHostNames.length > 3 && uniqueHostNames.length <= 5) {
        dnsLookupRuleStatus = 2;
      } else if (uniqueHostNames.length >= 6) {
        dnsLookupRuleStatus = 3;
      }
      var dnsLookupCountResult = new Recommendation("dns", dnsLookupRuleStatus);
      ruleResult.recommendations.push(dnsLookupCountResult);

      // Recommendation for too many external calls
      var tooManyNetworkCallsStatus = 1;

      if (hostNames.length > 4 && hostNames.length <= 7) {
        tooManyNetworkCallsStatus = 2;
      } else if (hostNames.length > 7) {
        tooManyNetworkCallsStatus = 3;
      }

      var tooManyNetworkCalls = new Recommendation(
        "too-many-network-calls",
        tooManyNetworkCallsStatus
      );
      ruleResult.recommendations.push(tooManyNetworkCalls);

      // Recommendation for redirect response ?

      var redirectRequests = requests.filter(function (item) {
        return (item.status == 302 || item.status == 307);
      });

      var redirectResponseStatus = 1;
      if (redirectRequests.length >= 1 && redirectRequests.length <= 2) {
        redirectResponseStatus = 2;
      } else if (redirectRequests.length > 2) {
        redirectResponseStatus = 3;
      }
      var tooManyNetworkCalls = new Recommendation(
        "redirects",
        redirectResponseStatus
      );
      ruleResult.recommendations.push(tooManyNetworkCalls);
      if (includeMeta) {
        ruleResult.meta = requests;
      }
      return resolve(ruleResult);


    });

  }
}
