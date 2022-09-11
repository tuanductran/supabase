# whatsapp-cloud-api

## NOTE: WIP does not yet work on Supabase Edge Functions

Try it out: https://wa.me/15550464302

![demo](./demo.gif)

## Setup env vars

- `cp supabase/.env.local.example supabase/.env.local`

## Test locally

- `supabase functions serve --no-verify-jwt whatsapp-cloud-api --env-file ./supabase/.env.local`

## Deploy

- `supabase functions deploy --no-verify-jwt whatsapp-cloud-api`
- `supabase secrets set --env-file ./supabase/.env.local`

## Helpful resources

- https://developers.facebook.com/docs/whatsapp/cloud-api/overview
- https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- https://business.facebook.com/wa/manage/message-templates
- https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks
- https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#1--acquire-an-access-token-using-a-system-user-or-facebook-login
