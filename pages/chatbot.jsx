import Head from 'next/head';
import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/chats.module.css';
import { LucideArrowLeft, LucideSend, LucideUser } from 'lucide-react';
import { useRouter } from 'next/router';
import firebase from '@/firebase/clientApp';
import { useCollectionData } from 'react-firebase-hooks/firestore';
// import { Query } from '@firebase/firestore';
import 'firebase/firestore';
import auth from '@/firebase/detectSignin';
import TextToSpeech from './utils/TextToSpeech';

export default function ChatBot() {
	// interface User {
	// 	uid: string;
	// 	email: string | null;
	// 	displayName: string | null;
	// 	photoURL: string | null;
	// 	emailVerified: boolean;
	// 	phoneNumber: string | null;
	// 	isAnonymous: boolean;
	// 	tenantId: string | null;
	// 	providerData: any[];
	//   }

	// const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const [user, setUser] = useState(null);
	const [formValue, setFormValue] = useState('');
	const dummy = useRef();
	const firestore = firebase.firestore();
	const messagesRef = firestore.collection('users').doc(user?.uid).collection('chatbot');
	const query = messagesRef.orderBy('createdAt').limitToLast(25);

	let [messages] = useCollectionData(query, { idField: 'id' });
	//messages = messages?.reverse();
	const [data, setData] = useState("");

	useEffect(() => {
		const authenticate = async () => {
			const currentUser = await auth.isLoggedIn();
			setUser(currentUser);
			return currentUser;
		}
		authenticate();
	}, []);

	useEffect(() => {
		dummy.current.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = async (e) => {
		e.preventDefault();

		const { uid, photoURL } = user;

		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL,
		});

		const newMessage = {
            message: formValue,
            sender: "user"
        }

        const newMessages = [...messages,newMessage];

		await processMessageToChatGPT(newMessages)

		// fetch('https://caress-chatbot-2.devansharora.repl.co/predict', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		'api-key': '0000000000',
		// 		'message': formValue
		// 	})
		// })
		// 	.then(response => response.json())
		// 	.then(async data => {
		// 		console.log(data.answer);
		// 		data = data.answer;
		// 		await messagesRef.add({
		// 			text: data,
		// 			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		// 			//uid,
		// 			//photoURL,
		// 		});
		// 	})
		// 	.then(
		// 		dummy.current.scrollIntoView({ behavior: 'smooth' })
		// 	)
		// 	.catch(error => {
		// 		console.error(error);
		// 	});

			//start
			async function processMessageToChatGPT(chatMessages){
				const API_KEY = `${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
				let apiMessages = chatMessages.map((messageObject)=>{
					let role="";
					if(messageObject.sender === "ChatGPT"){
						role = "assistant"
					}else{
						role = "user"
					}
					return (
						{role: role, content: messageObject.message}
					)
				});
		
				const systemMessage = {
					role: "system",
					content: "You are an AI Therayp Chatbot named TherapyBot, You are helpful, friendly, and nonjudgemntal, You are a good listener, You are a good friend, You are a good therapist, Do not respond with large messages with big lists, instead, try and respond with short, concise messages that are easy to undestand. Also, ask questions to guide the person.'"
				}
		
				const apiRequestBody = {
					"model": "gpt-3.5-turbo",
					"messages": [
						systemMessage,
						...apiMessages
					]
				}
		
				await fetch("https://api.openai.com/v1/chat/completions",{
					method: "POST",
					headers: {
						"Authorization": `Bearer ${API_KEY}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(apiRequestBody)
				})
				.then(response => response.json())
				.then(async data => {
					console.log(data);
					data = data.choices[0].message.content;
					await messagesRef.add({
						text: data,
						createdAt: firebase.firestore.FieldValue.serverTimestamp(),
						//uid,
						//photoURL,
					});
				})
				.then(
					dummy.current.scrollIntoView({ behavior: 'smooth' })
				)
				.catch(error => {
					console.error(error);
				});
			}

		setFormValue('');
		dummy.current.scrollIntoView({ behavior: 'smooth' });
	};

	const photoURL = user?.photoURL;

	function ChatMessage(props) {
		//const { text, uid } = props.message;
		const { text, uid, photoURL } = props.message;

		const messageClass = uid === user.uid ? styles.sent : styles.received;

		return (<>
			<div className={`${styles.message} ${messageClass}`}>
				{photoURL ? <img className={styles.img} src={photoURL} /> : <div className={styles.chatAvatars}> <LucideUser /> </div>}
				<p className={styles.text}>{text}</p>
			</div>
		</>)
	}

	return (
		<>
			<Head>
				<title>
					ThearpyBot
				</title>
			</Head>
			<div className={styles.headerr}>
				<div className={styles.icon}>
					<LucideArrowLeft onClick={()=>{router.replace("/chats"); router.reload()}} className={styles.arrow} />
					<div className={styles.chatAvatar}>
						<LucideUser />
					</div>
					<p className={styles.name}>TherapyBot</p>
				</div>
			</div>
			<div className={styles.messageArea}>
				{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
			</div>
			<span ref={dummy}></span>
			<form className={styles.form} onSubmit={sendMessage}>

				<input className={styles.input} value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message..." />

				<button className={styles.button} type="submit" disabled={!formValue}><LucideSend /></button>
			</form>
		</>
	)
}