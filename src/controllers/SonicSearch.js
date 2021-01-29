const { Search, Ingest } = require("sonic-channel")
const sonicSearchConfig = require("../config/sonic")


class SonicSearchController { 
    static searchResultsLimit = 10
    static lang = "por"
    
    static async init() {
        SonicSearchController.searchEngine = new Search(sonicSearchConfig)
        SonicSearchController.ingestEngine = new Ingest(sonicSearchConfig)
        

        await SonicSearchController.searchEngine.connect()
        await SonicSearchController.ingestEngine.connect()
    }
    static async ingest(collection, bucket, object, text) {
        return await SonicSearchController.ingestEngine.push(collection, bucket, object, text, {
            lang: SonicSearchController.lang
        })
    }
    static async removeIngest(collection, bucket, object) {
        return await SonicSearchController.ingestEngine.flusho(collection, bucket, object)
    }
    static async updateIngest(collection, bucket, object, new_text) {
        await SonicSearchController.removeIngest(collection, bucket, object)
        return await SonicSearchController.ingest(collection, bucket, object, new_text)
    }
    static async search(collection, bucket, terms, page) {
       return await SonicSearchController.searchEngine.query(collection, bucket, terms, {
            lang: SonicSearchController.lang,
            limit: SonicSearchController.searchResultsLimit,
            offset: page * SonicSearchController.searchResultsLimit
       })
    }
    static async suggest(collection, bucket, terms) {
        return await SonicSearchController.searchEngine.suggest(collection, bucket, terms, {
            lang: SonicSearchController.lang
        })
    }
}  

module.exports = SonicSearchController