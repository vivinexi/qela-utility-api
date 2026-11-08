
import { Hono } from "hono";
import {
  paymentMiddleware,
  x402ResourceServer
} from "@x402/hono";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const app = new Hono();

const wallet = "0x8166206CBe9f11b5b059812Fd88C57f7F1f6622d";

const facilitator = new HTTPFacilitatorClient({
  url: "https://facilitator.xpay.sh"
});

const resourceServer = new x402ResourceServer(facilitator)
  .register("eip155:8453", new ExactEvmScheme());

const routes = {
  "GET /api": {
    accepts: [
      {
        scheme: "exact",
        price: "$0.001",
        network: "eip155:8453",
        payTo: wallet
      }
    ],
    description: "Qela Utility API access"
  }
};

app.use(paymentMiddleware(routes, resourceServer));

app.get("/", (c) => {
  return c.json({
    service: "Qela Utility API",
    status: "online",
    protocol: "x402",
    network: "Base Sepolia"
  });
});

app.get("/api", (c) => {
  return c.json({
    success: true,
    message: "Qela Utility API is working",
    timestamp: new Date().toISOString()
  });
});

export default app;
