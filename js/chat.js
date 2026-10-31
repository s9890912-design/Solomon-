// =====================================
// MYWHATSAPP - CHAT SYSTEM
// =====================================

import { auth, db } from "./auth.js";

import {
    collection,
    doc,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAt,
    endAt,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =====================================
// SEARCH REGISTERED USERS
// =====================================

export async function searchUsers(searchText) {

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Please log in before searching for users.");
    }

    const searchName = searchText.trim();

    if (searchName.length < 2) {
        return [];
    }

    const usersRef = collection(db, "publicProfiles");

    const searchQuery = query(
        usersRef,
        orderBy("name"),
        startAt(searchName),
        endAt(searchName + "\uf8ff"),
        limit(20)
    );

    const snapshot = await getDocs(searchQuery);

    return snapshot.docs
        .map(document => document.data())
        .filter(user => user.uid !== currentUser.uid);
}


// =====================================
// FIND OR CREATE PRIVATE CONVERSATION
// =====================================

export async function getOrCreatePrivateChat(otherUserId) {

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Please log in first.");
    }

    if (!otherUserId || otherUserId === currentUser.uid) {
        throw new Error("Invalid conversation participant.");
    }

    const chatsRef = collection(db, "chats");

    const chatsQuery = query(
        chatsRef,
        where("participants", "array-contains", currentUser.uid)
    );

    const snapshot = await getDocs(chatsQuery);

    // Check whether a conversation already exists.

    for (const chatDocument of snapshot.docs) {

        const participants = chatDocument.data().participants;

        if (
            participants.length === 2 &&
            participants.includes(otherUserId)
        ) {
            return chatDocument.id;
        }
    }

    // Create a new private conversation.

    const newChat = await addDoc(chatsRef, {
        participants: [
            currentUser.uid,
            otherUserId
        ],
        createdAt: serverTimestamp()
    });

    return newChat.id;
}


// =====================================
// SEND MESSAGE
// =====================================

export async function sendMessage(chatId, messageText) {

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Please log in first.");
    }

    const text = messageText.trim();

    if (!text) {
        throw new Error("Message cannot be empty.");
    }

    if (text.length > 5000) {
        throw new Error("Message is too long.");
    }

    const messagesRef = collection(
        db,
        "chats",
        chatId,
        "messages"
    );

    await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: text,
        createdAt: serverTimestamp()
    });
}


// =====================================
// RECEIVE REAL-TIME MESSAGES
// =====================================

export function listenToMessages(chatId, callback, onError) {

    const messagesRef = collection(
        db,
        "chats",
        chatId,
        "messages"
    );

    const messagesQuery = query(
        messagesRef,
        orderBy("createdAt", "asc")
    );

    return onSnapshot(
        messagesQuery,

        snapshot => {

            const messages = snapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            callback(messages);
        },

        error => {

            console.error("Message listener error:", error);

            if (onError) {
                onError(error);
            }
        }
    );
}