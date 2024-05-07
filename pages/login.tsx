import styles from '@/styles/home.module.css'
import firebase from '@/firebase/clientApp';
import React, { useRef, useState, useEffect } from 'react';
import {
	AuthErrorCodes,
	getAuth,
	sendEmailVerification,
	updateProfile,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	confirmPasswordReset,
	connectAuthEmulator,
} from "firebase/auth";
import 'firebase/compat/auth';
import { useRouter } from 'next/router';
import auth from '@/firebase/detectSignin';
import Head from 'next/head';
import { ReactNotifications, Store } from 'react-notifications-component'


export default function Login() {

	const [showDropdown, setShowDropdown] = useState(false);
	const [showbool, setshowBool] = useState(true);
	const [input, setInput] = useState({ email: "", password: "", cpassword: " " });
	const [error, setError] = useState(null);


	const notify = (nTitle: string, typeEvent: string, context: string) => {
		Store.addNotification({
			title: `${nTitle}`,
			message: `${context}`,
			type: `${typeEvent}`, // 'success', 'info', 'warning'
			container: 'bottom-left',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: 3500 }
		});
	}

	const handleSignInWithPassword = (e) => {
		notify("Sign In", "info", "Signing in...")
		e.preventDefault();
		setError("");
		let email = e.target.elements.email.value.toLowerCase().trim();
		let password = e.target.elements.password.value;

		// sign in user
		signInWithEmailAndPassword(firebase.auth(), email, password)
			.then((userCredential) => {
				notify("LoggedIn", "success", "You have successfully logged in")
			})
			.catch((err) => {
				if (err.code) {
					setError(`${err.code.split('/').slice(-1)[0].split('-').join(' ')}`);
				} else {
					console.log(err.code);
				}
			});
	};

	// const handleConfirmPassword = (e) => {
	// 	e.preventDefault();
	// 	setError("");
	// 	let password = e.target.elements.password.value;
	// 	let cpassword = e.target.elements.cpassword.value;
	// 	if (password !== cpassword) {
	// 		setError("Passwords do not match");
	// 		notify("Error", "info", "Passwords do not match")
	// 		return;
	// 	};

	// 	// sign in user
	// 	confirmPasswordReset(firebase.auth(), email, password)
	// 		.then((userCredential) => {
	// 			notify("LoggedIn", "success", "You have successfully logged in")
	// 		})
	// 		.catch((err) => {
	// 			if (err.code) {
	// 				setError(`${err.code.split('/').slice(-1)[0].split('-').join(' ')}`);
	// 			} else {
	// 				console.log(err.code);
	// 			}
	// 		});
	// };



	const handlePasswordSignUp = (e) => {
		notify("Sign Up", "info", "Signing up user...")
		e.preventDefault();
		setError("");
		let email = e.target.elements.email.value.toLowerCase().trim();
		let password = e.target.elements.password.value;
		let cpassword = e.target.elements.cpassword.value;
		if (password !== cpassword) {
			setError("Passwords do not match");
			notify("Error", "info", "Passwords do not match")
			return;
		};

		const auth = getAuth()
		// creating a new user
		createUserWithEmailAndPassword(firebase.auth(), email, password)
			.then((userCredential) => {
				updateProfile(
					auth.currentUser, {
					displayName: email.split('@')[0],
					photoURL: "https://e7.pngegg.com/pngimages/605/198/png-clipart-computer-icons-avatar-avatar-web-design-heroes.png"
				}
				).then(() => {
					notify("Sign Up", "success", "You have successfully signed up")
					notify("Verification", "info", "Check your email for verification")
					sendEmailVerification(auth.currentUser)
						.then(() => {
							notify("Verification", "info", "Verification email sent, check your email")
						});
				}).catch((error) => {
					// An error occurred
					// ...
					notify("Error", "warning", "Something went wrong")
				});

			})
			.catch((err) => {
				if (err.code) {
					setError(`${err.code.split('/').slice(-1)[0].split('-').join(' ')}`);
				}
				if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
					setError("The password is too weak, use a stronger password");
				} else if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
					setError("The email address is already in use.");
				} else {
					console.log(err.code);
				}
			});

	};

	const scrollToBottom = () => {
		window.scrollTo({
			top: 10000,
			behavior: 'smooth',
		});
	};

	const toggleBool = () => {
		setshowBool(!showbool);
		setError("");
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
		setError("");
		if (!showDropdown) {
			scrollToBottom();
		}
	};

	const Loginn = (props) => {

		return (
			<div className={`${styles.formContainer} ${showDropdown ? styles.show : ''}`}>
				<form onSubmit={handleSignInWithPassword}>
					<h1>Sign In</h1>
					<p>Fill the form below to sign in.</p>
					<label htmlFor="email">Email</label>
					<input type="text" id="email"
						name="email"
						required
						autoComplete="true"
						placeholder="Enter email"
					/>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password"
						required
						autoComplete="true"
						placeholder="Enter password"
					/>
					{error ? <p className={`${styles.loginerr}`}>{error}</p> : null}
					<button type="submit">Log In</button>
				</form>
				<br />
				<p>Don't have an account? <a style={{ color: "blue" }} href="#" onClick={props.toggleBool}>Sign Up</a>.</p>
				<p>Forgot password ? <a style={{ color: "blue" }} href="#" onClick={() => { router.push('/forgotpass') }}>Reset</a>.</p>
			</div>
		)
	}


	// const ConfirmPassword = (props) => {

	// 	return (
	// 		<div className={`${styles.formContainer} ${showDropdown ? styles.show : ''}`}>
	// 			<form onSubmit={handleSignInWithPassword}>
	// 				<h1>Sign In</h1>
	// 				<p>Fill the form below to Reset Password</p>
	// 				<label htmlFor="password">Password</label>
	// 				<input type="password" id="password" name="password"
	// 					required
	// 					autoComplete="true"
	// 					placeholder="Enter password"
	// 				/>
	// 				<label htmlFor="cpassword">Confirm Password</label>
	// 				<input type="password" id="cpassword" name="cpassword"
	// 					required
	// 					autoComplete="true"
	// 					placeholder="Confirm password"
	// 				/>
	// 				<br />
	// 				{error ? <p className={`${styles.loginerr}`}>{error}</p> : null}
	// 				<button type="submit">Reset</button>
	// 			</form>
	// 			<br />
	// 			<p>Don't have an account? <a style={{ color: "blue" }} href="#" onClick={props.toggleBool}>Sign Up</a>.</p>
	// 		</div>
	// 	)
	// }

	const Register = (props) => {
		return (
			<div className={`${styles.formContainer} ${showDropdown ? styles.show : ''}`}>
				<form onSubmit={handlePasswordSignUp}>
					<h1>Sign Up</h1>
					<p>Fill the form below to create your account.</p>
					<label htmlFor="email" >Email</label>
					<input type="text" id="email" name="email"
						required
						autoComplete="true"
						placeholder="Enter email"
					/>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password"
						required
						autoComplete="true"
						placeholder="Enter password"
					/>
					<label htmlFor="cpassword">Confirm Password</label>
					<input type="password" id="cpassword" name="cpassword"
						required
						autoComplete="true"
						placeholder="Confirm password"
					/>
					<br />
					{error ? <p className={`${styles.loginerr}`}>{error}</p> : null}
					<button type="submit">Sign Up</button>
				</form>
				<br />
				<p>Already have an account? <a style={{ color: "blue" }} href="#" onClick={props.toggleBool}> Sign In</a>.</p>
			</div>
		)
	}

	const router = useRouter();

	auth.isSignedIn();

	const handleSignInWithFacebook = async () => {
		const auth = firebase.auth();
		const provider = new firebase.auth.FacebookAuthProvider();
		try {
			await auth.signInWithPopup(provider);
			notify("LoggedIn", "success", "You have successfully logged in")
		} catch (error) {
			console.error(error);
		}
	};

	const handleSignInWithGoogle = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			await firebase.auth().signInWithPopup(provider);
			notify("LoggedIn", "success", "You have successfully logged in")
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<ReactNotifications />
			<Head>
				<title>
					Login - Careness
				</title>
			</Head>
			<div className={styles.center}>
				<img src="/caress-login-0.png" alt="caress" className='login-jpg' />
			</div>
			<div>
				<div className="login-btns">
					<button className='login-btn' onClick={toggleDropdown}>
						<div className='btn-column'><img className='login-logo' src="login.png" alt="" height={25} /><p>Password Login</p></div>
					</button>
				</div>
				{showDropdown && (
					showbool ? <Loginn toggleBool={toggleBool} /> : <Register toggleBool={toggleBool} />
				)}
			</div>

			<div className="login-btns">
				<button className='login-btn' onClick={handleSignInWithGoogle}>
					<div className='btn-column'><img className='login-logo' src="google-logo-9808.png" alt="" height={25} /><p>Continue with Google</p></div>
				</button>
			</div>

			<div className="login-btns">
				<button className='login-btn' onClick={handleSignInWithFacebook}>
					<div className='btn-column'><img className='login-logo' src="facebook.png" alt="" height={25} /><p>Continue with Facebook</p></div>
				</button>
			</div>
			<br />
			<br />
		</>
	)
}