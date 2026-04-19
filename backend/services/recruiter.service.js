import RecruiterInvite from '../models/invites.model.js';
import Recruiter from '../models/recruiter.model.js';
import { signMagicLinkToken, verifyMagicLinkToken, signSessionToken } from '../utils/jwt.util.js';
import { sendEmail } from '../utils/email.util.js';


export const inviteRecruiter = async (email, company) => {

  // block duplicate active invites
  const existingInvite = await RecruiterInvite.findOne({ email, used: false });
  if (existingInvite) {
    throw new Error('An active invite already exists for this email');
  }

  // sign the token, valid for 24 hours
  const token = signMagicLinkToken(email, '24h');

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // now + 24h
  await RecruiterInvite.create({ email, token, expiresAt });

  const inviteUrl = `${process.env.CLIENT_URL}/auth/recruiter/verify?token=${token}`;

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

  const loginUrl = `${process.env.CLIENT_URL}/auth/recruiter/verify?token=${token}`;

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

  // mark invite as used, link cannot be clicked again
  const invite = await RecruiterInvite.findOneAndUpdate(
    { email: payload.email, used: false },
    { used: true },
    { new: true }
  );
  const recruiter = await Recruiter.findOne({ email: payload.email });

  if (!invite && !recruiter) {
    // No invite record and no account
    throw new Error('Invalid invite');
  }

  if (!invite && recruiter) {
    // No invite record
    const sessionToken = signSessionToken({
      sub: recruiter._id,
      role: 'recruiter',
    });
    return { sessionToken, recruiter };
  }

  // update and insert the recruiter account
  // if the recruiter already exists nothing gets overwritten
  const update_insertRecruiter = await Recruiter.findOneAndUpdate(
    { email: payload.email },
    {
      $setOnInsert: {
        email: payload.email,
        company: invite.company,
        name: 'Pending',       
        designation: 'other',  
        isOnboarded: false,
      },
    },
    { upsert: true, new: true }
  );

  // issue a session token
  const sessionToken = signSessionToken({
    sub: update_insertRecruiter._id,
    role: 'recruiter',
  });

  return { sessionToken, recruiter: update_insertRecruiter };
};