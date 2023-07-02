import {UserLoginCredentials} from '../../types/UserLoginCredentials';
import SQLite from 'react-native-sqlite-storage';
import {onLogin} from '.';

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

export const LogUserIn = (userCredentials: UserLoginCredentials) => {
  return async (dispatch: any) => {
    try {
      try {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Users WHERE Email=? AND Password=?',
            [userCredentials.email, userCredentials.password],
            (tx, results) => {
              if (results.rows.raw().length > 0) {
                userCredentials.onSuccess();
                dispatch(onLogin(results.rows.raw()[0]));
              } else {
                userCredentials.onFailure();
              }
            },
          );
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error!', error);

      userCredentials.onFailure();
    }
  };
};

export const RegisterUser = (userCredentials: UserLoginCredentials) => {
  return async (dispatch: any) => {
    try {
      db.transaction(async tx => {
        tx.executeSql(
          'SELECT * FROM Users WHERE Email=?',
          [userCredentials.email],
          async (tx, results) => {
            if (results.rows.raw().length > 0) {
              userCredentials.onFailure();
            } else {
              try {
                await db.transaction(async tx => {
                  tx.executeSql(
                    'INSERT INTO Users (Email, Password) VALUES (?,?)',
                    [userCredentials.email, userCredentials.password],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                        userCredentials.onSuccess();
                      }
                    },
                  );
                });
              } catch (error) {
                console.log(error);
              }
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
};
