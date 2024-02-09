import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lego Mario Color Sensor",
  description: "Play with the Lego Mario Color Sensor"
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
