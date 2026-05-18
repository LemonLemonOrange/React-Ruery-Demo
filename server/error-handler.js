// Error handler for OPC automation errors, specifically HRESULT E_FAIL
class OPCErrorHandler {
    constructor() {
        this.errorSolutions = this.initializeErrorSolutions();
    }
    
    // Initialize comprehensive error solutions database
    initializeErrorSolutions() {
        return {
            // HRESULT E_FAIL (0x80004005)
            '0x80004005': {
                name: 'HRESULT E_FAIL',
                chineseName: '通用失敗錯誤',
                description: 'Generic failure error commonly occurs in OPC automation',
                chineseDescription: 'OPC 自動化中常見的通用失敗錯誤',
                commonCauses: [
                    'OPC Server is not running on the target host',
                    'DCOM configuration issues',
                    'Network connectivity problems',
                    'Insufficient permissions',
                    'OPC Core Components not properly installed',
                    'Firewall blocking OPC communications'
                ],
                commonCausesChines: [
                    'OPC 服務器未在目標主機上運行',
                    'DCOM 配置問題',
                    '網絡連接問題',
                    '權限不足',
                    'OPC 核心組件未正確安裝',
                    '防火牆阻止 OPC 通信'
                ],
                solutions: [
                    {
                        title: 'Check OPC Server Status',
                        titleChinese: '檢查 OPC 服務器狀態',
                        steps: [
                            'Verify OPC server is installed on target host',
                            'Check if OPC server service is running',
                            'Test with OPC client tools like OPC Expert',
                            'Verify server ProgID is correct'
                        ],
                        stepsChinese: [
                            '驗證目標主機上已安裝 OPC 服務器',
                            '檢查 OPC 服務器服務是否正在運行',
                            '使用 OPC Expert 等 OPC 客戶端工具測試',
                            '驗證服務器 ProgID 是否正確'
                        ]
                    },
                    {
                        title: 'Configure DCOM Settings',
                        titleChinese: '配置 DCOM 設置',
                        steps: [
                            'Run dcomcnfg.exe as administrator',
                            'Navigate to Component Services > Computers > My Computer > DCOM Config',
                            'Find your OPC Server application',
                            'Right-click > Properties > Security',
                            'Configure Launch and Activation Permissions',
                            'Configure Access Permissions',
                            'Set Authentication Level to "None" if needed'
                        ],
                        stepsChinese: [
                            '以管理員身份運行 dcomcnfg.exe',
                            '導航到組件服務 > 計算機 > 我的電腦 > DCOM 配置',
                            '找到您的 OPC 服務器應用程序',
                            '右鍵點擊 > 屬性 > 安全',
                            '配置啟動和激活權限',
                            '配置訪問權限',
                            '如需要，將身份驗證級別設置為"無"'
                        ]
                    },
                    {
                        title: 'Network and Connectivity',
                        titleChinese: '網絡和連接性',
                        steps: [
                            'Test network connectivity with ping',
                            'Check Windows Firewall settings',
                            'Verify hostname resolution',
                            'Test local connections first',
                            'Check port availability (usually 135 for DCOM)'
                        ],
                        stepsChinese: [
                            '使用 ping 測試網絡連接',
                            '檢查 Windows 防火牆設置',
                            '驗證主機名解析',
                            '首先測試本地連接',
                            '檢查端口可用性（DCOM 通常使用 135）'
                        ]
                    }
                ]
            },
            
            // HRESULT E_ACCESSDENIED (0x80070005)
            '0x80070005': {
                name: 'HRESULT E_ACCESSDENIED',
                chineseName: '訪問被拒絕錯誤',
                description: 'Access denied error in OPC operations',
                chineseDescription: 'OPC 操作中的訪問被拒絕錯誤',
                commonCauses: [
                    'Insufficient user permissions',
                    'DCOM security settings too restrictive',
                    'OPC server requires administrator privileges',
                    'User not in required security groups'
                ],
                commonCausesChines: [
                    '用戶權限不足',
                    'DCOM 安全設置過於嚴格',
                    'OPC 服務器需要管理員權限',
                    '用戶不在所需的安全組中'
                ],
                solutions: [
                    {
                        title: 'Run as Administrator',
                        titleChinese: '以管理員身份運行',
                        steps: [
                            'Run your application as administrator',
                            'Check if OPC server requires admin privileges',
                            'Verify user account permissions'
                        ],
                        stepsChinese: [
                            '以管理員身份運行您的應用程序',
                            '檢查 OPC 服務器是否需要管理員權限',
                            '驗證用戶帳戶權限'
                        ]
                    },
                    {
                        title: 'DCOM Security Configuration',
                        titleChinese: 'DCOM 安全配置',
                        steps: [
                            'Open dcomcnfg.exe',
                            'Configure security permissions for OPC server',
                            'Add current user to allowed users list',
                            'Grant Launch, Access, and Configuration permissions'
                        ],
                        stepsChinese: [
                            '打開 dcomcnfg.exe',
                            '為 OPC 服務器配置安全權限',
                            '將當前用戶添加到允許用戶列表',
                            '授予啟動、訪問和配置權限'
                        ]
                    }
                ]
            },
            
            // Timeout Error
            'TIMEOUT': {
                name: 'Connection Timeout',
                chineseName: '連接超時',
                description: 'Connection attempt timed out',
                chineseDescription: '連接嘗試超時',
                commonCauses: [
                    'Slow network connection',
                    'OPC server is unresponsive',
                    'Firewall blocking connection',
                    'DCOM timeout settings too low'
                ],
                commonCausesChines: [
                    '網絡連接緩慢',
                    'OPC 服務器無響應',
                    '防火牆阻止連接',
                    'DCOM 超時設置過低'
                ],
                solutions: [
                    {
                        title: 'Increase Timeout Values',
                        titleChinese: '增加超時值',
                        steps: [
                            'Increase connection timeout in your application',
                            'Configure DCOM timeout settings',
                            'Check network latency',
                            'Test with local connections first'
                        ],
                        stepsChinese: [
                            '在應用程序中增加連接超時',
                            '配置 DCOM 超時設置',
                            '檢查網絡延遲',
                            '首先使用本地連接測試'
                        ]
                    }
                ]
            }
        };
    }
    
