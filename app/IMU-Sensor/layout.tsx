import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lego Mario IMU Sensor",
  description: "Play with the Lego Mario Inertial Measurement Unit (IMU) Sensor"
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
