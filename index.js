const express = require("express");
const redis = require("redis");
const app = express();

let redisClient;
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => {
    console.log(error);
  });
  await redisClient.connect();
})();

// without redis
app.get("/calculate-data", (req, res) => {
  try {
    let calculatedData = 0;
    for (let i = 0; i < 10000000000; i++) {
      calculatedData += i;
    }

    return res.json(calculatedData);
  } catch (error) {
    console.log(error);
  }
});

// with redis
app.get("/calculate-dataredis", async (req, res) => {
  try {
    let calculatedData = 0;

    const cashedData = await redisClient.get("calculatedData");
    if (cashedData) {
      return res.json(cashedData);
    }

    for (let i = 0; i < 10000000000; i++) {
      calculatedData += i;
    }

    await redisClient.set("calculatedData", calculatedData);
    return res.json(calculatedData);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
