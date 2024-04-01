import { db } from "../firebaseConfig"
import { Timestamp, addDoc, arrayUnion, collection, deleteDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { makeid } from "../helpers/misc";

export function getPostWithID(id, setPost) {
  if (id) {
    const q = query(collection(db, "posts"), where("id", "==", id));
    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setPost(doc.data());
        });
      } else {
        setPost(null);
      }
    }, (error) => {
      console.error("Error fetching post:", error);
    });
  }
}



export async function createPost(author, data, type) {
  const id = makeid(author.length + 10);
  const post = {
    id,
    author,
    data,
    type,
    createdAt: Timestamp.now(),
    comments: [],
    likes: [],
    views: 0,
  };

  try {
    await addDoc(collection(db, "posts"), post);

    const userQuery = query(collection(db, "users"), where("uid", "==", author));
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


export async function likePost(userId, postId) {
  const q = query(collection(db, "posts"), where("id", "==", postId));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = querySnapshot?.docs[0];
  await updateDoc(postDoc?.ref, {
    likes: [...(postDoc?.data()?.likes || []), userId],

  });

  return { id: postDoc?.id };
}

export async function unlikePost(userId, postId) {
  const q = query(collection(db, "posts"), where("id", "==", postId));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = querySnapshot?.docs[0];

  await updateDoc(postDoc?.ref, {
    likes: postDoc?.data()?.likes?.filter((id) => id !== userId),
  });

  return { id: postDoc?.id };
}

export async function incrementPostViews(id) {
  const q = query(collection(db, "posts"), where("id", "==", id));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = querySnapshot.docs[0];

  await updateDoc(postDoc.ref, {
    views: postDoc.data().views + 1,
  });

  return { id: postDoc.id };
}


export async function addComment(postId, comment, author) {
  const q = query(collection(db, "posts"), where("id", "==", postId));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = querySnapshot.docs[0];

  await updateDoc(postDoc.ref, {
    comments: [...postDoc.data().comments, { comment, author }],
  });

  return { id: postDoc.id };
}

export async function deleteUserPost(postId, authorId) {
  const q = query(collection(db, "posts"), where("id", "==", postId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No post found with the given ID");
  }

  const postDoc = querySnapshot.docs[0];
  await deleteDoc(postDoc.ref);

  const userQuery = query(collection(db, "users"), where("uid", "==", authorId));
  const userQuerySnapshot = await getDocs(userQuery);

  if (!userQuerySnapshot.empty) {
    const userRef = userQuerySnapshot.docs[0].ref;

    try {
      await updateDoc(userRef, {
        posts: userQuerySnapshot.docs[0].data().posts.filter((id) => id !== postId),
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
  return { id: postDoc.id };
}