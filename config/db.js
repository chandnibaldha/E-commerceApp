const mongoose = require('mongoose');
const connectUrl = 'mongodb+srv://chandaniscriptjet:Kvo2d7qpSuPU4iNw@e-commerce.8chdlyg.mongodb.net/?retryWrites=true&w=majority';

const connectdatabase=()=>{
   try {
     mongoose.connect(connectUrl);
     console.log('Database Connected');
   } catch (error) {
    console.log(error)
   }
}
module.exports = connectdatabase;
