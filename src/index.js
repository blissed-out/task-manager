import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("db connection error", error);
    process.exit(1);
  });
