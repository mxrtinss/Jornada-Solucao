import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = "mongodb+srv://caio0109:123mudar@simoldes.d3zsooc.mongodb.net/?retryWrites=true&w=majority&appName=simoldes";
const client = new MongoClient(uri);

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
    await client.connect();
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    const funcionarios = await collection.find({}).toArray();

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