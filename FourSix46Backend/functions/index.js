const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");

const app = require("./server");

setGlobalOptions({ maxInstances: 10 });

exports.api = onRequest(
  {
    timeoutSeconds: 300,
    memory: "512MiB",
    region: "europe-west2",
  },
  app
);
// redeploy Tue Mar 31 19:30:54 IST 2026
