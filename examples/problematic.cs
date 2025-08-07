// 這是導致 HRESULT E_FAIL 錯誤的問題代碼示例
// This is the problematic code example that causes HRESULT E_FAIL error

using System;
using System.Runtime.InteropServices;
using OPCAutomation; // Reference to OPC Automation library

namespace OPCDemo
{
    public class ProblematicOPCClient
    {
        private OPCServer server;
        
        public ProblematicOPCClient()
        {
            server = new OPCServer();
        }
        
        // 這個方法會導致 HRESULT E_FAIL 錯誤
        // This method will cause HRESULT E_FAIL error
        public void GetServersWithoutErrorHandling(string hostName)
        {
            try
            {
                // ❌ 問題代碼：沒有適當的錯誤處理
                // ❌ Problematic code: No proper error handling
                object progIds = server.GetOPCServers(hostName);
                
                // 如果到達這裡，打印服務器列表
                // If we reach here, print server list
                Console.WriteLine($"Found servers: {progIds}");
            }
            catch (Exception ex)
            {
                // 簡單的錯誤處理，沒有提供有用的診斷信息
                // Simple error handling, doesn't provide useful diagnostic info
                Console.WriteLine($"Error: {ex.Message}");
                throw; // 重新拋出異常，沒有恢復機制
            }
        }
        
        // 常見導致問題的用法模式
        // Common problematic usage patterns
        public void CommonMistakes()
        {
            // ❌ 錯誤 1：直接調用遠程主機而不檢查連接
            // ❌ Mistake 1: Directly calling remote host without checking connectivity
            server.GetOPCServers("remote-host");
            
            // ❌ 錯誤 2：沒有設置超時
            // ❌ Mistake 2: No timeout configuration
            server.GetOPCServers("slow-host");
            
            // ❌ 錯誤 3：不檢查本地服務器是否可用
            // ❌ Mistake 3: Not checking if local servers are available first
            server.GetOPCServers("localhost");
            
            // ❌ 錯誤 4：沒有驗證主機名格式
            // ❌ Mistake 4: Not validating hostname format
            server.GetOPCServers("invalid..hostname");
        }
    }
}

/* 
常見的 HRESULT E_FAIL 錯誤原因：
Common causes of HRESULT E_FAIL errors:

1. OPC Server 未在目標主機上運行
   OPC Server not running on target host

2. DCOM 配置問題（權限、身份驗證）
   DCOM configuration issues (permissions, authentication)

3. 網絡連接問題或防火牆阻止
   Network connectivity issues or firewall blocking

4. 主機名解析失敗
   Hostname resolution failure

5. OPC Core Components 未正確安裝
   OPC Core Components not properly installed

6. 用戶權限不足
   Insufficient user permissions

7. COM+ 服務未運行
   COM+ service not running
*/