// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import sqlite3InitModule from './sqlite3.js'
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const mod = await sqlite3InitModule();
  const db = new mod.sqlite3.oo1.DB();

  try {
    db.exec([
      "create table t(a);",
      "insert into t(a) ",
      "values(10),(20),(30)"
    ]);

   const results = db.exec([
      "select * from t;"
    ], { returnValue: "resultRows"});

    console.log("results", results);

    return new Response(
      JSON.stringify(results),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ msg: e}),
      { headers: { "Content-Type": "application/json" }, status: 500},
    )
  } finally {
      db.close();
    }
  }, {port:  9000 })
