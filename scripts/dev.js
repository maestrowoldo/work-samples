import net from "node:net";
import { spawn } from "node:child_process";

const DEFAULT_PORT = 3000;
const HOST = process.env.HOST || "0.0.0.0";
const MAX_PORT_ATTEMPTS = 100;

function parsePort(value) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535
    ? port
    : DEFAULT_PORT;
}

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" || error.code === "EACCES") {
        resolve(false);
        return;
      }

      reject(error);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, HOST);
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(
    `Nao foi encontrada uma porta livre entre ${startPort} e ${
      startPort + MAX_PORT_ATTEMPTS - 1
    }.`,
  );
}

const requestedPort = parsePort(process.env.PORT);
const port = await findAvailablePort(requestedPort);

if (port !== requestedPort) {
  console.log(`Porta ${requestedPort} ocupada. Iniciando Next.js na porta ${port}.`);
}

const nextDev = spawn("next", ["dev", "--hostname", HOST, "--port", String(port)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

nextDev.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

nextDev.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
