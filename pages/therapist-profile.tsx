import Head from 'next/head';
import React from 'react';
import styles from '@/styles/profile.module.css'
import { LucideArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function TherapistProfile() {

	const router = useRouter();

	return (
		<>
		<Head>
			<title>
				Apply for Therapist
			</title>
		</Head>
		<div className={styles.card}>
		<div className={styles.row}>
			<div style={{display:  'flex', alignItems: 'center', cursor: 'pointer', flexDirection: 'column',justifyContent: 'center', alignSelf:  'flex-start', marginTop: '2px', marginLeft: '10px', width: '30px'}} onClick={() => router.replace('/profile')}>
				<LucideArrowLeft></LucideArrowLeft>
			</div>
		<div className={styles.titles}>
			Mental Health Reports
		</div>
		<div style={{width: '40px'}}></div>
		</div>
		</div>
		

		<div className={styles.card}>
		Attention therapists! Want to grow your practice and connect with more clients? Our web app can help. Fill out the form below to connect with and start receiving new client leads every month. Let us help you take your therapy practice to the next level!
		</div>

		<br />

		<div className={`${styles.card} ${styles.contact}`}>
<form className={styles.forms} action="https://formsubmit.co/hamzasaidu34@gmail.com" method="post" autoComplete="off">
		
	<label className={styles.label} htmlFor="name" >Your Name</label>
	<input type="text" name="name" className={styles.input} placeholder="Your Name" required />

	<label className={styles.label} htmlFor="email">Email</label>
	<input type="email" className={styles.input} name="email" placeholder="Email" required />

	<input className={styles.input} type="submit" value="Submit" />

</form>
</div>

		</>
	)
}