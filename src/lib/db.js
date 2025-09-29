import connectDB from './mongodb';

/**
 * Database utility functions
 */

// Test database connection
export async function testConnection() {
  try {
    await connectDB();
    return { success: true, message: 'Database connected successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Get database status
export async function getDatabaseStatus() {
  try {
    const mongoose = await connectDB();
    const state = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: states[state] || 'unknown',
      readyState: state,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}
