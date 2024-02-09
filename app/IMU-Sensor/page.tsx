"use client"
import React, { useState, useRef, useMemo, useEffect } from "react"

const SERVICE_UUID = "00001623-1212-efde-1623-785feabcd123"
const CHARACTERISTIC_UUID = "00001624-1212-efde-1623-785feabcd123"
const SUBSCRIBE_IMU_COMMAND = [10, 0, 65, 0, 0, 1, 0, 0, 0, 1]

export default function ImuSensor() {
  const [isConnected, setIsConnected] = useState(false)
  const [xzy, setXzy] = useState([0, 0, 0])
  const serverRef = useRef<BluetoothRemoteGATTServer | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const xAxis = useMemo(() => xzy[0], [xzy])
  const yAxis = useMemo(() => xzy[2], [xzy])
  const zAxis = useMemo(() => xzy[1], [xzy])

  useEffect(() => {
    iframeRef.current?.focus();
  }, [])

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
      setXzy(regularArray.slice(4))
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
            new Uint8Array(SUBSCRIBE_IMU_COMMAND)
          )
        })
        .catch((error: unknown) => {
          console.log(error)
        })
    }
  }
  return (
    <main
      className="flex flex-col gap-16 justify-center h-screen place-items-center bg-stone-950"
    >
      <iframe ref={iframeRef} className="w-[1200px] h-[464px]" loading="lazy" src="/PlayMarioHTML5/index.html"></iframe>
      <h1
        className={`cursor-pointer rounded-full px-10 py-4 text-xl font-bold transition-all hover:-translate-y-1 ${isConnected ? "bg-green-500" : "bg-amber-500"}`}
        onClick={handleButtonClick}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </h1>
    </main>
  )
}
