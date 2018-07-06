import { rejects } from "assert";
import { DocumentClient, CollectionMeta, DocumentQuery, RetrievedDocument, NewDocument } from "documentdb";
var config = require("../configs/cosmos");
var url = require('url');


var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

var client: DocumentClient = new DocumentClient(config.endpoint, { "masterKey": config.primaryKey });

export class Cosmos {

    create(document:NewDocument) {
        return new Promise((resolve, reject) => {
            client.createDocument(collectionUrl, document, (err: any, created: any) => {
                if (err) {
                    reject(err);
                }
                resolve(created);
            });
        });
    }

    getDocument(id: string) {
        console.log(`Querying collection through index:\n${config.collection.id}`);

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
                    for (var queryResult of results) {
                        let resultString = JSON.stringify(queryResult);
                        console.log(`\tQuery returned ${resultString}`);
                    }

                    resolve(results);
                } else {
                    reject(err);
                }
            });
        });
    };

}