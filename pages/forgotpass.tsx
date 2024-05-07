import Head from 'next/head';
import styles from '@/styles/home.module.css'
import { LucideArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import {
    AuthErrorCodes,
    getAuth,
    sendPasswordResetEmail,
} from "firebase/auth";
import { ReactNotifications, Store } from 'react-notifications-component'
import firebase from '@/firebase/clientApp';
import React, { useState } from 'react';


export default function TherapistProfile() {

    const [error, setError] = useState(null);

    const notify = (nTitle: string, typeEvent: string, context: string) => {
        Store.addNotification({
            title: `${nTitle}`,
            message: `${context}`,
            type: `info`, // 'success', 'info', 'warning'
            container: 'bottom-left',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: { duration: 5000 }
        });
    }


    const handleForgotPassword = (e) => {
        e.preventDefault();
        setError("");

        let email = e.target.elements.email.value.toLowerCase().trim();
        e.target.elements.email.value = "";

        sendPasswordResetEmail(firebase.auth(), email)
            .then((userCredential) => {
                notify("Notification", "info", "Request Email Sent!");
                notify("Notification", "info", "Redirecting to Login!");
                setTimeout(function () {
                    router.push("/login");
                }, 2500);
                
            })
            .catch((err) => {
                if (err.code) {
                    setError(`${err.code.split('/').slice(-1)[0].split('-').join(' ')}`);
                } else {
                    console.log(err.code);
                }
            });
    };

    const router = useRouter();

    return (
        <>
            <Head>
                <title>
                    Forgot Password
                </title>
            </Head>

            <ReactNotifications />
            <div className={`${styles.formContainer}`}>
                <form onSubmit={handleForgotPassword}>
                    <h1>Forgot Password</h1>
                    <p>Fill the form below to Reset Password</p>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email"
                        name="email"
                        required
                        autoComplete="true"
                        placeholder="Enter email"
                    />
                    {error ? <p className={`${styles.loginerr}`}>{error}</p> : null}
                    <button type="submit">Submit</button>
                </form>
                <br />
            </div>
        </>
    )
}
