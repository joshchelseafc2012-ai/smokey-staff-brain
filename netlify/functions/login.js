// Authentication function with role support
// Supports: staff, owner, client roles
// In production, use Netlify Identity or a real auth service

const DEMO_CREDENTIALS = [
  {
    email: "staff@smokey.com",
    password: "staff123",
    name: "Jay",
    role: "staff",
    allowedBrains: ["staff"]
  },
  {
    email: "owner@smokey.com",
    password: "owner123",
    name: "Owner",
    role: "owner",
    allowedBrains: ["staff", "owner"]
  },
  {
    email: "client@smokey.com",
    password: "client123",
    name: "Client",
    role: "client",
    allowedBrains: ["client"]
  }
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

    // Find matching credentials (demo only - use real auth in production)
    const user = DEMO_CREDENTIALS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return user info with role and allowedBrains
    return new Response(
      JSON.stringify({
        user: {
          email: user.email,
          name: user.name,
          id: user.email,
          role: user.role,
          allowedBrains: user.allowedBrains
        }
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
