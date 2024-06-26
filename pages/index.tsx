import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { SearchDialog } from '@/components/SearchDialog'
import { SearchResult } from '@/components/SearchResult'

import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js OpenAI Template</title>
        <meta
          name="description"
          content="Next.js Template for building OpenAI applications with Supabase."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          {/* <SearchDialog /> */}
          <SearchResult />
        </div>

        <div className="py-8 w-full flex items-center justify-center space-x-6">
          <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
            <Link href="https://airion.co.jp/" className="flex items-center justify-center">
              <p className="text-base mr-2">Airion株式会社</p>
              <Image src={'/airion.png'} width="20" height="20" alt="Airion logo" />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
