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
            })
        },
    
        routes() {
            this.namespace = "api"
            this.post("/account", function (schema, req){
                try{
                    console.log("lalala");
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
            })
    
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
                    ...this.serialize(account),
                    ...this.serialize(account.profiles)
                }
            })
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
            })
            this.get("/account/:accountKey/profile/:profileKey", function (schema, req){
                const profile = schema.profiles.findBy({ profileKey: req.params.profileKey })

                return this.serialize(profile).profile;
            })

            this.passthrough("http://192.168.0.8:8887/**")
        },
    
        seeds(server) {
        }
    })

    return server;
}