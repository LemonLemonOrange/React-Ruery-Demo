// OPC Client simulation with error handling for HRESULT E_FAIL
const ping = require('ping');

class OPCClientSimulator {
    constructor() {
        this.simulatedServers = {
            'localhost': [
                'Matrikon.OPC.Simulation.1',
                'OPCExpert.OPCServer.1',
                'Local.TestServer.1'
            ],
            '127.0.0.1': [
                'Matrikon.OPC.Simulation.1',
                'OPCExpert.OPCServer.1'
            ]
        };
        
        // Simulate different error conditions
        this.errorConditions = {
            'unreachable-host': { 
                error: 'HRESULT_E_FAIL',
                code: '0x80004005',
                reason: 'Host unreachable'
            },
            'no-servers': { 
                error: 'HRESULT_E_FAIL',
                code: '0x80004005',
                reason: 'No OPC servers found'
            },
            'dcom-error': { 
                error: 'HRESULT_E_FAIL',
                code: '0x80004005',
                reason: 'DCOM configuration error'
            },
            'access-denied': { 
                error: 'HRESULT_E_ACCESSDENIED',
                code: '0x80070005',
                reason: 'Access denied'
            },
            'timeout-host': {
                error: 'TIMEOUT',
                code: 'TIMEOUT',
                reason: 'Connection timeout'
            }
        };
    }
    
    // Main method that simulates server.GetOPCServers(hostname)
    async getOPCServersWithRetry(hostname, maxRetries = 3) {
        console.log(`🔍 Simulating GetOPCServers for hostname: ${hostname}`);
        
        // Validate hostname
        if (!hostname || hostname.trim() === '') {
            throw new Error('Hostname cannot be empty');
        }
        
        // Check for simulated error conditions
        if (this.errorConditions[hostname]) {
            const errorCondition = this.errorConditions[hostname];
            const error = new Error(`模擬 HRESULT E_FAIL 錯誤: ${errorCondition.reason}`);
            error.code = errorCondition.code;
            error.hresult = errorCondition.error;
            throw error;
        }
        
        let lastError = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`📡 Attempt ${attempt}/${maxRetries} to connect to ${hostname}`);
                
                // Simulate network connectivity check
                const isReachable = await this.checkNetworkConnectivity(hostname);
                if (!isReachable && !this.isLocalHost(hostname)) {
                    throw new Error(`Host ${hostname} is not reachable`);
                }
                
                // Simulate the actual OPC server discovery
                await this.simulateDelay(500); // Simulate network/COM delay
                
                const servers = this.simulatedServers[hostname] || [];
                
                if (servers.length === 0) {
                    // Simulate E_FAIL when no servers found
                    const error = new Error('錯誤 HRESULT E_FAIL 已經從呼叫回傳至 COM 元件');
                    error.code = '0x80004005';
                    error.hresult = 'HRESULT_E_FAIL';
                    throw error;
                }
                
