"use client"

export default function Home() {
  const handleOnClickConnect = () => {
    navigator.bluetooth
      .requestDevice({ acceptAllDevices: true })
      .then((device) => device.gatt?.connect())
      .then((server) => {
        console.log(`server`, server)
      })
      .catch((error: unknown) => {
        console.error(error)
      })
  }
  return (
    <main className="grid h-screen place-items-center">
      <h1
        className="cursor-pointer rounded-full bg-amber-500 px-10 py-4 text-xl font-bold transition-all hover:-translate-y-2"
        onClick={handleOnClickConnect}
      >
        Connect
      </h1>
    </main>
  )
}
