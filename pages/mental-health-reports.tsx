import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/profile.module.css';
import Bottombar from '@/components/bottombar';
import firebase from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import auth from '@/firebase/detectSignin';
import { LucideArrowLeft } from 'lucide-react';

export default function mhr() {

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

	interface QuizResult {
		date: string;
		copingStrategies: number;
		appetite: number;
		relationships: number;
		energy: number;
		sleep: number;
		sentiment: number;
		mhScore: number;
	}

	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [latestQuizResult, setLatestQuizResult] = useState<QuizResult[] | null>(null);

	useEffect(() => {
		const getUser = async () => {
			const currentUser = await auth.isLoggedIn();
			console.log('User object:', currentUser);
			setUser(currentUser);
		};
		getUser();
	}, []);

	useEffect(() => {
		const getLatestQuizResults = async () => {
			try {
				if (!latestQuizResult) {


					const latestResultsRef = firebase.firestore().collection('users').doc(user?.uid).collection('caress-results')
						.orderBy('date', 'desc')
						.limit(5);

					const snapshot = await latestResultsRef.get();

					const latestResults = snapshot.docs.map(doc => doc.data() as QuizResult);

					// Set state to the latest quiz results, or null if the array is empty
					setLatestQuizResult(latestResults.length > 0 ? latestResults : null);
				}
			}
			catch (error) {
				console.log('Error getting latest quiz results:', error);
				setLatestQuizResult(null);
			}
		};

		if (user) {
			getLatestQuizResults();
		}
	}, [user]);



	return (
		<>
			<Head>
				<title>
					Mental Health Reports
				</title>
			</Head>
			<br />
			<div className={styles.row}>
				<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexDirection: 'column', justifyContent: 'center', alignSelf: 'flex-start', marginTop: '2px', marginLeft: '10px', width: '30px' }} onClick={() => router.replace('/profile')}>
					<LucideArrowLeft></LucideArrowLeft>
				</div>
				<div className={styles.titles}>
					Mental Health Reports
				</div>
				<div style={{ width: '40px' }}></div>
			</div>

			{latestQuizResult?.map((result, index) => (
				<div key={index}>
					<div className={styles.card}>
						<div className={styles.columns}>
							<div className={styles.mh}>
								{result.date}
							</div>
							<div className={styles.scores}>
								<ul className={styles.my_list}>
									<li className={styles.lis}>Coping Strategies and Self-Care: {result.copingStrategies}</li>
									<li className={styles.lis}>Appetite and Eating Habits: {result.appetite}</li>
									<li className={styles.lis}>Relationships and Social Support: {result.relationships}</li>
									<li className={styles.lis}>Energy and Motivation: {result.energy}</li>
									<li className={styles.lis}>Sleep: {result.sleep}</li>
									<li className={styles.lis}>Sentiment: {result.sentiment}</li>
									<li className={styles.lis}>Overall: {result.mhScore}/100</li>
								</ul>
							</div>
						</div>
					</div>
					<br />
				</div>
			))}

		</>
	)
}