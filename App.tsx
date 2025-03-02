import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import store, {persistor} from './src/store/index';
import AppNavigator from './src/navigation/AppNavigator';
import {ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('Redux User after rehydration:', store.getState().user.name);
    }, 3000); // Delayed to ensure state is rehydrated
  }, []);

  useEffect(() => {
    persistor.subscribe(() => {
      if (persistor.getState().rehydrated) {
        console.log('🔥 Hydration Completed:', store.getState().auth.user);
      }
    });
  }, []);

  useEffect(() => {
    const checkHydration = setInterval(() => {
      console.log('🔄 Persistor State:', persistor.getState());

      if (persistor.getState().bootstrapped) {
        console.log('✅ Hydration completed');
        clearInterval(checkHydration);
      }
    }, 1000); // Check every second

    AsyncStorage.getItem('persist:root').then(data =>
      console.log('📦 Stored Redux Data:', data),
    );

    return () => clearInterval(checkHydration);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <GestureHandlerRootView style={styles.mainStyle}>
          <AppNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
  },
});

export default App;
