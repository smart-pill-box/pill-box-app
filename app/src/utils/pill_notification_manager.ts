import notifee, { AndroidCategory, AndroidImportance, AndroidVisibility, TimestampTrigger, TriggerType } from "@notifee/react-native"
import axios from "axios"
import { MEDICINE_API_HOST } from "../constants"
import { addDays, isBefore } from "date-fns";

export default class PillNotificationManager {
    static async createNextPillsNotificationsIfDontExist(accountKey: string, token: string, numberOfDays: number){
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
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            bypassDnd: true,
            vibration: true,
            vibrationPattern: [300,500],
            sound: "default"
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

                const trigger: TimestampTrigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: (new Date(pill.pillDatetime)).getTime()
                };

                console.log("Criando evento ", pillDatetime.toISOString());

                await notifee.createTriggerNotification({
                    title: `Chegou a hora de tomar seu remédio!!`,
                    body: `${pill.name} - ${getTimeStr(pillDatetime)}`,
                    android: {
                        importance: AndroidImportance.HIGH,
                        category: AndroidCategory.CALL,
                        channelId: channelId,
                        visibility: AndroidVisibility.PUBLIC,
                        color: "#66E7A9",
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
            })
        })
    }

    static async deleteAndCreatePillsNotifications(accountKey: string, token: string, numberOfDays: number) {
        await this.deleteAllNotifications();
        await this.createNextPillsNotificationsIfDontExist(accountKey, token, numberOfDays);
    }

    static async deleteAllNotifications(){
        await notifee.deleteChannel("default");
        await notifee.cancelAllNotifications();
    }
}

const getTimeStr = (datetime: Date)=>{
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}