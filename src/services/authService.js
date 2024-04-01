import { useEffect, useState } from "react";
import { db } from "../firebaseConfig"
import { addDoc, collection, getDocs, query, where, onSnapshot } from "firebase/firestore"
export async function createUser(username, uid, displayName, email) {
  const defaultProfilePicture = 'https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png';
  const data = {
    username,
    uid,
    displayName,
    email,
    bio: "",
    profilePicture: defaultProfilePicture,
    role: "user",
    friends: [],
    friendRequests: [],
    clubs: [],
    chats: [],
    posts: [],
    verified: false
  };
  const docRef = await addDoc(collection(db, "users"), data);
  return { id: docRef.id, ...data };
}

export async function checkIfEmailExists(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function checkIfUsernameExists(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function getUser(uid) {
  if (!uid) return null;
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0].data();
}

export async function getUserWithUsername(username) {
  if (!username) return null;
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0].data();
}
export function useAuthentication() {
  const localUid = localStorage.getItem('uid');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localUid) {
      setUser(null);
      return;
    }

    const userQuery = query(collection(db, "users"), where("uid", "==", localUid));

    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser({ id: doc.id, ...doc.data() });
        });
      } else {
        setUser(null);
      }
    }, err => {
      console.error('Error fetching user:', err);
      setUser(null);
    });

    return () => unsubscribe();
  }, [localUid]);

  return user;
}