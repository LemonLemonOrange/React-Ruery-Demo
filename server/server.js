const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Import OPC simulation modules
const opcClient = require('./opc-client');
const errorHandler = require('./error-handler');

// OPC Server simulation endpoints
app.get('/api/opc/servers/:hostname', async (req, res) => {
    try {
        const { hostname } = req.params;
        console.log(`Attempting to get OPC servers from ${hostname}`);
        
        // Simulate the OPC server discovery
        const result = await opcClient.getOPCServersWithRetry(hostname);
        
        res.json({
            success: true,
            hostname: hostname,
            servers: result.servers,
            message: result.message,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('OPC server discovery error:', error);
        
        const errorResponse = errorHandler.handleOPCError(error, req.params.hostname);
        res.status(500).json(errorResponse);
    }
});

// OPC connection diagnostics endpoint
app.post('/api/opc/diagnose', async (req, res) => {
    try {
        const { hostname } = req.body;
        console.log(`Running OPC diagnostics for ${hostname}`);
        
        const diagnosticResult = await opcClient.runDiagnostics(hostname);
        
        res.json({
            success: true,
            diagnostics: diagnosticResult,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('OPC diagnostics error:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get error solutions endpoint
app.get('/api/opc/solutions/:errorCode', (req, res) => {
    try {
        const { errorCode } = req.params;
        const solutions = errorHandler.getSolutionsForError(errorCode);
        
        res.json({
            success: true,
            errorCode: errorCode,
            solutions: solutions,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test connection endpoint
app.post('/api/opc/test-connection', async (req, res) => {
    try {
        const { hostname, timeout = 5000 } = req.body;
        
        const testResult = await opcClient.testConnection(hostname, timeout);
        
        res.json({
            success: testResult.success,
            hostname: hostname,
            result: testResult,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Connection test error:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            hostname: req.body.hostname,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'OPC Automation Demo API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve React app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 OPC Automation Demo Server running on port ${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /api/opc/servers/:hostname - Get OPC servers`);
    console.log(`   POST /api/opc/diagnose - Run diagnostics`);
    console.log(`   GET  /api/opc/solutions/:errorCode - Get error solutions`);
    console.log(`   POST /api/opc/test-connection - Test connection`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`\n💡 Demo simulates HRESULT E_FAIL error and solutions`);
    console.log(`🌐 Open http://localhost:${PORT} to view the web interface\n`);
});

module.exports = app;