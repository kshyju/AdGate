let express = require("express");
import path from "path";
import { Runner } from "./runner";


let bodyParser = require("body-parser");

// Controllers (route handlers)
import * as homeController from "./controllers/home";

// Create Express server
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(bodyParser.json())


/**
 * Primary app routes GET.
 */
app.get("/", homeController.index);
app.get("/details/:id", homeController.details);

/**
 * Primary app routes POST.
 */
app.post("/analyse", homeController.analyse);

export default app;