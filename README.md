# 🚀🚀🚀🚀🚀

AdGate is a smart recommendation engine to track poorly built ad content which degrades our page performance.

Behind the scene, AdGate will run the url in headless chrome and run each of the configured rules against the page and generate a recommendation based on the result from the rule.

Currently **14** rules are built in. Additional rules can be added and plugged in.

1. Image scaling
2. DNS lookup
3. Too many network calls
4. Redirect responses
5. Paint time
6. Time to first byte(Server latency)
7. Node count in page
8. Too many event listeners in the page
9. Script duration
10. Frame count in page
11. Javascript code coverage
12. CSS code coverage
13. Console log messages
14. Dialogs in page.

### Built with

1. Node.JS
2. Typescript
3. Puppeteer 🎉 ❤️
4. Azure Cosmos DB


See the [video](https://www.youtube.com/watch?v=C8wiWzOMZOs&feature=youtu.be)