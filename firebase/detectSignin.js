import react from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@/firebase/clientApp'

const isSignedIn = () => {
	const router = useRouter();
	const [user, loading, error] = useAuthState(firebase.auth());

	useEffect(() => {
		if (user) {
			router.replace('/home/');
		} else {
			router.replace('/login/');
	}
}, [user]);
}

const isSignedInForpfp = () => {
	const router = useRouter();
	const [user, loading, error] = useAuthState(firebase.auth());

	useEffect(() => {
		if (user) {
			//router.replace('/profile/');
		} else {
			router.replace('/login/');
		
	}
}, [user]);
}

const isLoggedIn = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        return reject('User is not logged in');
      }
    });
  });
};

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return { user };

}

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
};

export default { isSignedIn, isLoggedIn, useAuth, signOut, isSignedInForpfp };