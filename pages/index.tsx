import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import firebase from '@/firebase/clientApp'
import auth from '@/firebase/detectSignin';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	
	const router =  useRouter();

	useEffect(() => {
		const checkAuthentication = async () => {
		  try {
			const user = await auth.isLoggedIn();
			router.replace('/home/')
		  } catch (error) {
			router.replace('/login');
		  }
		};
	
		checkAuthentication();
	  }, []);
	
  return (
    <>
      <Head>
        <title>Caress App</title>
        <meta name="description" content="Taking care of your mind one step at a time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      </main>
    </>
  )
}
