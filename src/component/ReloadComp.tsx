'use client'
import { useRouter } from 'next/navigation'

export async function Reloadbutton() {
  const router = useRouter(); 
  return (
    <button type="button" onClick={() => router.refresh()}>
      begin
    </button>
  )
}