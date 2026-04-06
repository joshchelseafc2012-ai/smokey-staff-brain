// Simple authentication function
// In production, use Netlify Identity instead

const DEMO_CREDENTIALS = [
  { email: "demo@smokey.com", password: "demo123", name: "Demo User" },
  { email: "manager@smokey.com", password: "manager123", name: "Manager" },
  { email: "barber@smokey.com", password: "barber123", name: "Barber Staff" },
];

export default async (req, context) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find matching credentials (demo only - use Netlify Identity in production)
    const user = DEMO_CREDENTIALS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return user info
    return new Response(
      JSON.stringify({
        user: {
          email: user.email,
          name: user.name,
          id: user.email, // Simple ID for now
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/login",
};
