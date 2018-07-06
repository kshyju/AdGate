import { rejects } from "assert";
import { DocumentClient, CollectionMeta, DocumentQuery, RetrievedDocument, NewDocument } from "documentdb";
const config = require("../configs/cosmos");
const url = require('url');
import { Debug } from "../debug";

const debug = new Debug();
const databaseUrl = `dbs/${config.database.id}`;
const collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

const client: DocumentClient = new DocumentClient(config.endpoint, { "masterKey": config.primaryKey });

export class Cosmos {

    create(document:NewDocument) {
        debug.debug(`Inside Cosmos.create`);
        return new Promise((resolve, reject) => {
            client.createDocument(collectionUrl, document, (err: any, created: any) => {
                if (err) {
                    debug.log(err.body);
                    reject(err);
                }
                resolve(created);
            });
        });
    }

    getDocument(id: string) { 
        debug.debug(`Inside Cosmos.getDocument for {$id}`); 
        
        const colQuery: DocumentQuery = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: id
            }]
        };

        return new Promise((resolve, reject) => {

            client.queryDocuments(collectionUrl, colQuery).toArray((err, results) => {
                if (null == err && results.length > 0) {                    
                    resolve(results[0]);
                } else {
                    debug.log(err.body);
                    reject(err);
                }
            });
        });
    };

}