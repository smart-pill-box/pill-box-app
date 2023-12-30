import notifee, { AndroidCategory, AndroidImportance, AndroidVisibility, TimestampTrigger, TriggerType } from "@notifee/react-native"
import axios from "axios"
import { MEDICINE_API_HOST } from "../constants"
import { addDays, isBefore } from "date-fns";
import { Alert } from "react-native";
import keycloak from "../../keycloak";

export const PILLS_NOTIFICATIONS_CHANEL_ID = "pill_notification"

export default class PillNotificationManager {
    static async createNextPillsNotificationsIfDontExist(accountKey: string, token: string, numberOfDays: number){
        const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
        if (batteryOptimizationEnabled) {
            // 2. ask your users to disable the feature
            Alert.alert(
                'Restrições detectadas',
                'Para receber as notificações de seus remédios mesmo com o aplicativo fechado é necessário desativar as configurações de otimização de bateria para esse aplicativo',
                [
                  // 3. launch intent to navigate the user to the appropriate screen
                    {
                    text: 'OK, abrir configurações',
                    onPress: async () => await notifee.openBatteryOptimizationSettings(),
                    },
                    {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    },
                ],
                { cancelable: false }
            );
        };
        const alreadyExistingNotifications = await notifee.getTriggerNotificationIds();
        if (alreadyExistingNotifications.length != 0){
            return
        }
        
        let response = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}`, {
            headers: {
                Authorization: token
            }
        });

        const profileKeys: string[] = [];
        response.data.profiles.forEach((profile: any)=>{
            profileKeys.push(profile.profileKey);
        });

        const fromDate = new Date();
        const toDate = addDays(fromDate, numberOfDays);

        const channelId = await notifee.createChannel({
            id: PILLS_NOTIFICATIONS_CHANEL_ID,
            name: 'Notificações de remédios',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            bypassDnd: true,
            vibration: true,
            vibrationPattern: [300,500],
            sound: "default",
        });

        profileKeys.forEach(async profileKey=>{
            response = await axios.get(`${MEDICINE_API_HOST}/account/${accountKey}/profile/${profileKey}/pills?fromDate=${fromDate.toISOString().split("T")[0]}&toDate=${toDate.toISOString().split("T")[0]}`, {
                headers: {
                    Authorization: token
                }
            });

            response.data.data.forEach(async (pill: any)=>{
                if(!(pill.status == "pending")){
                    return
                }
                
                const pillDatetime = new Date(pill.pillDatetime);
                if (isBefore(pillDatetime, new Date())){
                    return
                }

                PillNotificationManager.createPillNotification(
                    accountKey, 
                    profileKey, 
                    pill.pillRoutineKey, 
                    pillDatetime, 
                    pill.name, 
                    token
                );

            })
        })
    }

    static async deleteAndCreatePillsNotifications(accountKey: string, token: string, numberOfDays: number) {
        await this.deleteAllNotifications();
        await this.createNextPillsNotificationsIfDontExist(accountKey, token, numberOfDays);
    }

    static async createPillNotification(accountKey: string, profileKey: string, pillRoutineKey: string, pillDatetime: Date, pillName: string, token: string){
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: (new Date(pillDatetime)).getTime(),
        };

        await notifee.createTriggerNotification({
            title: `Chegou a hora de tomar seu remédio!!`,
            body: `${pillName} - ${getTimeStr(pillDatetime)}`,
            data: {
                accountKey: accountKey,
                profileKey: profileKey,
                pillRoutineKey: pillRoutineKey,
                pillDatetime: pillDatetime.toISOString(),
                token: token
            },
            android: {
                loopSound: true,
                sound: "default",
                lightUpScreen: true,
                importance: AndroidImportance.HIGH,
                category: AndroidCategory.ALARM,
                channelId: PILLS_NOTIFICATIONS_CHANEL_ID,
                visibility: AndroidVisibility.PUBLIC,
                color: "#66E7A9",
                ongoing: true,
                smallIcon: "ic_small_icon",
                actions: [
                    {
                        title: '<p style="color: green;"> Já tomei </p>',
                        pressAction: {
                            id: "manualyConfirmed"
                        }
                    },
                    {
                        title: '<p style="color: red;"> Deletar </p>',
                        pressAction: {
                            id: "delete"
                        }
                    }
                ]
            }
        }, trigger)
    }

    static async deleteAllNotifications(){
        await notifee.cancelAllNotifications();
    }
}

const getTimeStr = (datetime: Date)=>{
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}