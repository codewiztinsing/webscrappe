const express = require('express');
const puppeteer = require('puppeteer');


async function scrapeLatestPost() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://twitter.com/coindesk');

  // Wait for tweets to load
  await page.waitForSelector('article[role="article"]');

  const latestPost = await page.evaluate(() => {

    const tweet = document.querySelector('article[role="article"]');
    const textElement = tweet.querySelector('div[lang]');
    const timestampElement = tweet.querySelector('time');
    const imageElement = tweet.querySelector('img');
    const commentElement = tweet.querySelector('div[data-testid="reply"] span');
    const likeElement = tweet.querySelector('div[data-testid="like"] span');
    const retweetElement = tweet.querySelector('div[data-testid="retweet"] span');

    const text = textElement ? textElement.textContent.trim() : '';
    const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';
    const image = imageElement ? imageElement.getAttribute('src') : null;
    const comments = commentElement ? parseInt(commentElement.textContent.trim().replace(/[^0-9]/g, '')) : 0;
    const likes = likeElement ? parseInt(likeElement.textContent.trim().replace(/[^0-9]/g, '')) : 0;
    const retweets = retweetElement ? parseInt(retweetElement.textContent.trim().replace(/[^0-9]/g, '')) : 0;
    const id = Math.random(1,10000000000)

    return {
      id,
      text,
      timestamp,
      image,
      comments,
      likes,
      retweets
    };
  });

  await browser.close();
  return latestPost;
}

module.exports = {
    scrapeLatestPost

}