    // Handle OPC errors and provide comprehensive error information
    handleOPCError(error, hostname) {
        const errorInfo = {
            success: false,
            hostname: hostname,
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN',
                hresult: error.hresult || 'UNKNOWN',
                type: this.getErrorType(error)
            },
            solutions: [],
            recommendations: [],
            timestamp: new Date().toISOString()
        };
        
        // Get solutions for the specific error code
        const solutions = this.getSolutionsForError(error.code || error.hresult);
        if (solutions) {
            errorInfo.solutions = solutions.solutions || [];
            errorInfo.errorDescription = {
                name: solutions.name,
                chineseName: solutions.chineseName,
                description: solutions.description,
                chineseDescription: solutions.chineseDescription,
                commonCauses: solutions.commonCauses || [],
                commonCausesChines: solutions.commonCausesChines || []
            };
        }
        
        // Add general recommendations
        errorInfo.recommendations = this.getGeneralRecommendations(error, hostname);
        
        // Log error for debugging
        this.logError(error, hostname, errorInfo);
        
        return errorInfo;
    }
    
    // Get solutions for a specific error code
    getSolutionsForError(errorCode) {
        if (!errorCode) return null;
        
        // Handle different error code formats
        const normalizedCode = this.normalizeErrorCode(errorCode);
        return this.errorSolutions[normalizedCode] || null;
    }
    
    // Normalize error codes to standard format
    normalizeErrorCode(errorCode) {
        if (typeof errorCode === 'string') {
            // Handle HRESULT string representations
            if (errorCode.includes('0x')) {
                return errorCode.toLowerCase();
            }
            if (errorCode.includes('E_FAIL')) {
                return '0x80004005';
            }
            if (errorCode.includes('E_ACCESSDENIED')) {
                return '0x80070005';
            }
            if (errorCode.includes('TIMEOUT')) {
                return 'TIMEOUT';
            }
        }
        
        // Handle numeric error codes
        if (typeof errorCode === 'number') {
            return '0x' + errorCode.toString(16).toLowerCase();
        }
        
        return errorCode;
    }
    
    // Determine error type based on error characteristics
    getErrorType(error) {
        if (error.code && error.code.includes('0x80004005')) {
            return 'HRESULT_E_FAIL';
        }
        if (error.code && error.code.includes('0x80070005')) {
            return 'HRESULT_E_ACCESSDENIED';
        }
        if (error.message && error.message.includes('timeout')) {
            return 'TIMEOUT';
        }
        if (error.message && error.message.includes('reachable')) {
            return 'NETWORK_ERROR';
        }
        return 'UNKNOWN';
    }
    
    // Get general recommendations based on error and context
    getGeneralRecommendations(error, hostname) {
        const recommendations = [];
        
        // Add recommendations based on hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            recommendations.push(
                '檢查本地 OPC 服務器是否正在運行 - Check if local OPC server is running',
                '驗證 OPC Core Components 安裝 - Verify OPC Core Components installation'
            );
        } else {
            recommendations.push(
                '測試網絡連接性 - Test network connectivity',
                '檢查遠程主機上的 OPC 服務器狀態 - Check OPC server status on remote host',
                '驗證 DCOM 遠程配置 - Verify DCOM remote configuration'
            );
        }
        
        // Add recommendations based on error type
        const errorType = this.getErrorType(error);
        switch (errorType) {
            case 'HRESULT_E_FAIL':
                recommendations.push(
                    '運行 OPC 診斷工具 - Run OPC diagnostic tools',
                    '檢查 Windows 事件日誌 - Check Windows Event Log',
                    '嘗試使用不同的 OPC 客戶端工具測試 - Try testing with different OPC client tools'
                );
                break;
            case 'HRESULT_E_ACCESSDENIED':
                recommendations.push(
                    '以管理員身份運行 - Run as administrator',
                    '檢查用戶帳戶控制 (UAC) 設置 - Check User Account Control (UAC) settings',
                    '驗證安全組成員身份 - Verify security group membership'
                );
                break;
            case 'TIMEOUT':
                recommendations.push(
                    '增加連接超時設置 - Increase connection timeout settings',
                    '檢查網絡性能 - Check network performance',
                    '測試本地連接以排除網絡問題 - Test local connections to rule out network issues'
                );
                break;
            case 'NETWORK_ERROR':
                recommendations.push(
                    '驗證主機名或 IP 地址 - Verify hostname or IP address',
                    '檢查 DNS 解析 - Check DNS resolution',
                    '測試基本網絡連接 (ping) - Test basic network connectivity (ping)'
                );
                break;
        }
        
        // Always add these general recommendations
        recommendations.push(
            '查閱 OPC 服務器文檔 - Consult OPC server documentation',
            '聯系技術支持如問題持續 - Contact technical support if problem persists'
        );
        
        return recommendations;
    }
    
    // Log error information for debugging
    logError(error, hostname, errorInfo) {
        console.error('\n=== OPC Error Details ===');
        console.error(`Hostname: ${hostname}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Code: ${error.code || 'N/A'}`);
        console.error(`HRESULT: ${error.hresult || 'N/A'}`);
        console.error(`Error Type: ${errorInfo.error.type}`);
        console.error(`Timestamp: ${errorInfo.timestamp}`);
        console.error('========================\n');
    }
    
    // Get all available error codes and their descriptions
    getAllErrorCodes() {
        return Object.keys(this.errorSolutions).map(code => ({
            code: code,
            name: this.errorSolutions[code].name,
            chineseName: this.errorSolutions[code].chineseName,
            description: this.errorSolutions[code].description
        }));
    }
    
    // Check if an error code has solutions available
    hasSolutions(errorCode) {
        const normalizedCode = this.normalizeErrorCode(errorCode);
        return !!this.errorSolutions[normalizedCode];
    }
}

module.exports = new OPCErrorHandler();