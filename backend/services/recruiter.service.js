import RecruiterInvite from '../models/invites.model.js';
import Recruiter from '../models/recruiter.model.js';
import {
  signMagicLinkToken,
  verifyMagicLinkToken,
  signSessionToken
} from '../utils/jwt.util.js';
import { sendEmail } from '../utils/email.util.js';


export const inviteRecruiter = async (email, company) => {

  // block duplicate active invites
  const existingInvite = await RecruiterInvite.findOne({ email, used: false });
  if (existingInvite) {
    throw new Error('An active invite already exists');
  }

  // sign the token, valid for 24 hours
  const token = signMagicLinkToken(email, '24h');

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // now + 24h
  await RecruiterInvite.create({
    email,
    token,
    company,
    expiresAt,
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const inviteUrl = `${clientUrl}/r/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'You have been invited to IterPath',
    html: `
      <p>Hello,</p>
      <p>You have been invited to join IterPath as a recruiter for <strong>${company}</strong>.</p>
      <p><a href="${inviteUrl}">Click here to accept your invite</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not expect this email, you can ignore it.</p>
    `,
  });

  return { message: 'Invite sent successfully' };
};


export const requestLoginLink = async (email) => {

  // check if account exists
  const recruiter = await Recruiter.findOne({ email });

  if (!recruiter) {
    throw new Error('No recruiter account found for this email');
  }

  // sign a short-lived token, 15 minutes only
  const token = signMagicLinkToken(email, '15m');

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const loginUrl = `${clientUrl}/r/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Your IterPath login link',
    html: `
      <p>Hello ${recruiter.name},</p>
      <p>Click the link below to sign in to IterPath.</p>
      <p><a href="${loginUrl}">Click here to sign in</a></p>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, you can ignore it.</p>
    `,
  });

  return { message: 'Login link sent' };
};


export const verifyInviteToken = async (token) => {

  const payload = verifyMagicLinkToken(token);

  const invite = await RecruiterInvite.findOne({
    email: payload.email,
    used: false,
  });

  // check expiry
  if (invite && invite.expiresAt < new Date()) {
    throw new Error('Invite expired');
  }

  let recruiter = await Recruiter.findOne({ email: payload.email });

  // CASE 1: Existing recruiter (login flow)
  if (!invite && recruiter) {
    const sessionToken = signSessionToken({
      sub: recruiter._id,
      role: 'recruiter',
    });

    return { sessionToken, recruiter };
  }

  // invalid case
  if (!invite && !recruiter) {
    throw new Error('Invalid invite');
  }

  // CASE 2: First-time invite → create recruiter
  recruiter = await Recruiter.findOneAndUpdate(
    { email: payload.email },
    {
      $setOnInsert: {
        email: payload.email,
        company: invite.company,
        name: 'Pending',
        designation: 'Pending',
        isOnboarded: false,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  // mark invite used
  invite.used = true;
  await invite.save();

  const sessionToken = signSessionToken({
    sub: recruiter._id,
    role: 'recruiter',
  });

  return { sessionToken, recruiter };
};
