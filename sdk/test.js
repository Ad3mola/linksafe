const { createSafe, getSafe } = require("./dist");

(async () => {
  const safe = await createSafe();
  console.log("Created Safe:", safe);

  if (safe) {
    const wallet = await getSafe(safe.safe);
    console.log("Retrieved Wallet:", wallet);
  }
})();
