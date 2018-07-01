let express = require("express");
const app = express();
import { Runner } from "./runner";

let bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.json())
app.get("/", function(req:any, res:any) {
  res.render("index");
});
// parse various different custom JSON types as JSON
//app.use(express.bodyParser());


app.post("/analyse", async function(req:any, res:any) {

  var r = new Runner();

  var resultId = await r.runRules(req.body.reqUrl);
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: resultId }));
});



app.listen(3000, function() {
  console.log("App running on port 3000!");
});
