const express = require("express");
const passport = require("passport");

const router = express.Router();

const userTimeline = require("../controllers/timeline_controller");

const userController = require("../controllers/user_controller");
const friendController = require("../controllers/friendReq_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
// router.get('/profile',passport.checkAuthentication,userController.userProfile);
router.post("/update/:id", passport.checkAuthentication, userController.update);

router.get("/sign-in", userController.signIn);
router.get("/sign-up", userController.signUp);

router.post("/create", userController.create);

router.use('/show',require('./allUser'));

router.post("/connect-with-chat/:id", userController.connectWithChat);
router.use('/chatbox', require('./chatboxes'));




router.get("/timeline", userTimeline.home);

router.use('/messages',require('./messages'));

router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userController.createSession
);

router.get("/", function (req, res) {
  return res.end("home page");
});

router.get("/sign-out", userController.distroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  userController.createSession
);

router.use("/friend", require("./friend"));



module.exports = router;
