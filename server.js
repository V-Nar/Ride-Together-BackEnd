const app = require("./app");
const Event = require("./models/Event.model");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

// because of heroku free account restrictions, this function will update the DB on launch
// to remove on real deployement
(async function updateDB() {
  const now = new Date();

  try {
    const eventsToUpdate = await Event.updateMany(
      { date: { $lt: now }, isFinished: false },
      { isFinished: true }
    );
    console.log("Database is up to date!");
  } catch (error) {
    console.error(error);
  }
})()

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
