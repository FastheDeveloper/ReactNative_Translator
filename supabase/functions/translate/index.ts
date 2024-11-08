import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from "npm:openai";
import { corsHeaders } from '../_shared/cors.ts'
const openai = new OpenAI();
 
console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }


  const { input,from, to } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: `You are a language translator. You translate from ${from} to ${to}. You output only the translated text` },
        {
            role: "user",
            content: input,
        },
    ],
});

console.log(completion.choices[0].message);


  return new Response(
    JSON.stringify(completion.choices[0].message),
    { headers: { ...corsHeaders,"Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/translate' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
