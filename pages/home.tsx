import React, { useEffect, useState } from 'react';
import firebase from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import auth from '@/firebase/detectSignin'
import Head from 'next/head';
import TopBar from '@/components/topbar';
import Bottombar from '@/components/bottombar';
import styles from '@/styles/home.module.css';
import Link from 'next/link';
import {
	CircularProgressbar,
	buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css';


const MyCircularProgressBar = ({ initialPercentage, delay, nPercent, label }) => {
	const [percentage, setPercentage] = useState(initialPercentage);
	useEffect(() => {
		const timer = setTimeout(() => {
			setPercentage(nPercent);
		}, delay);

		return () => clearTimeout(timer);
	}, [delay]);

	let color = nPercent <= 20 ? "red" : nPercent <= 50 ? "orange" : "turquoise";

	return (
		<div>
			<div className={styles.progressbar}>
				<CircularProgressbar
					value={percentage}
					text={` ${percentage}%`}
					styles={buildStyles({
						textColor: `${color}`,
						pathColor: `${color}`,
						trailColor: "gold"
					})}
				/>
				<div className={styles.label}>{label}</div>
			</div>

		</div>
	);
};

const notify = (nTitle: string, typeEvent: string, context: string) => {
	Store.addNotification({
		title: `${nTitle}`,
		message: `${context}`,
		type: `${typeEvent}`, // 'success', 'info', 'warning'
		container: 'bottom-left', // Position of the notifications
		animationIn: ['animated', 'fadeIn'],
		animationOut: ['animated', 'fadeOut'],
		dismiss: { duration: 8000 } // Duration to display the notification
	});
}

export default function Home() {

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


	const [user, setUser] = useState<User | null>(null);
	const [latestQuizResult, setLatestQuizResult] = useState<QuizResult | null>(null);
	const [quizResultLoaded, setQuizResultLoaded] = useState<boolean>(false);
	const [emojiDone, setEmojiDone] = useState<boolean>(false);

	const router = useRouter();
	const handleLogout = async () => {
		try {
			await firebase.auth().signOut();
			router.push('/login');
		} catch (error) {
			console.error(error);
		}
	};

	const handleEmotionClick = async (emotion: string) => {
		firebase.firestore().collection('users').doc(user?.uid).collection('mood').doc(new Date().toDateString()).set({
			mood: emotion,
			date: new Date().toDateString()
		})

		setEmojiDone(true);
	}

	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				const currentUser = await auth.isLoggedIn();
				setUser(currentUser);
				if (currentUser) {
					const today = new Date().toDateString();
					if (emojiDone == false) {
						const emojiRef = firebase
							.firestore()
							.collection('users')
							.doc(currentUser.uid)
							.collection('mood').orderBy('date', 'asc').limit(1);
						const snapshot = await emojiRef.get();
						if (snapshot.empty) {
							setEmojiDone(false);
						}
						if (!snapshot.empty && snapshot.docs[0].data().date == today) {
							setEmojiDone(true);
						}

					}
					// Check if latest quiz result is already cached
					if (!latestQuizResult) {
						// Fetch the latest quiz result from Firestore
						const latestResultRef = firebase
							.firestore()
							.collection('users')
							.doc(currentUser.uid)
							.collection('caress-results')
							.orderBy('date', 'desc')
							.limit(1);

						const snapshot = await latestResultRef.get();

						if (!snapshot.empty) {
							const latestResult = snapshot.docs[0].data() as QuizResult;
							setLatestQuizResult(latestResult);
						}
					}
					setQuizResultLoaded(true);
				}
			} catch (error) {
				console.log('Error checking authentication:', error);
				router.replace('/login');
			}
		};

		checkAuthentication();
	}, [user]);

	useEffect(() => {
		if (user?.emailVerified === false) {
			notify("Verification", "warning", "Please verify your email for best experience, check your email to verify");
		}

	}, []);

	return (
		<>
			<ReactNotifications />
			<Head>
				<title>DashBoard</title>
			</Head>
			<TopBar />
			{/* <div className="login-btns">
			<button className='login-btn' onClick={handleLogout}>
				<div className='btn-column'><p>Log Out</p></div>
			</button>
		</div> */}
			<div className={styles.content}>
				<div className={styles.welcome}>
					Welcome Back 👋
				</div>
				{emojiDone == false && (
					<div className={styles.card}>
						<div className={styles.title}>How are you feeling today?</div>
						<div className={styles.emotions}>
							<div className={styles.emotion} onClick={() => handleEmotionClick('😀')}>
								<span role="img" aria-label="Happy">😀</span>
							</div>
							<div className={styles.emotion} onClick={() => handleEmotionClick('😔')}>
								<span role="img" aria-label="Sad">😔</span>
							</div>
							<div className={styles.emotion} onClick={() => handleEmotionClick('😡')}>
								<span role="img" aria-label="Angry">😡</span>
							</div>
							<div className={styles.emotion} onClick={() => handleEmotionClick('😴')}>
								<span role="img" aria-label="Sleepy">😴</span>
							</div>
						</div>
					</div>
				)}

				{quizResultLoaded && latestQuizResult && (
					<div className={styles.container}>
						<div className={styles.mh}>
							Your Previous Week Mental Health Report:
						</div>
						<div className={styles.columnprog}>
							<div className={styles.progress_circle}>
								<MyCircularProgressBar initialPercentage={0} delay={1000} nPercent={latestQuizResult.appetite} label={"Appetite"} />
							</div>
							<div className={styles.progress_circle}>
								<MyCircularProgressBar initialPercentage={0} delay={1000} nPercent={latestQuizResult.sleep} label={"Sleep"} />
							</div>
							<div className={styles.progress_circle}>
								<MyCircularProgressBar initialPercentage={0} delay={1000} nPercent={latestQuizResult.energy} label={"Motivation"} />
							</div>
							<div className={styles.progress_circle}>
								<MyCircularProgressBar initialPercentage={0} delay={1000} nPercent={latestQuizResult.relationships} label={"Relationship"} />
							</div>
							<div className={styles.progress_circle}>
								<MyCircularProgressBar initialPercentage={0} delay={1000} nPercent={60} label={"Overall"} />
							</div>
						</div>
					</div>
				)}


				{latestQuizResult && (
					<div className={styles.card}>
						<div className={styles.mh}>
							Not yet taken your weekly Mental Health Quiz?
						</div>
						<div>
							<Link className={styles.link} href="/quizes">
								Click here to take it now!
							</Link>
						</div>
					</div>

				)}

				<div className={styles.card}>
					<div className={styles.mh}>
						Not yet taken your Personality Quiz?
					</div>
					<div>
						<Link className={styles.link} href="/quizes">
							Click here to take it now!
						</Link>
					</div>
				</div>
			</div>

			<Bottombar />

		</>
	)
}

