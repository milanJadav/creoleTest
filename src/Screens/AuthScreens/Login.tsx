import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {images} from '../../assets';
import InputBoxs from '../../Components/InputBoxs';
import {Colors} from '../../Utils/Constants';
import {Strings} from '../../Utils/Strings';
import IButton from '../../Components/IButton';
import {LogUserIn} from '../../redux/auth/authActions';
import {useAppDispatch} from '../../hooks/Hooks';

interface Props {
  props: any;
  navigation: any;
}

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

const Login = (props: any) => {
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Users' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email TEXT, Password TEXT);',
      );
    });
  };

  const isValidEmail = (email: String) => {
    var regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(email.toLowerCase());
  };

  const Checking = () => {
    setLoading(true);
    if (!email) {
      Alert.alert('User Name Required!');
      setLoading(false);
    } else if (!password) {
      Alert.alert('Please Enter Password!');
      setLoading(false);
    } else if (!isValidEmail(email)) {
      Alert.alert('Invalid Email');
      setLoading(false);
    } else {
      dispatch(
        LogUserIn({
          email,
          password,
          onFailure: onFailLogin,
          onSuccess: onSucessLogin,
        }),
      );
    }
  };

  const onSucessLogin = () => {
    setLoading(false);
    Alert.alert('Success Login');
    props.navigation.replace('TabNav');
  };

  const onFailLogin = () => {
    setLoading(false);
    Alert.alert(`${Strings.loginFailed}`);
  };

  const onRegister = () => {
    props.navigation.navigate('Register');
  };

  const InputContainer = () => {
    return (
      <View style={styles.inputContainer}>
        <View style={{height: 30}} />
        <Image source={images.APP_LOGO} style={{height: 80, width: 80}} />
        <View style={{height: 40}} />

        <InputBoxs
          image={images.USER}
          value={email}
          onChangeText={(t: String) => setEmail(t)}
          placeholder={Strings.emailAddress}
        />
        <InputBoxs
          image={images.LOCK}
          value={password}
          secureTextEntry
          onChangeText={(t: String) => setPassword(t)}
          placeholder={Strings.password}
        />
        <Text style={styles.forgotText}>{Strings.forgotPassword}</Text>
        <View style={{height: 20}} />
        <IButton
          onPress={() => Checking()}
          title={Strings.signIn}
          loading={loading}
        />
        <View style={{height: 20}} />
        <Text style={{...styles.forgotText, alignSelf: 'center'}}>
          <Text style={{color: Colors.black}}>{Strings.noAccount}</Text>{' '}
          <Text onPress={() => onRegister()}>{Strings.registerHere}</Text>
        </Text>
        <View style={{height: 20}} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 0.45}}></View>

      <View style={{flex: 0.55, backgroundColor: Colors.orange}}></View>
      <View style={{position: 'absolute', alignItems: 'center', top: 150}}>
        {InputContainer()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Off_White,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    alignItems: 'center',

    width: '90%',
  },
  forgotText: {
    color: Colors.orange,
    alignSelf: 'flex-end',
    marginTop: 10,
    fontSize: 12,
  },
  Btn: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 7,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
