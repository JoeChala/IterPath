import crypto from "crypto";

export default function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}