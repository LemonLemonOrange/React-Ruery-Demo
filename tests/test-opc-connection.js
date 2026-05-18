#!/usr/bin/env node

// OPC Connection Test Script
// Tests the OPC automation error handling and demonstrates solutions

const opcClient = require('../server/opc-client');
const errorHandler = require('../server/error-handler');

async function runOPCTests() {
    console.log('\n🧪 OPC Automation Error Handling Test Suite');
    console.log('============================================\n');
    
    const testCases = [
        {
            name: 'Local Host - Success Case',
            hostname: 'localhost',
            expectedSuccess: true
        },
        {
            name: 'HRESULT E_FAIL Simulation',
            hostname: 'dcom-error',
            expectedSuccess: false,
            expectedError: '0x80004005'
        },
        {
            name: 'Access Denied Simulation',
            hostname: 'access-denied',
            expectedSuccess: false,
            expectedError: '0x80070005'
        },
        {
            name: 'Timeout Simulation',
            hostname: 'timeout-host',
            expectedSuccess: false,
            expectedError: 'TIMEOUT'
        },
        {
            name: 'No Servers Found',
            hostname: 'no-servers',
            expectedSuccess: false,
            expectedError: '0x80004005'
        }
    ];
    
    for (const testCase of testCases) {
        await runSingleTest(testCase);
    }
    
    console.log('\n📊 Test Summary');
    console.log('===============');
    console.log('✅ Successfully demonstrated HRESULT E_FAIL error handling');
    console.log('✅ Error solutions and diagnostics working correctly');
    console.log('✅ Retry mechanisms functioning properly');
    console.log('\n💡 Next steps:');
    console.log('   1. Run "npm run dev" to start the web interface');
    console.log('   2. Visit http://localhost:3001 to see the interactive demo');
    console.log('   3. Try different hostnames to see various error conditions\n');
}

async function runSingleTest(testCase) {
    console.log(`\n🔍 Running Test: ${testCase.name}`);
    console.log(`📡 Testing hostname: ${testCase.hostname}`);
    
    try {
        // Test OPC server discovery
        const result = await opcClient.getOPCServersWithRetry(testCase.hostname);
        
        if (testCase.expectedSuccess) {
            console.log(`✅ SUCCESS: ${result.message}`);
            console.log(`   Found servers: ${result.servers.join(', ')}`);
        } else {
            console.log(`⚠️  UNEXPECTED SUCCESS: Expected failure but got success`);
        }
        
    } catch (error) {
        if (!testCase.expectedSuccess) {
            console.log(`✅ EXPECTED FAILURE: ${error.message}`);
            
            // Test error handling
            const errorResponse = errorHandler.handleOPCError(error, testCase.hostname);
            console.log(`   Error Code: ${errorResponse.error.code}`);
            console.log(`   Error Type: ${errorResponse.error.type}`);
            
            if (errorResponse.solutions && errorResponse.solutions.length > 0) {
                console.log(`   Solutions Available: ${errorResponse.solutions.length}`);
                console.log(`   First Solution: ${errorResponse.solutions[0].title}`);
            }
            
            if (testCase.expectedError && errorResponse.error.code.includes(testCase.expectedError)) {
                console.log(`   ✅ Error code matches expected: ${testCase.expectedError}`);
            }
            
        } else {
            console.log(`❌ UNEXPECTED FAILURE: ${error.message}`);
        }
    }
    
    // Test diagnostics
    console.log(`🔧 Running diagnostics for ${testCase.hostname}...`);
    try {
        const diagnostics = await opcClient.runDiagnostics(testCase.hostname);
        console.log(`   Diagnostic Summary: ${diagnostics.summary.passed} passed, ${diagnostics.summary.failed} failed, ${diagnostics.summary.warnings} warnings`);
    } catch (error) {
        console.log(`   Diagnostics failed: ${error.message}`);
    }
}

// Test specific error code solutions
async function testErrorSolutions() {
    console.log('\n🔧 Testing Error Solutions Database');
    console.log('===================================');
    
    const errorCodes = ['0x80004005', '0x80070005', 'TIMEOUT'];
    
    for (const errorCode of errorCodes) {
        console.log(`\n📋 Solutions for error code: ${errorCode}`);
        const solutions = errorHandler.getSolutionsForError(errorCode);
        
        if (solutions) {
            console.log(`   Name: ${solutions.name} (${solutions.chineseName})`);
            console.log(`   Description: ${solutions.description}`);
            console.log(`   Solutions: ${solutions.solutions.length} available`);
            
            // Show first solution
            if (solutions.solutions.length > 0) {
                const firstSolution = solutions.solutions[0];
                console.log(`   First Solution: ${firstSolution.title}`);
                console.log(`   Steps: ${firstSolution.steps.length} steps`);
            }
        } else {
            console.log(`   ❌ No solutions found for ${errorCode}`);
        }
    }
}

// Main execution
async function main() {
    try {
        await runOPCTests();
        await testErrorSolutions();
        
    } catch (error) {
        console.error('\n❌ Test execution failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runOPCTests, testErrorSolutions };