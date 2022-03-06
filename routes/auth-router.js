const router = require("express").Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/registration",
  [
    check("email", "Некорректный Email!").isEmail(),
    check(
      "password",
      "Пароль должен быть от 3 и не более 12 символов"
    ).isLength({ min: 3, max: 12 }),
    check("name", "Имя должно быть от 3 до 75 символов").isLength({
      min: 3,
      max: 75,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Некорректный запрос" }, errors);
    }
    try {
      const { email, password, name } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({
          message: "Пользователь с таким Email уже существует!",
        });
      }
      const hashPassword = await bcrypt.hash(password, 8);

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }

      const avatarColor = getRandomInt(1, 9);
      const user = new User({
        email,
        password: hashPassword,
        avatar: avatarColor,
        name,
      });
      await user.save();

      const userlog = await User.findOne({ email });
      if (!userlog) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      const isPassValid = bcrypt.compareSync(password, userlog.password);
      if (!isPassValid) {
        return res.status(400).json({ message: "Некорректный пароль" });
      }
      const token = jwt.sign({ id: userlog.id }, config.get("secretKey"), {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user: {
          id: userlog.id,
          email: userlog.email,
          avatar: userlog.avatar,
          name: userlog.name,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: "Ошибка на сервере!" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: "Некорректный пароль" });
    }
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Ошибка на сервере!" });
  }
});

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Ошибка на сервере!" });
  }
});

module.exports = router;
