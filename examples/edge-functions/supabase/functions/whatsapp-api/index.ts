// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

console.log(`Function "whatsapp-cloud-api" up and running!`)

const sendMessage = async ({to, template}: {template: Record<string, unknown>, to: string}) => {
  const body = { messaging_product: "whatsapp", to, type: "template", template  }

  const res = await fetch(`https://graph.facebook.com/v13.0/${Deno.env.get('WA_PHONE_NUMBER_ID')}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get('WA_ACCESS_TOKEN')}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
  return res
}

serve(async (req) => {
  if (req.method === 'GET') {
    // Handle Whatsapp webhook verification.
    const verify_token = Deno.env.get('WA_WEBHOOK_VERIFY_TOKEN')
    // Parse params from the webhook verification request.
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        return new Response(
          challenge,
          { headers: { "Content-Type": "text" } },
        )
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        return new Response(null, {status: 403})
      }
    }
  }

  if (req.method === 'POST') {
    const data = await req.json()
    console.log("req:", JSON.stringify(data, null, 2))

    const message = data.entry[0].changes[0].value.messages[0];
    const {from, type} = message;
    console.log(from)
    let text = '';
    if (type === 'text') text = message.text.body
    if (type === 'button') text = message.button.text

    let res: Record<string, unknown> = {}
    if (text === '/start') {
      res = await sendMessage({to: from, template: {name: "start", language: {code: "en_US"}}})
    }
    if (text === '/subscribe') {
      res = await sendMessage({to: from, template: {name: "welcome", language: {code: "en_US"}}})
    }
    if (text === '/unsubscribe') {
      res = await sendMessage({to: from, template: {name: "unsubscribe", language: {code: "en_US"}}})
    }

    return new Response(
      JSON.stringify(res),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  return new Response(null, {status: 403})
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
