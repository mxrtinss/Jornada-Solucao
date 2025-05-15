const { MongoClient } = require('mongodb');

async function main() {
  // Use a direct connection string instead of SRV format
  const uri = "mongodb://caio0109:123mudar@ac-13aqrji-shard-00-00.d3zsooc.mongodb.net:27017,ac-13aqrji-shard-00-01.d3zsooc.mongodb.net:27017,ac-13aqrji-shard-00-02.d3zsooc.mongodb.net:27017/Simoldes?ssl=true&replicaSet=atlas-f80kov-shard-0&authSource=admin&retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas");

    // Perform a ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection test successful - ping command succeeded");
    
    // Try to access the Simoldes database and funcionarios collection
    const database = client.db("Simoldes");
    const collection = database.collection("funcionarios");
    
    // Count documents
    const count = await collection.countDocuments();
    console.log(`Found ${count} documents in funcionarios collection`);
    
  } catch (e) {
    console.error("Connection error:", e);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

main().catch(console.error);



