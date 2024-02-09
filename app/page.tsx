import Link from "next/link"

export default function Home() {
  return (
    <main
      className="flex flex-col gap-4 h-screen items-center justify-center bg-stone-950"
    >
      <Link
        href="/Color-Sensor"
        className="cursor-pointer w-80 flex justify-center rounded-full px-10 py-4 text-xl font-bold transition-all hover:-translate-y-1 bg-cyan-500"
      >
        Lego Mario Color Sensor
      </Link>
      <Link
        href="/IMU-Sensor"
        className="cursor-pointer w-80 flex justify-center rounded-full px-10 py-4 text-xl font-bold transition-all hover:-translate-y-1 bg-purple-500"
      >
        Lego Mario IMU Sensor
      </Link>
    </main>
  )
}
