import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    User as FirebaseUser,
    ConfirmationResult
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from '../types';

// IMPORTANT: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE || "AIzaSy_PLACEHOLDER_API_KEY",
  authDomain: process.env.AUTH_DOMAIN_FIREBASE || "your-project-id.firebaseapp.com",
  projectId: process.env.PROJECT_ID_FIREBASE || "your-project-id",
  storageBucket: process.env.STORAGE_BUCKET_FIREBASE || "your-project-id.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID_FIREBASE || "your-sender-id",
  appId: process.env.APP_ID_FIREBASE || "your-app-id"
};

// Warn the developer if they are using placeholder credentials
if (firebaseConfig.apiKey === "AIzaSy_PLACEHOLDER_API_KEY") {
    console.warn(
        "Firebase configuration is not set. The application is using placeholder credentials. " +
        "Please provide your Firebase project's configuration in the environment variables to enable authentication and database features."
    );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Authentication Functions ---

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const setupRecaptcha = (elementId: string) => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        'size': 'invisible',
        'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });
    return (window as any).recaptchaVerifier;
};


export const sendOtp = (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const verifyOtp = (confirmationResult: ConfirmationResult, otp: string) => {
    return confirmationResult.confirm(otp);
}

// --- Firestore User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfile;
    }
    return null;
};

export const createUserProfile = async (user: FirebaseUser, username: string): Promise<UserProfile> => {
    const userDocRef = doc(db, "users", user.uid);
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    const newUserProfile: UserProfile = {
        uid: user.uid,
        name: capitalizedUsername,
        avatar: capitalizedUsername.charAt(0) || '👤',
        email: user.email,
        phone: user.phoneNumber
    };
    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
};
