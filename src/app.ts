let express = require("express");
import path from "path";
import { Runner } from "./runner";
var url = require('url');
let bodyParser = require("body-parser");

// Controllers (route handlers)
import * as homeController from "./controllers/home";

// Create Express server
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());

/**
 * Primary app routes GET.
 */
app.get("/", homeController.index);
app.get("/details/:id", homeController.details);
app.get("/recommendation/:id/:ruleName/:recName", homeController.recommendationdetails);


/**
 * Primary app routes POST. :ruleName/:recName
 */
app.post("/analyse", homeController.analyse);

app.locals.getStatusClass = function (status: number) {
  if (status == 1) {
    return "alert-success";
  } else if (status == 2) {
    return "alert-warning";
  } else {
    return "alert-danger";
  }
};

app.locals.getStatus = function (status: number) {
  if (status == 1) {
    return "done";
  } else if (status == 2) {
    return "warning";
  } else {
    return "error";
  }
};

app.locals.getStatusName = function (status: number) {
  if (status == 1) {
    return "Passed :)";
  } else if (status == 2) {
    return "Partially failed!";
  } else {
    return "Failed!";
  }
};

app.locals.getDisplayName = function (ruleName: string) {
  if (ruleName == "console-logs") {
    return "Console logs";
  } else if (ruleName == "console-errors") {
    return "Console Errors";
  } else if (ruleName == "scaled-images") {
    return "Scaled Images";
  } else if (ruleName == "dns") {
    return "DNS Lookup";
  } else if (ruleName == "too-many-network-calls") {
    return "Too many network calls";
  } else if (ruleName == "redirects") {
    return "Redirect responses";
  }
  else if (ruleName == "paint-timings") {
    return "Paint time";
  }
  else if (ruleName == "node-count") {
    return "Node count in page";
  }
  else if (ruleName == "node-count") {
    return "Node count in page";
  }
  else if (ruleName == "response-time") {
    return "Time to first byte";
  }
  else {
    return ruleName;
  }
};

app.locals.getRuleDisplayName = function (ruleName: string) {
  if (ruleName == "pageMetrics") {
    return "Page Metrics";
  } else if (ruleName == "perf-timings") {
    return "Perf Timings";
  } 
  else if (ruleName == "requests") {
    return "Requests";
  } 
  else if (ruleName == "image") {
    return "Images";
  } 
  else {
    return ruleName;
  }
};


app.locals.getUrlHostName = function (fullUrl: string) {
  return url.parse(fullUrl).hostname;
};

export default app;
