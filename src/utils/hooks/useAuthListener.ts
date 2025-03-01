import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser, logoutUser } from './../../store/slices/authSlice';

const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email || '', fullName: '' }));
      } else {
        dispatch(logoutUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuthListener;
