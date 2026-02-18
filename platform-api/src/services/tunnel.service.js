import ngrok from "@ngrok/ngrok";

let tunnelUrl = null;

export async function startTunnel() {
  try {
    // Connect to the Nginx container's exposed port (80)
    const listener = await ngrok.forward({
      addr: 80,
      authtoken_from_env: false,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    tunnelUrl = listener.url();
    console.log(`🌍 Tunnel established: ${tunnelUrl}`);
    return tunnelUrl;
  } catch (err) {
    console.error("❌ Failed to start ngrok tunnel:", err.message);
    // Fallback to localhost if tunnel fails
    tunnelUrl = "http://localhost";
    return tunnelUrl;
  }
}

export function getTunnelUrl() {
  return tunnelUrl || "http://localhost";
}
