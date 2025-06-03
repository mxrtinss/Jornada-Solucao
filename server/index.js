const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

// Use the connection string from MongoDB Atlas Connection Wizard
// Replace <password> with your actual password
const uri = "mongodb+srv://caio0109:123mudar@simoldes.d3zsooc.mongodb.net/?retryWrites=true&w=majority&appName=simoldes";

// Create a MongoClient with the recommended options
const client = new MongoClient(uri, {
  // These options are recommended by MongoDB Atlas
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // Add JSON body parser

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB with error handling
async function connectToMongo() {
  try {
    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Don't exit the process, let the API continue with fallback data
  }
}

// Call the connect function
connectToMongo().catch(console.dir);

// API routes with fallback data
app.get('/api/funcionarios', async (req, res) => {
  try {
    console.log('Fetching funcionarios from MongoDB');
    
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    const funcionarios = await collection.find({}).toArray();
    console.log(`Found ${funcionarios.length} funcionarios`);
    res.json(funcionarios);
  } catch (error) {
    console.error('Error fetching funcionarios:', error);
    // Return fallback data on error
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
});

// Alias endpoint for operators (using the same funcionarios collection)
app.get('/api/operators', async (req, res) => {
  try {
    console.log('Fetching operators from MongoDB (funcionarios collection)');
    
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    const operators = await collection.find({}).toArray();
    console.log(`Found ${operators.length} operators`);
    res.json(operators);
  } catch (error) {
    console.error('Error fetching operators:', error);
    // Return fallback data on error
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
});

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Create funcionario
app.post('/api/funcionarios', async (req, res) => {
  try {
    const newFuncionario = req.body;
    console.log('Received request to create funcionario:', newFuncionario);

    // Validate required fields
    if (!newFuncionario.matricula || !newFuncionario.nome) {
      console.error('Missing required fields');
      res.status(400).json({ error: 'Matrícula e nome são obrigatórios' });
      return;
    }
    
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    
    // Check if matricula already exists
    const existingFuncionario = await collection.findOne({ matricula: newFuncionario.matricula });
    if (existingFuncionario) {
      console.error('Matricula already exists:', newFuncionario.matricula);
      res.status(400).json({ error: 'Já existe um funcionário com esta matrícula' });
      return;
    }
    
    const result = await collection.insertOne(newFuncionario);
    
    if (!result.insertedId) {
      console.error('Failed to insert funcionario');
      res.status(500).json({ error: 'Erro ao criar funcionário' });
      return;
    }
    
    const createdFuncionario = { ...newFuncionario, _id: result.insertedId };
    console.log('Successfully created funcionario:', createdFuncionario);
    res.status(201).json(createdFuncionario);
  } catch (error) {
    console.error('Error creating funcionario:', error);
    res.status(500).json({ error: 'Erro ao criar funcionário: ' + error.message });
  }
});

// Update funcionario
app.put('/api/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    
    // Convert string id to ObjectId
    const objectId = new ObjectId(id);
    
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Funcionário não encontrado' });
      return;
    }
    
    res.json({ success: true, message: 'Funcionário atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating funcionario:', error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

// Delete funcionario
app.delete('/api/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const database = client.db('Simoldes');
    const collection = database.collection('funcionarios');
    
    // Convert string id to ObjectId
    const objectId = new ObjectId(id);
    
    const result = await collection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Funcionário não encontrado' });
      return;
    }
    
    res.json({ success: true, message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting funcionario:', error);
    res.status(500).json({ error: 'Erro ao excluir funcionário' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

