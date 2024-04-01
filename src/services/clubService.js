import { db } from "../firebaseConfig"
import { Timestamp, addDoc, arrayUnion, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { makeid } from "../helpers/misc";
import { getUserWithUsername } from "./authService";


export async function createClub(id, displayName, description, image, admin) {
  if (!image) {
    console.error('No image file provided');
    return;
  }
  const q = query(collection(db, "users"), where("uid", "==", admin));

  try {
    const storage = getStorage();
    const storageRef = ref(storage, `clubsLogos/${id}/${makeid(image.name.length)}`);
    const snapshot = await uploadBytes(storageRef, image);
    const snapshot2 = await getDocs(q);

    const url = await getDownloadURL(snapshot.ref);

    const club = {
      uid: id,
      displayName,
      description,
      profilePicture: url,
      admin,
      members: [admin],
      posts: [],
      events: [],
      banned: [],
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, "clubs"), club);
    snapshot2.forEach((doc) => {
      const clubs = doc.data().clubs || [];
      const newClubs = [...clubs, id];
      updateDoc(doc.ref, { clubs: newClubs });
    });
    return club;
  } catch (error) {
    console.error("Error in createClub function:", error);
  }
}

export async function getClubWithID(id) {
  const q = query(collection(db, "clubs"), where("uid", "==", id));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      return club;
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function joinClubWithID(clubID, userID) {
  const q = query(collection(db, "users"), where("uid", "==", userID));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
      });
      const clubs = user.clubs || [];
      const newClubs = [...clubs, clubID];
      updateDoc(querySnapshot.docs[0].ref, { clubs: newClubs });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  const q2 = query(collection(db, "clubs"), where("uid", "==", clubID));
  try {
    const querySnapshot = await getDocs(q2);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      const members = club.members || [];
      const newMembers = [...members, userID];
      updateDoc(querySnapshot.docs[0].ref, { members: newMembers });
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function leaveClubWithID(clubID, userID) {
  const q = query(collection(db, "users"), where("uid", "==", userID));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
      });
      const clubs = user.clubs || [];
      const newClubs = clubs.filter((club) => club !== clubID);
      updateDoc(querySnapshot.docs[0].ref, { clubs: newClubs });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  const q2 = query(collection(db, "clubs"), where("uid", "==", clubID));
  try {
    const querySnapshot = await getDocs(q2);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      const members = club.members || [];
      const newMembers = members.filter((member) => member !== userID);
      updateDoc(querySnapshot.docs[0].ref, { members: newMembers });
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function createClubPost(clubID, author, data, type) {
  const id = makeid(author.length + 10);
  const post = {
    id,
    author,
    data,
    type,
    clubID,
    createdAt: Timestamp.now(),
    comments: [],
    likes: [],
    views: 0,
  };

  try {
    await addDoc(collection(db, "posts"), post);

    const userQuery = query(collection(db, "clubs"), where("uid", "==", clubID));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userRef = querySnapshot.docs[0].ref;

      try {
        await updateDoc(userRef, {
          posts: arrayUnion(id),
        });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      console.log("No user found with the provided UID");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }

  return post;
}


export async function editClubSettings(uid, displayName, description, profilePicture) {
  const q = query(collection(db, "clubs"), where("uid", "==", uid));
  try {
    if (profilePicture) {
      const storage = getStorage();
      const storageRef = ref(storage, `clubsLogos/${uid}/${makeid(profilePicture.name.length)}`);
      const snapshot = await uploadBytes(storageRef, profilePicture);
      const url = await getDownloadURL(snapshot.ref);
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { displayName, description, profilePicture: url });
        });
      }
    } else {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { displayName, description });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function kickMember(clubID, username) {
  const user = await getUserWithUsername(username);
  const q = query(collection(db, "users"), where("username", "==", username));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
      });
      const clubs = user.clubs || [];
      const newClubs = clubs.filter((club) => club !== clubID);
      updateDoc(querySnapshot.docs[0].ref, { clubs: newClubs });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  const q2 = query(collection(db, "clubs"), where("uid", "==", clubID));
  try {
    const querySnapshot = await getDocs(q2);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      const members = club.members || [];
      const newMembers = members.filter((member) => member !== user?.uid);
      updateDoc(querySnapshot.docs[0].ref, { members: newMembers });
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function banMember(clubID, username) {
  await kickMember(clubID, username);
  const user = await getUserWithUsername(username);
  const q = query(collection(db, "clubs"), where("uid", "==", clubID));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      const banned = club.banned || [];
      const newBanned = [...banned, user?.uid];
      updateDoc(querySnapshot.docs[0].ref, { banned: newBanned });
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}

export async function unbanMember(clubID, username) {
  const user = await getUserWithUsername(username);
  const q = query(collection(db, "clubs"), where("uid", "==", clubID));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let club;
      querySnapshot.forEach((doc) => {
        club = doc.data();
      });
      const banned = club.banned || [];
      const newBanned = banned.filter((member) => member !== user?.uid);
      updateDoc(querySnapshot.docs[0].ref, { banned: newBanned });
    }
  } catch (error) {
    console.error("Error fetching club:", error);
  }
}
export async function deleteClubPost(postId, clubId) {

  const postQuery = query(collection(db, "posts"), where("id", "==", postId));
  const postQuerySnapshot = await getDocs(postQuery);

  if (postQuerySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = postQuerySnapshot.docs[0];
  await deleteDoc(postDoc.ref);

  const clubQuery = query(collection(db, "clubs"), where("uid", "==", clubId));
  const clubQuerySnapshot = await getDocs(clubQuery);

  if (!clubQuerySnapshot.empty) {
    const clubRef = clubQuerySnapshot.docs[0].ref;

    try {
      await updateDoc(clubRef, {
        posts: clubQuerySnapshot.docs[0].data().posts.filter((id) => id !== postId),
      });
    } catch (error) {
      console.error("Error updating club:", error);
    }
  }
  return { id: postDoc.id };
}
