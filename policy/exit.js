function getExitCode(decision) {
  switch (decision) {
    case "ALLOW":
      return 0;
    case "WARN":
      return 0;
    case "BLOCK":
      return 1;
    default:
      throw new Error("Unknown decision");
  }
}

module.exports = { getExitCode };