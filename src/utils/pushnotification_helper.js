import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    console.log('inside fcmToken--->', fcmToken);
    try {
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken--->', fcmToken);
        AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('Error--->', error);
    }
  } else {
    console.log('fcmToken Locale--->', fcmToken);
  }
};

const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    })
    .catch(error => console.log('failed', error));

  messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

// export const checkPermission = async () => {
//   const enabled = await firebase.messaging().hasPermission();
//   if (enabled) {
//     this.getToken();
//   } else {
//     this.requestPermission();
//   }
// };
export {getFcmToken, requestUserPermission, notificationListener};
