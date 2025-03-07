import expressApp from "./expressApp";

const PORT = process.env.PORT || 4000;

export const StartServer = async () => {
  expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log("Server is running");
});
