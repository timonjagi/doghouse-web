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
import Dashboard from "lib/pages/dashboard";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import { UserProfile } from "../../lib/models/user-profile";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const activityRef = collection(fireStore, "activity");

//   const q = query(activityRef);
//   const querySnapshot = await getDocs(q);
//   const data = [];
//   querySnapshot.forEach((doc) => {
//     if (doc) {
//       data.push({ id: doc.id, ...doc.data() });
//     }
//   });

//   debugger;
//   return {
//     props: {
//       activityData: [...data].sort(),
//     },
//   };
// }

// const DashboardPage = ({ activityData }) => {
//   return <Dashboard />;
// };

export default Dashboard;
