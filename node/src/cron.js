const cron = require("node-cron");
const ICS = require("../scripts/calendarICS");

cron.schedule("0 * * * *", () => {
    ICS.update();
});
