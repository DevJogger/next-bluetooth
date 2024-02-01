"use client"
import React, { useState, useRef } from "react"

const SERVICE_UUID = "00001623-1212-efde-1623-785feabcd123"
const CHARACTERISTIC_UUID = "00001624-1212-efde-1623-785feabcd123"
const SUBSCRIBE_IMU_COMMAND = [10, 0, 65, 0, 0, 5, 0, 0, 0, 1]
const SUBSCRIBE_RGB_COMMAND = [10, 0, 65, 1, 1, 5, 0, 0, 0, 1]

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [rgb, setRgb] = useState<string>('rgb(33, 33, 33)')
  const serverRef = useRef<BluetoothRemoteGATTServer | null>(null)

  const onDisconnected = (event: Event) => {
    setIsConnected(false)
    const device = event.target as BluetoothDevice
    device.removeEventListener("gattserverdisconnected", onDisconnected)
  }

  const handleNotification = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic
    const arrayBuffer = characteristic.value?.buffer
    if (!!arrayBuffer) {
      const uint8Array = new Uint8Array(arrayBuffer)
      const regularArray = Array.from(uint8Array)
      const rgb = regularArray.slice(4)
      const [r, g, b] = rgb
      setRgb(`rgb(${r}, ${g}, ${b})`)
    }
  }

  const handleButtonClick = () => {
    if (isConnected && serverRef.current) {
      serverRef.current.disconnect()
      return
    } else {
      navigator.bluetooth
        .requestDevice({
          filters: [{ namePrefix: "LEGO", services: [SERVICE_UUID] }]
        })
        .then((device) => {
          device.addEventListener("gattserverdisconnected", onDisconnected)
          return device.gatt?.connect()
        })
        .then((server) => {
          if (!!server) serverRef.current = server
          setIsConnected(true)
          return server?.getPrimaryService(SERVICE_UUID)
        })
        .then((service) => {
          return service?.getCharacteristic(CHARACTERISTIC_UUID)
        })
        .then((characteristic) => {
          characteristic?.startNotifications()
          characteristic?.addEventListener(
            "characteristicvaluechanged",
            handleNotification
          )
          return characteristic?.writeValue(
            new Uint8Array(SUBSCRIBE_RGB_COMMAND)
          )
        })
        .catch((error: unknown) => {
          console.log(error)
        })
    }
  }
  return (
    <main
      className="grid h-screen place-items-center bg-stone-950"
      style={
        {
          "--rgb": `${rgb}`,
          "background-color": "var(--rgb)"
        } as React.CSSProperties
      }
    >
      <h1
        className={`cursor-pointer rounded-full px-10 py-4 text-xl font-bold transition-all hover:-translate-y-1 ${isConnected ? "bg-green-500" : "bg-amber-500"}`}
        onClick={handleButtonClick}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </h1>
    </main>
  )
}
