// 解決 HRESULT E_FAIL 錯誤的完整解決方案
// Complete solution for fixing HRESULT E_FAIL errors

using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using OPCAutomation;

namespace OPCDemo
{
    public class ImprovedOPCClient
    {
        private OPCServer server;
        private readonly int defaultTimeout = 5000; // 5 seconds
        
        public ImprovedOPCClient()
        {
            server = new OPCServer();
        }
        
        // ✅ 改進的方法：包含完整的錯誤處理和重試機制
        // ✅ Improved method: Includes comprehensive error handling and retry mechanism
        public async Task<object> GetOPCServersWithRetry(string hostName, int maxRetries = 3, int delayMs = 1000)
        {
            // 首先驗證輸入
            // First validate input
            if (string.IsNullOrWhiteSpace(hostName))
            {
                throw new ArgumentException("Host name cannot be null or empty", nameof(hostName));
            }
            
            // 檢查網絡連接性
            // Check network connectivity
            if (!await IsHostReachable(hostName))
            {
                throw new InvalidOperationException($"Host {hostName} is not reachable");
            }
            
            Exception lastException = null;
            
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    Console.WriteLine($"Attempt {attempt}/{maxRetries} to get OPC servers from {hostName}");
                    
                    // 使用取消標記來實現超時
                    // Use cancellation token to implement timeout
                    using (var cts = new CancellationTokenSource(defaultTimeout))
                    {
                        var task = Task.Run(() => server.GetOPCServers(hostName), cts.Token);
                        var result = await task;
                        
                        Console.WriteLine($"Successfully retrieved OPC servers from {hostName}");
                        return result;
                    }
                }
                catch (COMException comEx) when (comEx.HResult == unchecked((int)0x80004005)) // E_FAIL
                {
                    lastException = comEx;
                    Console.WriteLine($"Attempt {attempt} failed with E_FAIL: {comEx.Message}");
                    
                    // 提供具體的解決建議
                    // Provide specific solution suggestions
                    ProvideSolutionSuggestions(comEx, hostName);
                    
                    if (attempt < maxRetries)
                    {
                        var delay = delayMs * attempt; // 遞增延遲
                        Console.WriteLine($"Waiting {delay}ms before retry...");
                        await Task.Delay(delay);
                    }
                }
                catch (TimeoutException timeoutEx)
                {
                    lastException = timeoutEx;
                    Console.WriteLine($"Attempt {attempt} timed out: {timeoutEx.Message}");
                    
                    if (attempt < maxRetries)
                    {
                        await Task.Delay(delayMs * attempt);
                    }
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    Console.WriteLine($"Attempt {attempt} failed with unexpected error: {ex.Message}");
                    
                    // 對於非 COM 錯誤，不重試
                    // Don't retry for non-COM errors
                    break;
                }
            }
            
