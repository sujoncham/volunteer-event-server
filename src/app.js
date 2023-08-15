const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./server");
const routeEventor = require("./modules/eventor/eventor.route");
const routeAdmin = require("./modules/admin/admin.route");
const routeEvent = require("./modules/events/event.route");
const routeVolunteer = require("./modules/volunteer/volunteer.route");
const routeUser = require("./modules/user/user.route");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./uploads"));

connectDB();

app.use("/api/v1/user", routeUser);
app.use("/api/v1/volunteer", routeVolunteer);
app.use("/api/v1/event", routeEvent);
app.use("/api/v1/eventor", routeEventor);
app.use("/api/v1/admin", routeAdmin);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
module.exports = app;
