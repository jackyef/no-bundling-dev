const run = async () => {
  const spawnOptions = {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }

  const processes = [
    Bun.spawn(["bun", "run", "--watch", "src/server/index.js"], spawnOptions),
    Bun.spawn(["bunx", "@tailwindcss/cli", "-i", "./src/client/styles.css", "-o", "./src/server/stylesheets/output.css", "--watch"], spawnOptions)
  ]

  process.on("SIGINT", async () => {
    console.log("Cleaning up...")
    processes.forEach(proc => {
      proc.kill(0)
    })
    console.log("dev server shut down")
  })
}

run()