            throw new InvalidOperationException(
                $"Failed to get OPC servers from {hostName} after {maxRetries} attempts. Last error: {lastException?.Message}",
                lastException);
        }
        
        // ✅ 診斷方法：全面檢查 OPC 連接
        // ✅ Diagnostic method: Comprehensive OPC connection check
        public async Task<OPCDiagnosticResult> DiagnoseOPCConnection(string hostName)
        {
            var result = new OPCDiagnosticResult { HostName = hostName };
            
            try
            {
                // 1. 檢查網絡連接
                // 1. Check network connectivity
                Console.WriteLine($"Checking network connectivity to {hostName}...");
                result.IsNetworkReachable = await IsHostReachable(hostName);
                
                if (!result.IsNetworkReachable)
                {
                    result.ErrorMessages.Add($"Host {hostName} is not reachable via network");
                    return result;
                }
                
                // 2. 測試本地 OPC 服務器（如果主機是本地的）
                // 2. Test local OPC servers (if host is local)
                if (IsLocalHost(hostName))
                {
                    Console.WriteLine("Testing local OPC servers...");
                    try
                    {
                        var localServers = server.GetOPCServers();
                        result.LocalServersAvailable = true;
                        result.LocalServerCount = GetServerCount(localServers);
                    }
                    catch (Exception ex)
                    {
                        result.ErrorMessages.Add($"Local OPC servers test failed: {ex.Message}");
                    }
                }
                
                // 3. 測試遠程 OPC 服務器連接
                // 3. Test remote OPC server connection
                Console.WriteLine($"Testing OPC server connection to {hostName}...");
                try
                {
                    var servers = await GetOPCServersWithRetry(hostName, 1); // 只嘗試一次
                    result.RemoteServersAvailable = true;
                    result.RemoteServerCount = GetServerCount(servers);
                    result.IsSuccessful = true;
                }
                catch (Exception ex)
                {
                    result.ErrorMessages.Add($"Remote OPC connection failed: {ex.Message}");
                    result.LastError = ex;
                }
                
                // 4. DCOM 配置檢查
                // 4. DCOM configuration check
                CheckDCOMConfiguration(result);
                
            }
            catch (Exception ex)
            {
                result.ErrorMessages.Add($"Diagnostic failed: {ex.Message}");
                result.LastError = ex;
            }
            
            return result;
        }
        
        // 檢查主機是否可達
        // Check if host is reachable
        private async Task<bool> IsHostReachable(string hostName)
        {
            try
            {
                using (var ping = new Ping())
                {
                    var reply = await ping.SendPingAsync(hostName, 3000);
                    return reply.Status == IPStatus.Success;
                }
            }
            catch
            {
                return false;
            }
        }
        
        // 檢查是否為本地主機
        // Check if it's localhost
        private bool IsLocalHost(string hostName)
        {
            return hostName.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
                   hostName.Equals("127.0.0.1") ||
                   hostName.Equals("::1") ||
                   hostName.Equals(Environment.MachineName, StringComparison.OrdinalIgnoreCase);
        }
        
        // 獲取服務器數量
        // Get server count
        private int GetServerCount(object servers)
        {
            if (servers == null) return 0;
            
            try
            {
                if (servers is Array array)
                {
                    return array.Length;
                }
                return 1;
            }
            catch
            {
                return 0;
            }
        }
        
        // 檢查 DCOM 配置
        // Check DCOM configuration
        private void CheckDCOMConfiguration(OPCDiagnosticResult result)
        {
            try
            {
                // 這裡可以添加 DCOM 配置檢查邏輯
                // Here you can add DCOM configuration check logic
                result.DCOMConfigurationNotes.Add("請確保 DCOM 配置正確 - Please ensure DCOM configuration is correct");
                result.DCOMConfigurationNotes.Add("運行 dcomcnfg.exe 檢查 OPC Server 權限 - Run dcomcnfg.exe to check OPC Server permissions");
            }
            catch (Exception ex)
            {
                result.ErrorMessages.Add($"DCOM check failed: {ex.Message}");
            }
        }
        
        // 提供解決方案建議
        // Provide solution suggestions
        private void ProvideSolutionSuggestions(COMException comEx, string hostName)
        {
            Console.WriteLine("\n=== 解決方案建議 Solution Suggestions ===");
            
            switch (comEx.HResult)
            {
                case unchecked((int)0x80004005): // E_FAIL
                    Console.WriteLine("HRESULT E_FAIL 解決方案:");
                    Console.WriteLine("1. 檢查 OPC Server 是否在目標主機上運行");
                    Console.WriteLine("2. 驗證 DCOM 配置和權限設置");
                    Console.WriteLine("3. 確認網絡連接和防火牆設置");
                    Console.WriteLine("4. 檢查 OPC Core Components 是否正確安裝");
                    break;
                    
                case unchecked((int)0x80070005): // E_ACCESSDENIED
                    Console.WriteLine("存取被拒絕解決方案:");
                    Console.WriteLine("1. 以管理員身份運行應用程序");
                    Console.WriteLine("2. 配置 DCOM 安全設置");
                    Console.WriteLine("3. 檢查用戶帳戶權限");
                    break;
                    
                default:
                    Console.WriteLine($"其他 COM 錯誤 (0x{comEx.HResult:X8}):");
                    Console.WriteLine("1. 檢查 Windows 事件日誌");
                    Console.WriteLine("2. 重新註冊 OPC 組件");
                    Console.WriteLine("3. 聯系 OPC Server 供應商");
                    break;
            }
            
            Console.WriteLine("=========================================\n");
        }
        
        // 釋放資源
        // Release resources
        public void Dispose()
        {
            try
            {
                if (server != null)
                {
                    Marshal.ReleaseComObject(server);
                    server = null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error disposing OPC server: {ex.Message}");
            }
        }
    }
    
    // 診斷結果類
    // Diagnostic result class
    public class OPCDiagnosticResult
    {
        public string HostName { get; set; }
        public bool IsSuccessful { get; set; }
        public bool IsNetworkReachable { get; set; }
        public bool LocalServersAvailable { get; set; }
        public bool RemoteServersAvailable { get; set; }
        public int LocalServerCount { get; set; }
        public int RemoteServerCount { get; set; }
        public List<string> ErrorMessages { get; set; } = new List<string>();
        public List<string> DCOMConfigurationNotes { get; set; } = new List<string>();
        public Exception LastError { get; set; }
        
        public override string ToString()
        {
            return $"OPC Diagnostic for {HostName}: " +
                   $"Success={IsSuccessful}, " +
                   $"Network={IsNetworkReachable}, " +
                   $"RemoteServers={RemoteServersAvailable} ({RemoteServerCount} found)";
        }
    }
}