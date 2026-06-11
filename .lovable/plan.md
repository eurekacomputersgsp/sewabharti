## Why login is failing

Your admin account `workingboundries@gmail.com` was created and the `admin` role is correctly assigned, but the account's **email was never confirmed**. The backend rejects sign-in for unconfirmed emails, so the Sign In button just fails.

## Fix (one-time)

Run a migration that:
1. Marks `workingboundries@gmail.com` as email-confirmed in the auth system (sets `email_confirmed_at = now()`).
2. Enables **auto-confirm for email signups** going forward, so this never happens again (you said this is a single-admin-only app, no public signups, so auto-confirm is safe).

After this runs, refresh `/auth` and sign in with:
- Email: `workingboundries@gmail.com`
- Password: `SewaBharti@2026`

Then change the password from the admin panel.

## Note

I'll keep public admin signup disabled at the policy/trigger level — only this seeded admin will get the role.
