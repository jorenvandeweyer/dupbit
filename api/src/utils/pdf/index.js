const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function create() {
    const content = fs.readFileSync(path.resolve(__dirname, './templates/cv.html'), 'utf8');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setContent(content);
    const buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
        },
    });
    await browser.close();

    return buffer;
}

module.exports = {
    create,
};
