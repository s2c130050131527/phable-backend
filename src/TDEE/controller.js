import { Router } from 'express';
import { Model } from 'mongoose';
import { UserDetailColl } from './model';

const ACTIVITY_MAP = {
  sedentry: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725,
  extreme: 1.9,
};

const controller = (() => {
  const router = Router();

  router.post('/count', (req, res, next) => {
    const { weight = 0, bodyFat = 15, activityId } = req.body;

    if (!weight) {
      res.status(404).json({ error: 'Weight not supplied' });
      return;
    }
    const data = {
      activityErr: 'default',
    };

    let activityThresh = ACTIVITY_MAP.sedentry;
    if (ACTIVITY_MAP[activityId]) {
      data.activityErr = null;
      activityThresh = ACTIVITY_MAP[activityId];
    }

    data.bmr = parseInt(21.6 * (weight - (bodyFat / 100) * weight) + 370, 10);
    data.tdee = parseInt(data.bmr * activityThresh, 10);

    data.cutting = {};
    data.gaining = {};

    const thumbruleOf1kg = 7000;
    const numberOfdaysinMonth = 30;
    const calorie2Kg = parseInt((thumbruleOf1kg * 2) / numberOfdaysinMonth, 10);
    const calorie4Kg = parseInt((thumbruleOf1kg * 4) / numberOfdaysinMonth, 10);

    data.cutting.day2diff = calorie2Kg;
    data.cutting.day4diff = calorie4Kg;
    data.gaining.day2diff = calorie2Kg;
    data.gaining.day4diff = calorie4Kg;

    data.gaining.day2 = parseInt(data.tdee + calorie2Kg, 10);
    data.gaining.day4 = parseInt(data.tdee + calorie4Kg, 10);
    data.cutting.day2 = parseInt(data.tdee - calorie2Kg, 10);
    data.cutting.day4 = parseInt(data.tdee - calorie4Kg, 10);

    res.status(200).json({
      data,
    });
  });

  router.post('/saveuser', (req, res) => {
    const { name, weight, bodyFat = 15, activityId = 'sedentary', foodids = [] } = req.body;
    if (!name) {
      res.status(404).json({ err: 'Name not found' });
      return;
    }
    if (!weight) {
      res.status(404).json({ err: 'Weight not found' });
      return;
    }
    UserDetailColl.update(
      { name },
      {
        weight,
        fat: bodyFat,
        activity: activityId,
        foodids,
      },
      { upsert: true, setDefaultsOnInsert: true },
      (err, result) => {
        if (err) {
          res.status(500).json({ err });
          return;
        }
        res.status(201).json({
          data: result.upserted?.length ? 'Created' : 'Updated',
        });
      },
    );
  });
  router.get('/getusers', (req, res) => {
    UserDetailColl.find({})
      .then(result => {
        res.status(200).json({
          data: result,
        });
      })
      .catch(() => {
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

  return router;
})();

controller.prefix = '/tdee';

export default controller;
