const mongoose = require("mongoose");

const connectionToDB = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to DB."))
    .catch((err) => console.log(err));
};

module.exports = connectionToDB;