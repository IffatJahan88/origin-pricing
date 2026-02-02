const report = require("multiple-cucumber-html-reporter");
const path = require("path");

report.generate({
  jsonDir: path.join(__dirname, "../reports"),
  reportPath: path.join(__dirname, "../reports/html"),
  reportName: "Cucumber Report",
  openReportInBrowser: false,
});
