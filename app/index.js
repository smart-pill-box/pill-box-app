/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import axios from 'axios';
import { MEDICINE_API_HOST } from './src/constants';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'manualyConfirmed') {
        const { token, accountKey, profileKey, pillRoutineKey, pillDatetime } = notification.data;
        await axios.put(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pill_routine/${pillRoutineKey}/pill/${pillDatetime}/status`, {
            status: "manualyConfirmed",
        }, {
            headers: {
                Authorization: token
            }
        });

        await notifee.cancelNotification(notification.id);
    }
    if (type === EventType.ACTION_PRESS && pressAction.id === 'delete') {
        const { token, accountKey, profileKey, pillRoutineKey, pillDatetime } = notification.data;
        await axios.put(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pill_routine/${pillRoutineKey}/pill/${pillDatetime}/status`, {
            status: "canceled",
        }, {
            headers: {
                Authorization: token
            }
        });

        await notifee.cancelNotification(notification.id);
    }
});

AppRegistry.registerComponent(appName, () => App);
