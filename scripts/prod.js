const run = async () => {
  const spawnOptions = {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }

  const processes = [
    Bun.spawn(["echo", 'Running on Bun version:'], spawnOptions),
    Bun.spawn(["bun", "-v"], spawnOptions),
    Bun.spawn(["bun", "run", "src/server/index.js"], spawnOptions),
  ]

  process.on("SIGINT", async () => {
    console.log("Cleaning up...")
    processes.forEach(proc => {
      proc.kill(0)
    })
    console.log("Server shut down")
  })
}

run()
