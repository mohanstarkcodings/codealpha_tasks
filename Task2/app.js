const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");

const dotenv = require("dotenv");

const { router: dbRouter } = require("./db.js");

require("dotenv").config();

const app = express();

const CustomError = require("./utils/CustomError");
const errorHandler = require("./middleware/errorHandler");

const helmetMWModule = require("./middleware/helmet.js");
const loggerMWModule = require("./middleware/logger");

const corsMiddleWare = require("./middleware/cors.js");

const authLimiter = require("./middleware/authRateLimit.js");
const apiLimiter = require("./middleware/apiRateLimit.js");

const signupmodule = require("./auth/signup.js");

const loginmodule = require("./auth/login.js");

const passport = require("passport");
const oauthmodule = require("./auth/OAuth/googleoauth.js");
require("./auth/OAuth/passport.js");

require("./auth/authorisation.js");

const viewMenuModule = require("./apis/menu/viewMenu.js");
const addMenuModule = require("./apis/menu/addMenu.js");
const deleteMenuModule = require("./apis/menu/deleteMenu.js");
const updateMenuModule = require("./apis/menu/updateMenu.js");

const tableModule = require("./apis/tables.js");

const reservationModule = require("./apis/reservation.js");

const viewOrderModule = require("./apis/order/viewOrder.js");
const updateOrderModule = require("./apis/order/updateOrder.js");
const deleteOrderModule = require("./apis/order/deleteOrder.js");
const createOrderModule = require("./apis/order/createOrder.js");
const cancelOrderModule = require("./apis/order/cancelOrder.js");

const billGenerationModule = require("./apis/order/billGeneration.js");

const viewInventoryModule = require("./apis/InventoryManagement/viewInventory.js");
const addInventoryModule = require("./apis/InventoryManagement/addInventory.js");
const deleteInventoryModule = require("./apis/InventoryManagement/deleteInventory.js");
const updateInventoryModule = require("./apis/InventoryManagement/updateInventory.js");

const salesReportModule = require("./apis/salesReports.js");
const inventoryReportModule = require("./apis/inventoryReports.js");

const viewUsersModule = require("./apis/userManagement/viewUsers.js");
const manageUserModule = require("./apis/userManagement/manageUsers.js");

app.use(helmetMWModule);
app.use(corsMiddleWare);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMWModule);

app.use(express.static("public"));
app.use(
  favicon(path.join(__dirname, "public", "restaurantFavicon.ico"), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }),
);

app.use("/db", dbRouter);

app.use("/signup", authLimiter,signupmodule);

app.use("/login", authLimiter, loginmodule);

app.use("/oauth",authLimiter, oauthmodule);
app.use(passport.initialize());

app.use("/menu", apiLimiter,viewMenuModule);
app.use("/menu", apiLimiter,addMenuModule);
app.use("/menu", apiLimiter,deleteMenuModule);
app.use("/menu", apiLimiter,updateMenuModule);

app.use("/table", apiLimiter,tableModule);

app.use("/reservation", apiLimiter,reservationModule);

app.use("/order",apiLimiter, viewOrderModule);
app.use("/order", apiLimiter,createOrderModule);
app.use("/order",apiLimiter, cancelOrderModule);
app.use("/order", apiLimiter,deleteOrderModule);
app.use("/order", apiLimiter,updateOrderModule);
app.use("/order", apiLimiter,billGenerationModule);

app.use("/inventory", apiLimiter,addInventoryModule);
app.use("/inventory",apiLimiter, deleteInventoryModule);
app.use("/inventory", apiLimiter,updateInventoryModule);
app.use("/inventory", apiLimiter,viewInventoryModule);

app.use("/salesReport", apiLimiter,salesReportModule);
app.use("/inventoryReport", apiLimiter,inventoryReportModule);

app.use("/userManagement",apiLimiter, manageUserModule);
app.use("/userManagement", apiLimiter,viewUsersModule);

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