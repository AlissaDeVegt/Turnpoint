'use client'
import { useRouter } from 'next/navigation'

export async function Testfunction() {
  const router = useRouter(); 
  return (
    <button type="button" onClick={() => router.refresh()}>
      refresh
    </button>
  )
}