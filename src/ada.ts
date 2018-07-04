import { Debug } from "./debug";
import { Runner } from "./runner";

const debug = new Debug();
const runner = new Runner();

const run = async function() {
  debug.log("Inside ada");
  const args = process.argv.slice(2);
  const url = args[0];
 
  debug.log('Processing url:'+url);
  await runner.runRules(url,1000);
};

run();

// $ npm run adas
