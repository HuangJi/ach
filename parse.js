const csv = require('fast-csv')
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient

const stream = fs.createReadStream('../txdata_1050601_1050603.csv')
const mongodbUrl = 'mongodb://localhost:27017/ach'

// let collection
// let filter
// let db
var txList = []
csv
  .fromStream(stream, { headers: true })
  .validate(function (data) {
    if (data) {
      return true
    }
    else {
      return false
    }
  })
  .on('data', (data) => {
    txList.push(data)
    // console.log(data)
    if (txList.length % 1000 == 0) {
      console.log(txList.length)

    }
  })
  .on('end', () => {
    console.log('done')
  })
  .on("error", function(error) {
    console.error('error!')
    console.log(error)
    return false;                         
   })
// var count = 1
// MongoClient.connect(mongodbUrl, (err, database) => {
//   db = database
//   collection = db.collection('tx')
//   csv
//     .fromStream(stream, { headers: true })
//     .on('data', (data) => {
//       // console.log(data)
//       // filter = {
//       //   P_SEQ: data.P_SEQ,
//       // }
//       collection.insertOne(data, (error) => {
//         if (!error) {
//           console.log(`count: ${count} done!`)
//           count += 1
//         } else {
//           console.log('error!')
//           console.log(error)
//         }
//       })
//     })
//   .on('end', () => {
//     console.log('done')
//     db.close()
//   })
// })
var createNewEntries = function(db, entries, callback) {

    // Get the collection and bulk api artefacts
    var collection = db.collection('entries'),          
        bulk = collection.initializeOrderedBulkOp(), // Initialize the Ordered Batch
        counter = 0;    

    // Execute the forEach method, triggers for each entry in the array
    entries.forEach(function(obj) {         

        bulk.insert(obj);           
        counter++;

        if (counter % 1000 == 0 ) {
            // Execute the operation
            bulk.execute(function(err, result) {  
                // re-initialise batch operation           
                bulk = collection.initializeOrderedBulkOp();
                callback();
            });
        }
    });             

    if (counter % 1000 != 0 ){
        bulk.execute(function(err, result) {
            // do something with result 
            callback();             
        }); 
    } 
};
