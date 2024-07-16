import React, { useEffect, useState } from 'react';
import useShowToast from './useShowToast';
import { db } from '../config/firebase';
import useUserProfileStore from '../store/userProfileStore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useGetUserProfileByUsername = (username) => {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const { userProfile, setUserProfile } = useUserProfileStore();

  useEffect(() => {
    const getUserProfile = async() => {
      try {
        // query the data of the user from database
        const q = query(collection(db, "users"), where("username", "==", username));

        const querySnapshot = await getDocs(q);
         
        if (querySnapshot.empty) {  // when the user does not exist, set the profile as null
          console.log("do not exist")
          return setUserProfile(null);
        } 
        let userDoc;
        querySnapshot.forEach((doc) => {
          userDoc = doc.data();    
        });
        setUserProfile(userDoc);
        console.log("Profile info stored")
      } catch (error) { 
        showToast('Error', error.message, 'error')
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, [setUserProfile, username, showToast]);

  return { isLoading, userProfile };
};

export default useGetUserProfileByUsername