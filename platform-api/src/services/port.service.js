let currentPort = 5000;

export function getNextPort() {
  currentPort += 1;
  return currentPort;
}
