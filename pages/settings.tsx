import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import auth from '@/firebase/detectSignin';
import styles from '@/styles/profile.module.css'
import { LucideArrowLeft, LucideSettings } from 'lucide-react';

export default function Settings() {


	interface User {
		uid: string;
		email: string | null;
		displayName: string | null;
		photoURL: string | null;
		emailVerified: boolean;
		phoneNumber: string | null;
		isAnonymous: boolean;
		tenantId: string | null;
		providerData: any[];
	  }

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const getUser = async () => {
	  const currentUser = await auth.isLoggedIn();
	  console.log('User object:', currentUser);
	  setUser(currentUser);
	  setIsLoading(false);
	};
	getUser();
  
	if (!user) {
	  return;
	}
  
	const checkAuthentication = async () => {
	  try {
		await auth.isLoggedIn();
	  } catch (error) {
		router.replace('/login');
	  } 
	};
	checkAuthentication();
  }, [user]);
  
  



  const handleLogout = async () => {
	try {
	  await firebase.auth().signOut();
	  router.push('/login');
	} catch (error) {
	  console.error(error);
	}
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

	return (
		<>
		<Head>
			<title>
				Settings
			</title>
		</Head>

		<div className={styles.container}>
		<div className={styles.header}>
        {/*<img src="/logo.png" alt="Logo" />*/}
		<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
			<LucideArrowLeft onClick={() => router.replace("/profile")} />
        <div>
          <p>Settings</p>
          {/*<p>{(user as any)?.email ?? 'Unknown'}</p>*/}
        </div>
		</div>
        {/*<h1>Profile</h1>*/}
        {/*<button className={styles.signout_btn} onClick={handleLogout}>Log Out</button>*/}
      </div>
		</div>
		
		<div className={styles.container} style={{textAlign: 'center'}}>
			Signed in as  {(user as any)?.email ?? 'Unknown'}
		</div>

		<div className={styles.card} onClick={handleLogout}>
			Log Out
		</div>

		</>
	)
}