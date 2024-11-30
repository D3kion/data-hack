import { connect } from "nats";

const servers = Bun.env.NATS_URL?.split(",") ?? "nats://localhost:4222";
const nc = await connect({ servers });

const srv = await nc.services.add({
  name: "vault-processing",
  version: "0.0.1",
  description: "Vault ETL processing routines",
});
srv.stopped.then((err) => {
  console.log(`service stopped ${err ? err.message : ""}`);
});

const plainGroup = srv.addGroup("plain")

plainGroup.addEndpoint("csv", {
    handler: (err, msg) => {
        if (err) {
            console.log(`error while parsing csv: ${err.message}`)
            // msg.respondError()
        }
    
        msg.respond("ok")
      },
      metadata: {
        schema: "input a JSON serialized JSON array, output the largest value",
      },
})

function decode(m:) {
    try {
      const a = m?.json();
      if (!Array.isArray(a)) {
        m?.respondError(400, "invalid payload");
        return null;
      }
      if (a?.length === 0) {
        m?.respondError(400, "no values provided");
        return null;
      }
      a.sort();
      return a;
    } catch (err) {
      m?.respondError(400, `unable to decode: ${err.message}`);
      return null;
    }
  }