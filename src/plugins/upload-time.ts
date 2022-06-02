import { NOSQL_DB } from '../databases/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
    FastifyReply,
    FastifyRequest,
} from 'fastify';


export function buildUploadPlugin(dbNoSql: NOSQL_DB){

    return async function uploadPlugin(server:FastifyInstance, opts:FastifyRegisterOptions<Record<string,unknown>>, next: () => void) {
     server.route({
            method: 'POST',
            url: '/upload',
            handler: async function (request: FastifyRequest, reply: FastifyReply) {
                
                const username=request.headers.username;
                const time = request.headers.time;

                let json;
                
               if(username && time) json = {username: username, time: time}
               
               if(json){


                const checkIfExists = await dbNoSql.getCollection().findOne({username: json.username});

                if(checkIfExists){
                    if(json.time<checkIfExists.time)await dbNoSql.getCollection().updateOne({username: json.username},{$set: {time: json.time}});
                }else{
                    await dbNoSql.getCollection().insertOne(json);
                } 



               } 
   
               
                    reply.header('Access-Control-Allow-Origin', '*');
                    reply
                        .code(201)
                        .headers({ 'content-type': 'application/json' })
                        .send('OK');
                
            }
        })
    };
}
