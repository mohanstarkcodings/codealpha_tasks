const express = require("express");

const favicon = require("serve-favicon");

const CustomError = require("./utils/CustomError.js");
const errorHandler = require("./middleware/errorHandler");

const helmetMWModule = require("./middleware/helmet.js");

const corsMiddleWare = require("./middleware/cors.js");

const authLimiter = require("./middleware/authRateLimit.js");
const apiLimiter = require("./middleware/apiRateLimit.js");

const path = require("path");

const dotenv = require("dotenv");

const loggerMWModule = require("./middleware/logger");

const eventsModule = require("./apis/ViewEvent.js");
const ParticipantRegistration = require("./apis/participant/Registration.js");

const OrganiserEventManagement = require("./apis/organiser/EventManagement.js");
const OrganiserRegistrationMonitor = require("./apis/organiser/RegistrationMonitor.js");

const admin = require("./apis/SystemAdmin/admin.js");

const signupmodule = require("./auth/signup.js");

const loginmodule = require("./auth/login.js");

const passport = require("passport");
const oauthmodule = require("./auth/OAuth/googleoauth.js");
require("./auth/OAuth/passport.js");

require("./middleware/authorize.js");

const { router: dbRouter } = require("./db.js");

require("dotenv").config();

const app = express();

app.use(helmetMWModule);
app.use(corsMiddleWare);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMWModule);

app.use(
  favicon(path.join(__dirname, "public", "favicon.ico"), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }),
);
app.use(express.static("public"));

app.use("/db", dbRouter);

app.use("/events", apiLimiter, eventsModule);

app.use("/participant/registration", ParticipantRegistration);

app.use("/organiser/eventmanagement", apiLimiter, OrganiserEventManagement);
app.use(
  "/organiser/registrationmonitor",
  apiLimiter,
  OrganiserRegistrationMonitor,
);

app.use("/systemadmin", apiLimiter, admin);

app.use("/signup", authLimiter, signupmodule);

app.use("/login", authLimiter, loginmodule);

app.use("/oauth", authLimiter, oauthmodule);
app.use(passport.initialize());

app.get(/^\/home(?:\.html)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

//CENTRALIZED ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
