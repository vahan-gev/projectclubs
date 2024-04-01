import { db } from "../firebaseConfig"
import { collection, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
import { getUser } from "./authService";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { makeid } from "../helpers/misc";

export async function getUserFriends(uid) {
  let friends = [];
  if (uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          friends = doc.data().friends;
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  return friends;
}

export async function checkIfFriend(uid1, uid2) {
  let friends = [];
  if (uid1) {
    const q = query(collection(db, "users"), where("uid", "==", uid1));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          friends = doc.data().friends;
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  return friends.includes(uid2);
}

export async function getUserPosts(uid) {
  let posts = [];
  if (uid) {
    const q = query(collection(db, "posts"), where("author", "==", uid), where("type", "==", "post"), orderBy("createdAt", "desc"));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return posts;
}


export async function removeFriendFromFirebase(uid1, uid2) {
  const q1 = query(collection(db, "users"), where("uid", "==", uid1));
  const q2 = query(collection(db, "users"), where("uid", "==", uid2));

  try {
    const batch = [];

    const snapshot1 = await getDocs(q1);
    snapshot1.forEach((doc) => {
      const friends = doc.data().friends;
      const newFriends = friends.filter((friend) => friend !== uid2);
      batch.push(updateDoc(doc.ref, { friends: newFriends }));
    });

    const snapshot2 = await getDocs(q2);
    snapshot2.forEach((doc) => {
      const friends = doc.data().friends;
      const newFriends = friends.filter((friend) => friend !== uid1);
      batch.push(updateDoc(doc.ref, { friends: newFriends }));
    });

    await Promise.all(batch);
  } catch (error) {
    console.error("Error updating friends list:", error);
  }
}

export async function addFriendRequest(uid1, uid2) {
  const q1 = query(collection(db, "users"), where("uid", "==", uid1));
  const q2 = query(collection(db, "users"), where("uid", "==", uid2));

  try {
    const batch = [];

    const snapshot1 = await getDocs(q1);
    snapshot1.forEach((doc) => {
      const friendRequests = doc.data().friendRequests || [];
      const newFriendRequests = friendRequests.filter((request) => request.to !== uid2);
      const requestObject = { by: uid1, to: uid2 };
      batch.push(updateDoc(doc.ref, { friendRequests: [...newFriendRequests, requestObject] }));
    });

    const snapshot2 = await getDocs(q2);
    snapshot2.forEach((doc) => {
      const friendRequests = doc.data().friendRequests || [];
      const newFriendRequests = friendRequests.filter((request) => request.to !== uid1);
      const requestObject = { by: uid1, to: uid2 };
      batch.push(updateDoc(doc.ref, { friendRequests: [...newFriendRequests, requestObject] }));
    });

    await Promise.all(batch);
  } catch (error) {
    console.error("Error sending friend requests:", error);
  }
}

export async function checkFriendRequestSent(uid1, uid2) {
  let friendRequests = [];
  if (uid1) {
    const q = query(collection(db, "users"), where("uid", "==", uid1));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          friendRequests = doc.data().friendRequests;
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  return friendRequests?.filter((request) => request.to === uid2).length > 0;
}

export async function addFriendToDatabase(uid1, uid2) {
  const q1 = query(collection(db, "users"), where("uid", "==", uid1));
  const q2 = query(collection(db, "users"), where("uid", "==", uid2));

  try {
    const batch = [];

    const snapshot1 = await getDocs(q1);
    snapshot1.forEach((doc) => {
      const friends = doc.data().friends || [];
      const newFriends = [...friends, uid2];
      batch.push(updateDoc(doc.ref, { friends: newFriends }));
    });

    const snapshot2 = await getDocs(q2);
    snapshot2.forEach((doc) => {
      const friends = doc.data().friends || [];
      const newFriends = [...friends, uid1];
      batch.push(updateDoc(doc.ref, { friends: newFriends }));
    });

    await Promise.all(batch);
  } catch (error) {
    console.error("Error updating friends list:", error);
  }
}

export async function removeFriendRequest(uid1, uid2) {
  const q1 = query(collection(db, "users"), where("uid", "==", uid1));
  const q2 = query(collection(db, "users"), where("uid", "==", uid2));

  try {
    const batch = [];

    const snapshot1 = await getDocs(q1);
    snapshot1.forEach((doc) => {
      const friendRequests = doc.data().friendRequests || [];
      const newFriendRequests = friendRequests.filter(request => !(request.by === uid1 && request.to === uid2));
      batch.push(updateDoc(doc.ref, { friendRequests: newFriendRequests }));
    });

    const snapshot2 = await getDocs(q2);
    snapshot2.forEach((doc) => {
      const friendRequests = doc.data().friendRequests || [];
      const newFriendRequests = friendRequests.filter(request => !(request.by === uid1 && request.to === uid2));
      batch.push(updateDoc(doc.ref, { friendRequests: newFriendRequests }));
    });

    await Promise.all(batch);
  } catch (error) {
    console.error("Error removing friend requests:", error);
  }
}

export async function getUserFriendRequests(user) {
  let friendRequests = [];

  if (user && Array.isArray(user.friendRequests)) {
    friendRequests = await Promise.all(
      user.friendRequests
        .filter(request => request.to === user.uid)
        .map(async request => {
          const toUser = await getUser(request.to);
          const byUser = await getUser(request.by);
          return { to: toUser, by: byUser };
        })
    );
  }

  return friendRequests;
}

export async function acceptRequest(uid1, uid2) {
  await addFriendToDatabase(uid1, uid2);
  await removeFriendRequest(uid2, uid1);
}

export async function getRecommendedFriends(user) {
  if (!user) {
    console.log('No such user!');
    return [];
  }

  const friends = user?.friends;
  let recommendedFriends = [];
  if (!friends) {
    return [];
  }
  for (let friendId of friends) {
    const friendFriends = await getUserFriends(friendId);
    friendFriends.forEach(friend => {
      if (!friends.includes(friend) && !recommendedFriends.includes(friend) && friend !== user?.uid) {
        recommendedFriends.push(friend);
      }
    })
  }
  return recommendedFriends;

}

export async function getRecommendedPosts(user) {
  if (!user) {
    console.log('No such user!');
    return [];
  }

  const friends = user?.friends;
  let posts = [];
  if (!friends || friends.length === 0) {
    return [];
  }

  try {
    for (let friendId of friends) {
      const friendPosts = await getUserPosts(friendId);
      if (friendPosts && Array.isArray(friendPosts)) {
        posts = posts.concat(friendPosts);
      }
    }


    posts.sort((a, b) => a.createdAt - b.createdAt);
  } catch (error) {
    console.error('Error while fetching or sorting posts:', error);
    return [];
  }

  return posts.reverse();
}


export async function editUserSettings(uid, displayName, username, bio, profilePicture) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  try {
    if (profilePicture) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${uid}/${makeid(profilePicture.name.length)}`);
      const snapshot = await uploadBytes(storageRef, profilePicture);
      const url = await getDownloadURL(snapshot.ref);
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { displayName, username, bio, profilePicture: url });
        });
      }
    } else {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { displayName, username, bio });
        });
      }
    }

  } catch (error) {
    console.error("Error fetching user:", error);
  }
}