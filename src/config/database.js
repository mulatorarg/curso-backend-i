import { connect } from 'mongoose';

//const MONGO_URI="mongodb+srv://userCoder:passCoder@cluster0.2ltylis.mongodb.net/proyecto-back-i?retryWrites=true&w=majority&appName=Cluster0"
const MONGO_URI='mongodb://localhost:27017/proyecto-backend-i';

await connect(MONGO_URI)
  .then(() => { console.log("✅ Conectado al Servidor de MongoDB.") })
  .catch((error) => { console.log("❌ No Conectado al Servidor de MongoDB:\n" + error) });
