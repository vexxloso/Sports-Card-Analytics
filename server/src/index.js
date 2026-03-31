const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const config = require("./config");

const apiRoutes = require("./routes/api");
const { closeDb } = require("./db");

const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const isProd = config.nodeEnv === "production";
app.use(
  cors({
    // Dev: allow any browser origin (Vite on LAN/IP). Prod: lock to CLIENT_ORIGIN.
    origin: isProd ? config.clientOrigin : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "256kb" }));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use("/api", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    message: config.clientOrigin.includes("localhost") ? String(err.message) : undefined,
  });
});

const server = app.listen(config.port, config.apiListenHost, () => {
  const host = config.apiListenHost;
  console.log(`API listening on http://${host}:${config.port}`);
  console.log(
    isProd ? `CORS: ${config.clientOrigin}` : "CORS: open (development only)"
  );
});

async function shutdown(signal) {
  console.log(`${signal} — closing…`);
  server.close();
  await closeDb();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
