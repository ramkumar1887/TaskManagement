const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:/ProgramData/Microsoft/Windows/Start Menu/Programs/Google Chrome.lnk", // Update with the actual path to Chrome
        headless: true // Or false if you want to see the browser
    });
    const page = await browser.newPage();

    await page.goto('https://www.tradingview.com/symbols/SPX/?exchange=SP', {
        waitUntil: 'networkidle2'
    });

    try {
        // Wait for the target span to load
        await page.waitForSelector('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div.symbolRow-OJZRoKx6.hideTabs-OJZRoKx6 > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.lastContainer-JWoJqCpY > span.last-JWoJqCpY.js-symbol-last');

        // Monitor the content for updates
        const interval = setInterval(async () => {
            const updatedText = await page.evaluate(() => {
                const element = document.querySelector('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div.symbolRow-OJZRoKx6.hideTabs-OJZRoKx6 > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.lastContainer-JWoJqCpY > span.last-JWoJqCpY.js-symbol-last');
                return element ? element.textContent.trim() : 'N/A';
            });
            console.log('Updated Text:', updatedText);
        }, 1000); // Check every second

        // Stop monitoring after 30 seconds
        setTimeout(() => {
            clearInterval(interval);
            console.log('Stopped monitoring.');
            browser.close();
        }, 30000);
    } catch (error) {
        console.error('Error:', error.message);
        await browser.close();
    }
})();
