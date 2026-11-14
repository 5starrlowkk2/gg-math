require("dotenv").config();

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PORTAL_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!PASSWORD || !SESSION_SECRET) {
  console.error("Missing PORTAL_PASSWORD or SESSION_SECRET. Copy .env.example to .env and fill them in.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(helmet({
  // The game pages can embed third-party games in iframes. Individual game
  // providers may still block embedding through their own security headers.
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["'self'", "https:"],
      upgradeInsecureRequests: null
    }
  }
}));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(session({
  name: "ggmath.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  }
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many login attempts. Please wait a little and try again."
});

app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (_req, res) => {
  if (_req.session.authenticated) return res.redirect("/games");
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", loginLimiter, (req, res) => {
  const submitted = String(req.body.password || "");
  if (submitted !== PASSWORD) {
    return res.redirect("/login?error=1");
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Could not start your session. Please try again.");
    req.session.authenticated = true;
    res.redirect("/games");
  });
});

function requireLogin(req, res, next) {
  if (req.session.authenticated) return next();
  res.redirect("/login");
}

app.get("/games", requireLogin, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "games.html"));
});

app.post("/logout", requireLogin, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("ggmath.sid");
    res.redirect("/");
  });
});

// For local testing. For a public deployment, use a hosting platform that
// provides HTTPS and a persistent session store rather than Express MemoryStore.
app.listen(PORT, () => {
  console.log(`gg math is running at http://localhost:${PORT}`);
});
