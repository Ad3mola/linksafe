const { createSafe, getSafe } = require("./dist");

(async () => {

const wallet = await getSafe("https://linksafe-reown.vercel.app/lnv2uCmWKWAXAhoc2mM4d9dtkwDihjM9Fbr5pAauupihXfc5NcUEAx4pKGvtZPMtrs1QN37tK4KtcgYTPAcX32ZyUzF");
console.log("Retrieved Wallet:", wallet);


  const safe = await createSafe();
  console.log("Created Safe:", safe);
 
})();
