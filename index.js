const express = require("express");
const ExpressError = require("./expressError");

const app = express();

// for processing JSON:
app.use(express.json());


app.get('/mean', function (req, res, next) {
  // respond w/JSON obj 
  try {
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400)
    }

    let nums = (req.query.nums).split(",");

    // move to outside file? 
    const mean = arr => {
      let len = arr.length;
      let total = 0;

      for (let num of arr) {
        let int = +(num);

        if (Number.isNaN(int)) {
          throw new ExpressError(`${num} is not a valid number.`, 400);
        }
        total += int;
      }
      return total / len;
    };

    return res.json({
      response: {
        operation: "mean",
        value: mean(nums)
      }
    });

  } catch (err) {
    return next(err);
  }
})


app.get('/median', function (req, res, next) {

  try {
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400)
    }

    let nums = (req.query.nums).split(",").map(num => +num);

    for (let num of nums) {
      if (Number.isNaN(num)) {
        throw new ExpressError(`${num} is not a valid number.`, 400);
      }
    }

    // move to outside file? 
    const median = arr => {
      const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };

    return res.json({
      response: {
        operation: "median",
        value: median(nums)
      }
    });

  } catch (err) {
    return next(err);
  }

})


app.get('/mode', function (req, res, next) {

  try {
    if (!req.query.nums) {
      throw new ExpressError("nums are required", 400)
    }
    let nums = (req.query.nums).split(",").map(num => +num);

    for (let num of nums) {
      if (Number.isNaN(num)) {
        throw new ExpressError(`${num} is not a valid number.`, 400);
      }
    }

    // console.log(nums);
    let counterObj = {};

    for (let num of nums) {
      if (!counterObj[num]) {
        counterObj[num] = 1
      }
      else {
        counterObj[num]++;
      }
    }

    let maxNum = Math.max(...Object.values(counterObj));
    let mode = Object.keys(counterObj).find(key => counterObj[key] === maxNum);

    return res.json({
      response: {
        operation: "mode",
        value: mode
      }
    });

  } catch (err) {
    return next(err);
  }


})


app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(3000, function () {
  console.log("Running our app on port 3000");
});