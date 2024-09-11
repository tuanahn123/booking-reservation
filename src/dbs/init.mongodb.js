const mongoose = require('mongoose')
const atlasConnectString = process.env.DB_CONNECT_STRING;

class Database {
    constructor() {
        this.connect()
    }
    // TODO connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {
                color: true
            })
        }
        mongoose.connect(atlasConnectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log(`Connect Mongodb Success `)
        })
            .catch(err => console.log(err))
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb