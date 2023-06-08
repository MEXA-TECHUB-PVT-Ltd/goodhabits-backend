const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); 
const app = express();
const dbConfig = require('./app/config/db.config')
require('dotenv').config()
var corsOptions = {
  // origin: "http://localhost:8081"s
};
app.use(cors()) // Use this
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static("files"));
app.use(express.urlencoded({ extended: true }));   
app.use("/images_uploads", express.static("images_uploads"))


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Good Habits" });
});

// require("./app/routes/admin")(app);
require("./app/routes/auth")(app);
require("./app/routes/Membership")(app);
require("./app/routes/CustomerRelation")(app);
require("./app/routes/event")(app);
require("./app/routes/donationRecord")(app);
require("./app/routes/goodsInventory")(app);
require("./app/routes/basicSettings")(app);
require("./app/routes/MembershipLevel")(app);
require("./app/routes/EmailTemplate")(app);
require("./app/routes/EmailSettings")(app);
require("./app/routes/staffLevel")(app);
require("./app/routes/staffPermissions")(app);
require("./app/routes/Permissions")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

