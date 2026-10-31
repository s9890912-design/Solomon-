// =====================================
// MYWHATSAPP - FIREBASE AUTHENTICATION
// =====================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =====================================
// FIREBASE CONFIGURATION
// =====================================

const firebaseConfig = {
    apiKey: "AIzaSyCQUnCq-OVtdDTafupKvob_ld_IveKVM5M",
    authDomain: "mywhatsapp-a3d19.firebaseapp.com",
    projectId: "mywhatsapp-a3d19",
    storageBucket: "mywhatsapp-a3d19.firebasestorage.app",
    messagingSenderId: "440762464784",
    appId: "1:440762464784:web:f7bc2ac95e82674b3fa895",
    measurementId: "G-Y3VYDDLBM6"
};


// =====================================
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// =====================================
// REGISTER NEW ACCOUNT
// =====================================

export async function registerUser(name, phone, email, password) {

    name = name.trim();
    phone = phone.trim();
    email = email.trim();

    if (!name || !phone || !email || !password) {
        throw new Error("Please complete all registration fields.");
    }

    if (password.length < 8) {
        throw new Error("Password must contain at least 8 characters.");
    }

    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = credential.user;

    try {

        // Set the user's display name.

        await updateProfile(user, {
            displayName: name
        });


        // Prepare both profile documents.

        const batch = writeBatch(db);


        // PRIVATE USER PROFILE

        batch.set(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            phone: phone,
            email: email,
            createdAt: serverTimestamp()

        });


        // PUBLIC SEARCHABLE PROFILE

        batch.set(doc(db, "publicProfiles", user.uid), {

            uid: user.uid,
            name: name

        });


        // Save both documents together.

        await batch.commit();

        return user;

    } catch (error) {

        console.error("Profile creation failed:", error);

        const profileError = new Error(
            "Your account was created, but profile setup failed. Please contact support before trying to register again."
        );

        profileError.code = "profile-setup-failed";

        throw profileError;
    }
}


// =====================================
// EMAIL LOGIN
// =====================================

export async function loginUser(email, password) {

    email = email.trim();

    if (!email || !password) {
        throw new Error("Please enter your email and password.");
    }

    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return credential.user;
}


// =====================================
// LOG OUT
// =====================================

export async function logoutUser() {

    await signOut(auth);

}


// =====================================
// MONITOR LOGIN STATUS
// =====================================

export { onAuthStateChanged };


// =====================================
// FRIENDLY ERROR MESSAGES
// =====================================

export function friendlyError(code) {

    const errors = {

        "auth/email-already-in-use":
            "This email address is already registered.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/weak-password":
            "Choose a stronger password.",

        "auth/invalid-credential":
            "Your email or password is incorrect.",

        "auth/user-not-found":
            "No account was found with these details.",

        "auth/wrong-password":
            "Your password is incorrect.",

        "auth/network-request-failed":
            "Check your internet connection.",

        "auth/operation-not-allowed":
            "Enable Email/Password in Firebase Authentication.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later.",

        "permission-denied":
            "Firebase Firestore denied access. Check your security rules.",

        "profile-setup-failed":
            "Your account was created, but profile setup failed. Please contact support."

    };

    return errors[code] || "Something went wrong. Please try again.";
}