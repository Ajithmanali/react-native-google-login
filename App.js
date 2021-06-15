import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '27024146261-g5r2d1q8d20cbpuheuklej9u99643etq.apps.googleusercontent.com',
});

const App = () => {
  const [googleLogin, setGoogleLogin] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  const loginWithGoogle = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    try {
      let loginUser = await auth().signInWithCredential(googleCredential);
      setGoogleLogin(true);
    } catch (error) {
      setGoogleLogin(false);
    }
  };

  return (
    <View style={styles.container}>
      {googleLogin && (
        <View style={styles.contentContainer}>
          <Text style={styles.loginText}>Welcome</Text>
        </View>
      )}
      {!googleLogin && (
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity
            onPress={loginWithGoogle}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login with google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default App;

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  contentContainer: {
    marginTop: '30%',
  },
  loginText: {
    textAlign: 'center',
  },
  loginButtonContainer: {
    marginTop: '40%',
  },
  loginButton: {
    backgroundColor: '#e8f2ff',
    alignSelf: 'center',
    padding: 15,
  },
  loginButtonText: {
    color: '#3399ff',
    fontSize: 20,
    fontWeight: '500',
  },
});
