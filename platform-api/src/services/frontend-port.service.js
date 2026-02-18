let currentFrontendPort = 8080;

export function getNextFrontendPort() {
  currentFrontendPort += 1;
  return currentFrontendPort;
}
