import express from 'express';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const INVESTOR_URL = process.env.INVESTOR_URL;

const app = express();
const fetchFeeds = async ({ limit = 10, skip = 0 }) => {
  const URL = `${INVESTOR_URL}/api/v1/feeds?limit=${limit}&skip=${skip}`;

  try {
    const start = Date.now();
    await axios.get(URL);
    const stop = Date.now();
    console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
  } catch (error) {
    console.log(error);
  }
};

// function that will increase the skip value by 10 and limit by 10 till limit reached to 100
const fetchFeedsByLimit = async (limit = 10, skip = 0) => {
  if (skip < 100) {
    console.log(`Current loaded feeds: ${skip}`);
    await fetchFeeds({ limit, skip });
    await fetchFeedsByLimit(limit, skip + 10);
  } else {
    console.log(`Total number of feeds: ${skip}`);
  }
};

// cron run after 10 minutes
cron
  .schedule('*/10 * * * *', async () => {
    await fetchFeedsByLimit(10, 0);
  }).start();

const PORT = process.env.PORT ?? 5731;

app.listen(PORT, () => {
  console.log(`Listeninig to server on ${PORT}`);
});
