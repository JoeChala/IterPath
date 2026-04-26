import { verifySessionToken } from "../utils/jwt.util.js";

export const authenticateSession = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = req.cookies.token || bearerToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifySessionToken(token);

    if (!payload.sub || !payload.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: err.message || "Invalid token" });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
