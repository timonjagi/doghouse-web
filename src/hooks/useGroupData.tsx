import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtoms";
import { Group, groupState, UserGroup } from "../atoms/groupsAtom";
import { auth, fireStore } from "../lib/firebase/client";

const useGroupData = () => {
  const [groupStateValue, setGroupStateValue] = useRecoilState(groupState);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveGroup = (groupData: Group, isJoined: boolean) => {
    // check if user is logged in
    // if not open auth modal

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveGroup(groupData.id);
      return;
    }
    joinGroup(groupData);
  };

  const getUserGroups = async () => {
    setLoading(true);

    try {
      const path = `users/${user?.uid}/groups`;
      const data = await getDocs(collection(fireStore, path));

      const userGroups = data.docs.map((doc) => ({
        ...doc.data(),
      }));

      setGroupStateValue((prev) => ({
        ...prev,
        userGroups: userGroups as UserGroup[],
      }));
    } catch (error: any) {
      console.log("getUserGroups error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinGroup = async (group: Group) => {
    setLoading(true);

    try {
      // add group to userCommunities for user
      const newUsergroup: UserGroup = {
        groupId: group.id,
        imageURL: group.imageURL || "",
      };
      const batch = writeBatch(fireStore);
      const usergroupDocRef = doc(
        fireStore,
        `users/${user?.uid}/groups`,
        group.id
      );
      batch.set(usergroupDocRef, newUsergroup);

      // update number of members of group
      const groupDocRef = doc(fireStore, "groups", group.id);
      batch.update(groupDocRef, { numberOfMembers: increment(1) });

      // batch write
      await batch.commit();

      // update recoil state - groupState.userCommunities
      setGroupStateValue((prev) => ({
        ...prev,
        userCommunities: [...prev.userGroups, newUsergroup],
      }));
    } catch (error: any) {
      console.log("Join group error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  const leaveGroup = async (groupId: string) => {
    setLoading(true);

    try {
      const batch = writeBatch(fireStore);

      // remove group from userCommunities for user
      const usergroupDocRef = doc(
        fireStore,
        `users/${user?.uid}/groups`,
        groupId
      );
      batch.delete(usergroupDocRef);

      const groupDocRef = doc(fireStore, "groups", groupId);
      batch.update(groupDocRef, { numberOfMembers: increment(-1) });

      // batch write
      await batch.commit();

      // update recoil state - groupState.userCommunities
      setGroupStateValue((prev) => ({
        ...prev,
        userCommunities: prev.userGroups.filter(
          (group) => group.groupId !== groupId
        ),
      }));
    } catch (error: any) {
      console.log("Leave group error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getUserGroups();
  }, [user]);

  return { groupStateValue, onJoinOrLeaveGroup, loading };
};

export default useGroupData;
