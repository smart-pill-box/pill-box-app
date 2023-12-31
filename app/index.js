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
import PillNotificationManager from './src/utils/pill_notification_manager';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if ((type === EventType.ACTION_PRESS) && (pressAction.id === "manualyConfirmed")) {
        const { token, accountKey, profileKey, pillRoutineKey, pillDatetime } = notification.data;
        try {
            await axios.put(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pill_routine/${pillRoutineKey}/pill/${pillDatetime}/status`, {
                status: "manualyConfirmed",
            }, {
                headers: {
                    Authorization: token
                }
            });
        }
        catch (err){
            console.error(err);
        }

        await notifee.cancelNotification(notification.id);
        await PillNotificationManager.deleteAndCreatePillsNotifications(accountKey, token, 5);
    }
    if ((type === EventType.ACTION_PRESS) && (pressAction.id === "delete")) {
        const { token, accountKey, profileKey, pillRoutineKey, pillDatetime } = notification.data;
        try {
            await axios.put(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pill_routine/${pillRoutineKey}/pill/${pillDatetime}/status`, {
                status: "canceled",
            }, {
                headers: {
                    Authorization: token
                }
            });
        }
        catch (err){
            console.error(err)
        }

        await notifee.cancelNotification(notification.id);
        await PillNotificationManager.deleteAndCreatePillsNotifications(accountKey, token, 5);
    }
    else {
        console.log("Received event of type ", type, " and details ", detail);

    }
});

AppRegistry.registerComponent(appName, () => App);
