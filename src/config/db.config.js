import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
         await mongoose.connect('mongodb+srv://goku:thecoder@cluster0.hzjo3.mongodb.net/vega?retryWrites=true&w=majority&appName=Cluster0');
        // await mongoose.connect('mongodb://127.0.0.1:27017/v');

        mongoose.connection.on('connected', () => {
            console.log('Successfully connected to MongoDB');
        });
        
        mongoose.connection.on('error', err => {
            console.log('Database connection error:', err);
        });


        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
        });

        // Don't immediately exit the process
        // process.exit(); // Avoid calling process.exit() here unless needed
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

export default connectToDatabase; // Use default export
