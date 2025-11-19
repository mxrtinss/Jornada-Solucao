import { MongoClient } from 'mongodb';

// MongoDB connection string
// const uri = process.env.MONGODB_URI || "mongodb+srv://caio0109:123mudar@simoldes.d3zsooc.mongodb.net/?retryWrites=true&w=majority&appName=simoldes";
 const uri = process.env.MONGODB_URI || "mongodb+srv://caio0109:123mudar@simoldes.d3zsooc.mongodb.net/?appName=simoldes";


// Connection options with shorter timeouts for serverless environment
const options = {
  serverSelectionTimeoutMS: 5000, // 5 seconds
  connectTimeoutMS: 10000, // 10 seconds
};

// Use connection caching for serverless functions
let cached = global._mongoClientPromise;

if (!cached) {
  const client = new MongoClient(uri, options);
  cached = client.connect();
  global._mongoClientPromise = cached;
}

async function connectToDatabase() {
  const client = await cached;
  const db = client.db('Simoldes');
  return { client, db };
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('funcionarios');
    const funcionarios = await collection.find({}).toArray();
    
    console.log(`Found ${funcionarios.length} funcionarios`);
    res.status(200).json(funcionarios);
  } catch (error) {
    console.error('Error fetching funcionarios:', error);
    res.status(200).json([
      {
        _id: "fallback-id-1",
        matricula: "12345",
        nome: "João Silva (Fallback)",
        cargo: "Operador CNC",
        departamento: "Produção",
        email: "joao.silva@empresa.com",
        telefone: "(11) 98765-4321",
        dataAdmissao: "2020-03-15T00:00:00.000Z",
        ativo: true
      }
    ]);
  }
}
