import puppeteer from 'puppeteer';

const inputSelector = '#weaviateUri';
const errorMessage = '#errorMessage';
const connectButton = '#connectButton';
const welcomeMessage = 'Welcome to the Weaviate-Playground!';
const errorString =
  "The provided url doesn't provide access to a Weaviate instance.";
const url = 'http://localhost:3000/';
const faultyWeaviateUrl = 'Hello';
const libraryClassButton = '.library-class-button';
const emptyWeaviateUrl = 'http://localhost:8080/weaviate/v1/graphql';
const emptyWeaviateUrl2 =
  'http%3A%2F%2Flocalhost%3A8080%2Fweaviate%2Fv1%2Fgraphql';

describe('init Playground', () => {
  test('renders error messages if Weaviate URL is missing or incorrect', async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector(inputSelector);

    const header = await page.$eval('h1', e => e.innerHTML);
    expect(header).toEqual(welcomeMessage);

    const errorMessage1 = await page.$eval(errorMessage, e => e.innerHTML);
    expect(errorMessage1).toEqual(errorString);

    // Go to faulty Weaviate url
    await page.type(inputSelector, faultyWeaviateUrl);
    await page.waitFor(1000);
    // @ts-ignore
    await page.$eval(connectButton, elem => elem.click());

    const newUrl1 = await page.url();
    expect(newUrl1).toEqual(`${url}?weaviateUri=${faultyWeaviateUrl}`);

    const errorMessage2 = await page.$eval(errorMessage, e => e.innerHTML);
    expect(errorMessage2).toEqual(errorString);
    browser.close();
  }, 30000);

  test('renders an empty Library if correct Weaviate URL with no classes', async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector(inputSelector);

    const header = await page.$eval('h1', e => e.innerHTML);
    expect(header).toEqual(welcomeMessage);

    const errorMessage1 = await page.$eval(errorMessage, e => e.innerHTML);
    expect(errorMessage1).toEqual(errorString);

    // Go to correct Weaviate url
    await page.type(inputSelector, emptyWeaviateUrl);
    await page.waitFor(1000);
    // @ts-ignore
    await page.$eval(connectButton, elem => elem.click());

    const newUrl1 = await page.url();
    expect(newUrl1).toEqual(`${url}?weaviateUri=${emptyWeaviateUrl2}`);

    const classesLength = (await page.$$(libraryClassButton)).length;
    expect(classesLength).toEqual(0);

    browser.close();
  }, 30000);

  test('renders a filled Library if correct Weaviate URL with classes', async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector(inputSelector);

    const header = await page.$eval('h1', e => e.innerHTML);
    expect(header).toEqual(welcomeMessage);

    const errorMessage1 = await page.$eval(errorMessage, e => e.innerHTML);
    expect(errorMessage1).toEqual(errorString);

    // Go to correct Weaviate url
    await page.type(inputSelector, emptyWeaviateUrl);
    await page.waitFor(1000);
    // @ts-ignore
    await page.$eval(connectButton, elem => elem.click());

    const newUrl1 = await page.url();
    expect(newUrl1).toEqual(`${url}?weaviateUri=${emptyWeaviateUrl2}`);

    const classesLength = (await page.$$(libraryClassButton)).length;
    expect(classesLength).toEqual(3);

    browser.close();
  }, 30000);
});
