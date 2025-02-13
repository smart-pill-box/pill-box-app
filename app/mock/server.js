import { belongsTo, createServer, hasMany, Model, Response } from "miragejs"
import uuid from 'react-native-uuid';

export function makeServer(){

    let server = createServer({
        models: {
            account: Model.extend({
                profiles: hasMany()
            }),
            profile: Model.extend({
                account: belongsTo(),
                pillRoutines: hasMany()
            }),
            pillRoutine: Model.extend({
                profile: belongsTo()
            }),
            pill: Model.extend({
                pillRoutine: belongsTo()
            })
        },
    
        routes() {
            this.namespace = "api"
            this.post("/account", function (schema, req){
                try{
                    const attrs = JSON.parse(req.requestBody);

                    const account = schema.accounts.create({
                        accountKey: "2df3f7b8-15e0-4aa9-af7f-5c61045b3af5"
                    })

                    const profile = schema.profiles.create({
                        profileKey: uuid.v4(),
                        name: attrs.mainProfileName,
                        avatarNumber: attrs.mainProfileAvatarNumber,
                        account: account
                    });

                    return {
                        ...this.serialize(account),
                        ...this.serialize(account.profiles)
                    }
                } catch(err){
                    console.error(err)
                }
            });
    
            this.get("/account/:accountKey", function (schema, req){
                const account = schema.accounts.findBy({ accountKey: req.params.accountKey });
                
                if (!account){
                    return new Response(
                        404, {
                            "Content-Type": "application/json"
                        }, {
                            code: "ERR00001"
                        }
                    );
                }

                return {
                    ...this.serialize(account).account,
                    ...this.serialize(account.profiles)
                }
            });
            this.post("/account/:accountKey/profile", function (schema, req){
                const account = schema.accounts.findBy({ accountKey: req.params.accountKey });
                const attrs = JSON.parse(req.requestBody);

                const profile = schema.profiles.create({
                    profileKey: uuid.v4(),
                    name: attrs.name,
                    avatarNumber: attrs.avatarNumber,
                    account: account
                })

                return profile
            });
            this.get("/account/:accountKey/profile/:profileKey", function (schema, req){
                const profile = schema.profiles.findBy({ profileKey: req.params.profileKey })

                return this.serialize(profile).profile;
            });
            this.get("/account/:accountKey/profile/:profileKey/pill_routines", function (schema, req){
                const profile = schema.profiles.findBy({ profileKey: req.params.profileKey })
                const pillRoutines = profile.pillRoutines;

                if(!pillRoutines){
                    return {
                        data: []
                    }
                }

                return {
                    data: this.serialize(pillRoutines).pillRoutines
                };
            });
            this.get("/account/:accountKey/profile/:profileKey/pills", function (schema, req){
                try{
                    const filteredDate = new Date(JSON.parse(req.queryParams).pillDate);

                    const pills = schema.pills.filter(pill=>{
                        const pillDate = new Date(pill.pillDatetime);

                        return (
                            pillDate.getDate() == filteredDate.getDate() &&
                            pillDate.getMonth() == filteredDate.getMonth() &&
                            pillDate.getFullYear() == filteredDate.getFullYear() &&
                            pill.pillRoutine.profile.profileKey == profileKey
                        )
                    })

                    if(!pills){
                        return {
                            data: []
                        }
                    }

                    let data = [];

                    pills.forEach(pill=>{
                        data.push({
                            ...this.serialize(pill).pill,
                            pillRoutine: this.serialize(pill.pillRoutine).pillRoutine
                        })
                    })

                    return {
                        data: data
                    };
                } catch(err){
                    console.error(err);
                }
            });
            this.post("/account/:accountKey/profile/:profileKey/pill_routine", function(schema, req){
                try{
                    const body = JSON.parse(req.requestBody);
                    const profile = schema.profiles.findBy({ profileKey: req.params.profileKey });
                    const pillRoutine = schema.pillRoutines.create({
                        pillRoutineKey: uuid.v4(),
                        profile: profile,
                        startDate: new Date().toISOString().split("T")[0],
                        ...body
                    });

                    return this.serialize(pillRoutine).pillRoutine;
                } catch(err){
                    console.error(err)
                }

            });
            this.get("/account/:accountKey/profile/:profileKey/pill_routine/:pillRoutineKey", function (schema, req){
                const pillRoutine = schema.pillRoutines.findBy({ pillRoutineKey: req.params.pillRoutineKey })

                return this.serialize(pillRoutine).pillRoutine
            });
            this.put("/account/:accountKey/profile/:profileKey/pill_routine/:pillRoutineKey", function(schema, req){
                try{
                    console.log("cucucucu", req.requestBody);
                    const body = JSON.parse(req.requestBody);
                    const pillRoutine = schema.pillRoutines.findBy({ pillRoutineKey: req.params.pillRoutineKey });

                    console.log("BODY   ", body);
                    console.log("PARAM  ", req.params.pillROutineKey);
                    pillRoutine.update({
                        ...body
                    });
    
                    return this.serialize(pillRoutine).pillRoutine;
                } catch (err){
                    console.error(err)
                }
            });
            this.put("/account/:accountKey/profile/:profileKey/pill_routine/:pillRoutineKey/pill/:pillDatetime/status", function(schema, req){
                const pillRoutine = schema.pillRoutines.findBy({ pillRoutineKey: req.params.pillRoutineKey });
                const body = JSON.parse(req.requestBody);
                const pillDatetime = body.pillDatetime;
                const status = body.status;
                let confirmationInterval;

                if (status == "manualyConfirmed" || status == "pillBoxConfirmed"){
                    confirmationInterval = (Date.parse(pillDatetime).getTime() - (new Date()).getTime())/1000
                }

                const pill = schema.pills.create({
                    pillRoutine: pillRoutine,
                    ...(confirmationInterval && {confirmationInterval: confirmationInterval} ),
                    ...body
                })

                return this.serialize(pill).pill;
            });

            this.passthrough("http://192.168.15.9:8887/**")
        },
    
        seeds(server) {
            const DEV = true;
            if (DEV){
                const account = server.schema.accounts.create({
                    accountKey: "2df3f7b8-15e0-4aa9-af7f-5c61045b3af5"
                })

                const profile = server.schema.profiles.create({
                    profileKey: uuid.v4(),
                    name: "André",
                    avatarNumber: 1,
                    account: account
                });

                const pillRoutine1 = server.schema.pillRoutines.create({
                    pillRoutineKey: uuid.v4(),
                    profile: profile,
                    startDate: new Date().toISOString().split("T")[0],
                    name: "Remedio1",
                    pillRoutineType: "weekdays",
                    pillRoutineData: {
                        monday: ["12:00", "13:00"],
                        tuesday: ["12:00", "13:00"]
                    }
                })

                const pillRoutine2 = server.schema.pillRoutines.create({
                    pillRoutineKey: uuid.v4(),
                    profile: profile,
                    startDate: new Date().toISOString().split("T")[0],
                    name: "Remedio2",
                    pillRoutineType: "weekdays",
                    pillRoutineData: {
                        monday: ["12:00", "13:00"],
                        tuesday: ["12:00", "13:00"],
                        wednesday: ["12:00", "13:00"],
                        thursday: ["12:00", "13:00"],
                        friday: ["12:00", "13:00"],
                        saturday: ["12:00", "13:00"],
                        sunday: ["12:00", "13:00"],
                    }
                })
            }
        }
    })

    return server;
}
