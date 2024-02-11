import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { fireStore } from "lib/firebase/client";
import Home from "lib/pages/home";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import { UserProfile } from "../../lib/models/user-profile";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const activityRef = collection(fireStore, "activity");

  const q = query(activityRef);
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    if (doc) {
      data.push({ id: doc.id, ...doc.data() });
    }
  });

  const fetchUserProfile = async (): Promise<UserProfile> => {
    try {
      console.log("laoding user profile", user.uid);

      const response = await fetch(
        `/api/users/get-user?${new URLSearchParams({
          uid: user.uid,
        })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response status: ", response.status);

      if (response.status === 200) {
        const profile = await response.json();
        console.log("profile ", profile);

        return profile;
      } else {
        console.log("user profile not found");
      }
    } catch (error) {
      throw error;
    }
  };

  const userProfile = fetchUserProfile();
  console.log(userProfile);
  debugger;
  return {
    props: {
      activityData: [...data].sort(),
      //profile: userProfile,
    },
  };
}

const HomePage = ({ activityData }) => {
  return <Home activities={activityData} userProfile={false} />;
};

export default HomePage;
