'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation'


export function NavButtons(){
    const router = useRouter();

    return(
        <div>
            <button type="button" onClick={() => router.push('/ClientPage')}>
                Client run cyclotron
            </button>

            <button type="button" onClick={() => router.push('/ServerPage')}>
                Server run cyclotron
            </button>
        </div>
    )
}