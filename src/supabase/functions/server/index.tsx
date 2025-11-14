import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-749ca9a4/health", (c) => {
  return c.json({ status: "ok" });
});

// ========================================
// FLEET ROUTES
// ========================================

// Get all fleet vehicles
app.get("/make-server-749ca9a4/fleet", async (c) => {
  try {
    const fleet = await kv.getByPrefix("fleet:");
    return c.json({ success: true, data: fleet });
  } catch (error) {
    console.log(`Error fetching fleet: ${error}`);
    return c.json({ success: false, error: `Failed to fetch fleet: ${error}` }, 500);
  }
});

// Get single vehicle by ID
app.get("/make-server-749ca9a4/fleet/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const vehicle = await kv.get(`fleet:${id}`);
    
    if (!vehicle) {
      return c.json({ success: false, error: "Vehicle not found" }, 404);
    }
    
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.log(`Error fetching vehicle: ${error}`);
    return c.json({ success: false, error: `Failed to fetch vehicle: ${error}` }, 500);
  }
});

// Add or update a vehicle
app.post("/make-server-749ca9a4/fleet", async (c) => {
  try {
    const vehicle = await c.req.json();
    
    if (!vehicle.id) {
      return c.json({ success: false, error: "Vehicle ID is required" }, 400);
    }
    
    await kv.set(`fleet:${vehicle.id}`, vehicle);
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.log(`Error saving vehicle: ${error}`);
    return c.json({ success: false, error: `Failed to save vehicle: ${error}` }, 500);
  }
});

// Delete a vehicle
app.delete("/make-server-749ca9a4/fleet/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`fleet:${id}`);
    return c.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    console.log(`Error deleting vehicle: ${error}`);
    return c.json({ success: false, error: `Failed to delete vehicle: ${error}` }, 500);
  }
});

// Bulk add fleet vehicles (for initial seeding)
app.post("/make-server-749ca9a4/fleet/bulk", async (c) => {
  try {
    const vehicles = await c.req.json();
    
    if (!Array.isArray(vehicles)) {
      return c.json({ success: false, error: "Expected an array of vehicles" }, 400);
    }
    
    for (const vehicle of vehicles) {
      if (vehicle.id) {
        await kv.set(`fleet:${vehicle.id}`, vehicle);
      }
    }
    
    return c.json({ success: true, message: `${vehicles.length} vehicles saved`, count: vehicles.length });
  } catch (error) {
    console.log(`Error bulk saving vehicles: ${error}`);
    return c.json({ success: false, error: `Failed to bulk save vehicles: ${error}` }, 500);
  }
});

// ========================================
// OFFERS ROUTES
// ========================================

// Get all offers
app.get("/make-server-749ca9a4/offers", async (c) => {
  try {
    const offers = await kv.getByPrefix("offer:");
    return c.json({ success: true, data: offers });
  } catch (error) {
    console.log(`Error fetching offers: ${error}`);
    return c.json({ success: false, error: `Failed to fetch offers: ${error}` }, 500);
  }
});

// Get single offer by ID
app.get("/make-server-749ca9a4/offers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const offer = await kv.get(`offer:${id}`);
    
    if (!offer) {
      return c.json({ success: false, error: "Offer not found" }, 404);
    }
    
    return c.json({ success: true, data: offer });
  } catch (error) {
    console.log(`Error fetching offer: ${error}`);
    return c.json({ success: false, error: `Failed to fetch offer: ${error}` }, 500);
  }
});

// Add or update an offer
app.post("/make-server-749ca9a4/offers", async (c) => {
  try {
    const offer = await c.req.json();
    
    if (!offer.id) {
      return c.json({ success: false, error: "Offer ID is required" }, 400);
    }
    
    await kv.set(`offer:${offer.id}`, offer);
    return c.json({ success: true, data: offer });
  } catch (error) {
    console.log(`Error saving offer: ${error}`);
    return c.json({ success: false, error: `Failed to save offer: ${error}` }, 500);
  }
});

