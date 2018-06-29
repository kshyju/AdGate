import { ImageRule } from "./rules/image";
import { Debug } from "./debug";

const debug = new Debug();

let imageRule = new ImageRule();

export class Runner {
  public async runRules() {
    debug.log("Runner runRules");

    const puppeteer = require("puppeteer");

    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();


      page.once('load', () => debug.log('Page loaded!'));

      //run rules?

      const handleRequestFinished = (request:any)=>{
        debug.log('handleRequestFinished');
        console.log(request._resourceType);

      }

      page.on("requestfinished", handleRequestFinished);



      await page.goto("https://news.ycombinator.com/");
      await page.waitFor(3000);


      await browser.close();
    })();
  }
}
