import { belongsTo, createServer, hasMany, Model } from "miragejs"
import { v4 as uuidv4 } from "uuid"

export function makeServer(){

    let server = createServer({
        models: {
            account: Model.extend({
                profiles: hasMany("profile")
            }),
            profile: Model.extend({
                account: belongsTo("account"),
            })
        },
    
        routes() {
            this.urlPrefix = "http://myApiServer1"
            this.namespace = "api"
            this.post("/account", (schema, req)=>{
                let attrs = JSON.parse(req.requestBody);

                attrs.accountKey = uuidv4();

                schema.accounts.create(attrs)

                return
            })
    
            this.get("/account/:accountKey", (schema)=>{
                return schema.accounts.findBy({ accountKey: req.params.accountKey })
            })
            this.passthrough("http://192.168.0.8:8887/**")
        },
    
        seeds(server) {
            
        }
    })

    return server;
}