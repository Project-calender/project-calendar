const express = require("express");

const { sequelize } = require("../models");
const { Alert } = require("../models");
const router = express.Router();
const { authJWT } = require("../middlewares/auth");
const { Op } = require("sequelize");

router.post("/getAlerts", authJWT, async (req, res, next) => {
  try {
    const alerts = await Alert.findAndCountAll({
      where: { UserId: req.myId },
      attributes: {
        exclude: ["updatedAt", "deletedAt", "UserId"],
      },
      order: [["id", "DESC"]],
      limit: 8, //limit개 가져와라
      offset: (req.body.page - 1) * 8, //offset부터
    });

    res.status(200).send({ count: alerts.count, alerts: alerts.rows });

    var now = new Date();
    now.setDate(now.getDate() - 15);
    await Alert.destroy({
      where: {
        [Op.and]: {
          UserId: req.myId,
          createdAt: {
            [Op.lte]: now,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/read", authJWT, async (req, res, next) => {
  try {
    const alert = await Alert.findOne({
      where: { id: req.body.alertId },
    });

    await sequelize.transaction(async (t) => {
      await alert.update(
        {
          checked: true,
        },
        { transaction: t }
      );
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