// Delete an offer
app.delete("/make-server-749ca9a4/offers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`offer:${id}`);
    return c.json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.log(`Error deleting offer: ${error}`);
    return c.json({ success: false, error: `Failed to delete offer: ${error}` }, 500);
  }
});

// Bulk add offers (for initial seeding)
app.post("/make-server-749ca9a4/offers/bulk", async (c) => {
  try {
    const offers = await c.req.json();
    
    if (!Array.isArray(offers)) {
      return c.json({ success: false, error: "Expected an array of offers" }, 400);
    }
    
    for (const offer of offers) {
      if (offer.id) {
        await kv.set(`offer:${offer.id}`, offer);
      }
    }
    
    return c.json({ success: true, message: `${offers.length} offers saved`, count: offers.length });
  } catch (error) {
    console.log(`Error bulk saving offers: ${error}`);
    return c.json({ success: false, error: `Failed to bulk save offers: ${error}` }, 500);
  }
});

// ========================================
// LEADS ROUTES
// ========================================

// Get all leads
app.get("/make-server-749ca9a4/leads", async (c) => {
  try {
    const leads = await kv.getByPrefix("lead:");
    // Sort by timestamp (newest first)
    const sortedLeads = leads.sort((a: any, b: any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return c.json({ success: true, data: sortedLeads });
  } catch (error) {
    console.log(`Error fetching leads: ${error}`);
    return c.json({ success: false, error: `Failed to fetch leads: ${error}` }, 500);
  }
});

// Get single lead by ID
app.get("/make-server-749ca9a4/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const lead = await kv.get(`lead:${id}`);
    
    if (!lead) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    
    return c.json({ success: true, data: lead });
  } catch (error) {
    console.log(`Error fetching lead: ${error}`);
    return c.json({ success: false, error: `Failed to fetch lead: ${error}` }, 500);
  }
});

// Create a new lead (contact form submission, booking inquiry, etc.)
app.post("/make-server-749ca9a4/leads", async (c) => {
  try {
    const leadData = await c.req.json();
    
    // Generate ID if not provided
    const id = leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const lead = {
      ...leadData,
      id,
      timestamp: leadData.timestamp || new Date().toISOString(),
      status: leadData.status || 'new'
    };
    
    await kv.set(`lead:${id}`, lead);
    return c.json({ success: true, data: lead });
  } catch (error) {
    console.log(`Error creating lead: ${error}`);
    return c.json({ success: false, error: `Failed to create lead: ${error}` }, 500);
  }
});

// Update lead status
app.put("/make-server-749ca9a4/leads/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    
    const lead = await kv.get(`lead:${id}`);
    if (!lead) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    
    const updatedLead = { ...lead, status, updatedAt: new Date().toISOString() };
    await kv.set(`lead:${id}`, updatedLead);
    
    return c.json({ success: true, data: updatedLead });
  } catch (error) {
    console.log(`Error updating lead status: ${error}`);
    return c.json({ success: false, error: `Failed to update lead status: ${error}` }, 500);
  }
});

// Delete a lead
app.delete("/make-server-749ca9a4/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`lead:${id}`);
    return c.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    console.log(`Error deleting lead: ${error}`);
    return c.json({ success: false, error: `Failed to delete lead: ${error}` }, 500);
  }
});

// ========================================
// STATISTICS ENDPOINT
// ========================================

app.get("/make-server-749ca9a4/stats", async (c) => {
  try {
    const fleet = await kv.getByPrefix("fleet:");
    const offers = await kv.getByPrefix("offer:");
    const leads = await kv.getByPrefix("lead:");
    
    return c.json({
      success: true,
      data: {
        totalVehicles: fleet.length,
        totalOffers: offers.length,
        totalLeads: leads.length,
        newLeads: leads.filter((l: any) => l.status === 'new').length,
      }
    });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ success: false, error: `Failed to fetch stats: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);