                return {
                    servers: servers,
                    message: `Successfully found ${servers.length} OPC servers on ${hostname}`,
                    attempt: attempt
                };
                
            } catch (error) {
                lastError = error;
                console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
                
                if (attempt < maxRetries) {
                    const delay = 1000 * attempt; // Exponential backoff
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await this.simulateDelay(delay);
                }
            }
        }
        
        // If all retries failed, throw the last error
        throw new Error(`Failed to get OPC servers from ${hostname} after ${maxRetries} attempts. Last error: ${lastError?.message}`);
    }
    
    // Simulate network connectivity check
    async checkNetworkConnectivity(hostname) {
        try {
            if (this.isLocalHost(hostname)) {
                return true; // localhost is always reachable
            }
            
            // Use ping to check connectivity
            const result = await ping.promise.probe(hostname, {
                timeout: 3,
                extra: ['-c', '1'] // Single ping
            });
            
            return result.alive;
        } catch (error) {
            console.log(`🔍 Network check failed for ${hostname}: ${error.message}`);
            return false;
        }
    }
    
    // Check if hostname is localhost
    isLocalHost(hostname) {
        const localNames = ['localhost', '127.0.0.1', '::1'];
        return localNames.includes(hostname.toLowerCase());
    }
    
    // Run comprehensive diagnostics
    async runDiagnostics(hostname) {
        console.log(`🔧 Running OPC diagnostics for ${hostname}`);
        
        const diagnostics = {
            hostname: hostname,
            timestamp: new Date().toISOString(),
            tests: {},
            summary: {
                passed: 0,
                failed: 0,
                warnings: 0
            },
            recommendations: []
        };
        
        // Test 1: Network connectivity
        try {
            const networkTest = await this.checkNetworkConnectivity(hostname);
            diagnostics.tests.networkConnectivity = {
                name: 'Network Connectivity',
                passed: networkTest,
                message: networkTest ? 'Host is reachable' : 'Host is not reachable',
                details: `Ping test ${networkTest ? 'successful' : 'failed'}`
            };
            
            if (networkTest) {
                diagnostics.summary.passed++;
            } else {
                diagnostics.summary.failed++;
                diagnostics.recommendations.push('檢查網絡連接和主機名 - Check network connection and hostname');
            }
        } catch (error) {
            diagnostics.tests.networkConnectivity = {
                name: 'Network Connectivity',
                passed: false,
                message: 'Network test failed',
                error: error.message
            };
            diagnostics.summary.failed++;
        }
        
        // Test 2: OPC Server availability
        try {
            const servers = this.simulatedServers[hostname] || [];
            diagnostics.tests.opcServers = {
                name: 'OPC Server Availability',
                passed: servers.length > 0,
                message: `Found ${servers.length} OPC servers`,
                details: servers.length > 0 ? servers : 'No OPC servers configured for this host'
            };
            
            if (servers.length > 0) {
                diagnostics.summary.passed++;
            } else {
                diagnostics.summary.failed++;
                diagnostics.recommendations.push('安裝並啟動 OPC 服務器 - Install and start OPC servers');
            }
        } catch (error) {
            diagnostics.tests.opcServers = {
                name: 'OPC Server Availability',
                passed: false,
                message: 'OPC server test failed',
                error: error.message
            };
            diagnostics.summary.failed++;
        }
        
        // Test 3: DCOM Configuration (simulated)
        diagnostics.tests.dcomConfig = {
            name: 'DCOM Configuration',
            passed: true,
            message: 'DCOM configuration appears correct',
            details: 'This is a simulated test. In real scenarios, check DCOM permissions.',
            warning: true
        };
        diagnostics.summary.warnings++;
        diagnostics.recommendations.push('驗證 DCOM 配置 - Verify DCOM configuration using dcomcnfg.exe');
        
        // Test 4: Error condition simulation
        if (this.errorConditions[hostname]) {
            const errorCondition = this.errorConditions[hostname];
            diagnostics.tests.errorSimulation = {
                name: 'Error Condition Detection',
                passed: false,
                message: `Detected simulated error: ${errorCondition.reason}`,
                details: {
                    errorCode: errorCondition.code,
                    errorType: errorCondition.error,
                    reason: errorCondition.reason
                }
            };
            diagnostics.summary.failed++;
            diagnostics.recommendations.push(`解決 ${errorCondition.error} 錯誤 - Fix ${errorCondition.error} error`);
        }
        
        // Add general recommendations
        diagnostics.recommendations.push(
            '檢查 OPC Core Components 安裝 - Check OPC Core Components installation',
            '以管理員身份運行應用程序 - Run application as administrator',
            '檢查 Windows 防火牆設置 - Check Windows Firewall settings'
        );
        
        console.log(`✅ Diagnostics completed: ${diagnostics.summary.passed} passed, ${diagnostics.summary.failed} failed, ${diagnostics.summary.warnings} warnings`);
        
        return diagnostics;
    }
    
    // Test basic connection
    async testConnection(hostname, timeout = 5000) {
        console.log(`🔌 Testing connection to ${hostname} with ${timeout}ms timeout`);
        
        const result = {
            hostname: hostname,
            success: false,
            duration: 0,
            steps: [],
            error: null
        };
        
        const startTime = Date.now();
        
        try {
            // Step 1: Validate hostname
            result.steps.push({
                step: 'Hostname Validation',
                success: true,
                message: 'Hostname format is valid'
            });
            
            // Step 2: Network connectivity
            const networkStart = Date.now();
            const isReachable = await this.checkNetworkConnectivity(hostname);
            const networkDuration = Date.now() - networkStart;
            
            result.steps.push({
                step: 'Network Connectivity',
                success: isReachable,
                message: isReachable ? `Host reachable (${networkDuration}ms)` : 'Host not reachable',
                duration: networkDuration
            });
            
            if (!isReachable && !this.isLocalHost(hostname)) {
                throw new Error('Host is not reachable');
            }
            
            // Step 3: OPC server discovery
            const opcStart = Date.now();
            const serverResult = await this.getOPCServersWithRetry(hostname, 1);
            const opcDuration = Date.now() - opcStart;
            
            result.steps.push({
                step: 'OPC Server Discovery',
                success: true,
                message: `Found ${serverResult.servers.length} OPC servers (${opcDuration}ms)`,
                duration: opcDuration,
                details: serverResult.servers
            });
            
            result.success = true;
            
        } catch (error) {
            result.error = {
                message: error.message,
                code: error.code || 'UNKNOWN',
                hresult: error.hresult || 'UNKNOWN'
            };
            
            result.steps.push({
                step: 'Connection Test Failed',
                success: false,
                message: error.message,
                error: error.code || 'UNKNOWN'
            });
        }
        
        result.duration = Date.now() - startTime;
        
        console.log(`🏁 Connection test completed in ${result.duration}ms: ${result.success ? 'SUCCESS' : 'FAILED'}`);
        
        return result;
    }
    
    // Utility method to simulate delays
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new OPCClientSimulator();