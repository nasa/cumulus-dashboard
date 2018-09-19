'use strict';
const Browser = require('zombie');
import test from 'ava';
// const puppeteer = require('puppeteer');


test('User visits main page', async (t) => {
  Browser.site ='localhost:3000';
  Browser.localhost('localhost:3000', 3000);
  const browser = new Browser();
  // console.log(browser);
  try {
    await browser.visit('/#/auth');//example.com/coll
  }
  catch(e){
    console.log('err', e);
  }

  t.is(1, 1);
});

// test('Visit main page', async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('http://localhost:3000');
//   await page.screenshot({path: 'example.png'});

//   await browser.close();
// })();
