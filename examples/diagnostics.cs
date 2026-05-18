// OPC 連接診斷工具
// OPC Connection Diagnostic Tool

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.ServiceProcess;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace OPCDemo
{
    public class OPCDiagnosticTool
    {
        // 運行完整的 OPC 系統診斷
        // Run complete OPC system diagnostic
        public static async Task<ComprehensiveDiagnosticResult> RunComprehensiveDiagnostic(string hostName = "localhost")
        {
            var result = new ComprehensiveDiagnosticResult { HostName = hostName };
            
            Console.WriteLine("=== OPC 系統診斷開始 OPC System Diagnostic Started ===\n");
            
            try
            {
                // 1. 系統環境檢查
                await CheckSystemEnvironment(result);
                
                // 2. OPC 組件檢查
                await CheckOPCComponents(result);
                
                // 3. DCOM 配置檢查
                await CheckDCOMConfiguration(result);
                
                // 4. 網絡連接檢查
                await CheckNetworkConnectivity(result);
                
                // 5. 服務狀態檢查
                await CheckWindowsServices(result);
                
                // 6. 防火牆設置檢查
                await CheckFirewallSettings(result);
                
                // 7. 事件日誌檢查
                await CheckEventLogs(result);
                
            }
            catch (Exception ex)
            {
                result.GeneralErrors.Add($"Diagnostic failed: {ex.Message}");
            }
            
            Console.WriteLine("\n=== OPC 系統診斷完成 OPC System Diagnostic Completed ===");
            
            return result;
        }
        
        // 檢查系統環境
        private static async Task CheckSystemEnvironment(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("1. 檢查系統環境 Checking System Environment...");
            
            try
            {
                result.SystemInfo.OSVersion = Environment.OSVersion.ToString();
                result.SystemInfo.MachineName = Environment.MachineName;
                result.SystemInfo.UserName = Environment.UserName;
                result.SystemInfo.Is64BitOS = Environment.Is64BitOperatingSystem;
                result.SystemInfo.Is64BitProcess = Environment.Is64BitProcess;
                result.SystemInfo.CLRVersion = Environment.Version.ToString();
                
                Console.WriteLine($"   OS: {result.SystemInfo.OSVersion}");
                Console.WriteLine($"   Machine: {result.SystemInfo.MachineName}");
                Console.WriteLine($"   User: {result.SystemInfo.UserName}");
                Console.WriteLine($"   64-bit OS: {result.SystemInfo.Is64BitOS}");
                Console.WriteLine($"   64-bit Process: {result.SystemInfo.Is64BitProcess}");
            }
            catch (Exception ex)
            {
                result.GeneralErrors.Add($"System environment check failed: {ex.Message}");
            }
        }
        
        // 檢查 OPC 組件
        private static async Task CheckOPCComponents(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n2. 檢查 OPC 組件 Checking OPC Components...");
            
            var componentsToCheck = new[]
            {
                "OPC.Automation.1",
                "OPCExpert.OPCServer.1",
                "Matrikon.OPC.Simulation.1",
                "RSLinx.OPCServer.1"
            };
            
            foreach (var component in componentsToCheck)
            {
                try
                {
                    var type = Type.GetTypeFromProgID(component);
                    if (type != null)
                    {
                        result.OPCComponents.RegisteredComponents.Add(component);
                        Console.WriteLine($"   ✓ Found: {component}");
                    }
                    else
                    {
                        Console.WriteLine($"   ✗ Not found: {component}");
                    }
                }
                catch (Exception ex)
                {
                    result.OPCComponents.ComponentErrors.Add($"Error checking {component}: {ex.Message}");
                    Console.WriteLine($"   ✗ Error checking {component}: {ex.Message}");
                }
            }
            
            // 檢查 OPC Core Components
            CheckOPCCoreComponents(result);
        }
        
        // 檢查 OPC Core Components
        private static void CheckOPCCoreComponents(ComprehensiveDiagnosticResult result)
        {
            try
            {
                // 檢查註冊表中的 OPC Core Components
                using (var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Classes\OPC.Automation"))
                {
                    if (key != null)
                    {
                        result.OPCComponents.HasOPCCoreComponents = true;
                        Console.WriteLine("   ✓ OPC Core Components found");
                    }
                    else
                    {
                        Console.WriteLine("   ✗ OPC Core Components not found");
                        result.OPCComponents.ComponentErrors.Add("OPC Core Components not installed");
                    }
                }
            }
            catch (Exception ex)
            {
                result.OPCComponents.ComponentErrors.Add($"OPC Core Components check failed: {ex.Message}");
            }
        }
        
        // 檢查 DCOM 配置
        private static async Task CheckDCOMConfiguration(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n3. 檢查 DCOM 配置 Checking DCOM Configuration...");
            
            try
            {
                // 檢查 DCOM 配置工具是否可用
                var dcomcnfgPath = Path.Combine(Environment.SystemDirectory, "dcomcnfg.exe");
                if (File.Exists(dcomcnfgPath))
                {
                    result.DCOMInfo.DCOMConfigToolAvailable = true;
                    Console.WriteLine("   ✓ DCOM configuration tool available");
                }
                else
                {
                    Console.WriteLine("   ✗ DCOM configuration tool not found");
                }
                
                // 提供 DCOM 配置建議
                result.DCOMInfo.ConfigurationSuggestions.AddRange(new[]
                {
                    "1. 運行 dcomcnfg.exe 作為管理員",
                    "2. 導航到 Component Services > Computers > My Computer > DCOM Config",
                    "3. 找到 OPC Server 應用程序",
                    "4. 右鍵點擊 > Properties > Security",
                    "5. 配置 Launch and Activation Permissions",
                    "6. 配置 Access Permissions",
                    "7. 在 Authentication 選項卡中設置為 'None'"
                });
                
            }
            catch (Exception ex)
            {
                result.GeneralErrors.Add($"DCOM configuration check failed: {ex.Message}");
            }
        }
        
        // 檢查網絡連接
        private static async Task CheckNetworkConnectivity(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n4. 檢查網絡連接 Checking Network Connectivity...");
            
            var hostsToTest = new[] { "localhost", "127.0.0.1", result.HostName };
            
            foreach (var host in hostsToTest.Distinct())
            {
                try
                {
                    using (var ping = new Ping())
                    {
                        var reply = await ping.SendPingAsync(host, 3000);
                        var success = reply.Status == IPStatus.Success;
                        
                        result.NetworkInfo.PingResults[host] = new PingResult
                        {
                            Success = success,
                            RoundtripTime = success ? reply.RoundtripTime : 0,
                            Status = reply.Status.ToString()
                        };
                        
                        Console.WriteLine($"   {(success ? "✓" : "✗")} Ping {host}: {reply.Status} ({reply.RoundtripTime}ms)");
                    }
                }
                catch (Exception ex)
                {
                    result.NetworkInfo.PingResults[host] = new PingResult
                    {
                        Success = false,
                        Error = ex.Message
                    };
                    Console.WriteLine($"   ✗ Ping {host} failed: {ex.Message}");
                }
            }
        }
        
        // 檢查 Windows 服務
        private static async Task CheckWindowsServices(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n5. 檢查 Windows 服務 Checking Windows Services...");
            
            var servicesToCheck = new[]
            {
                "RpcSs",      // Remote Procedure Call
                "DcomLaunch", // DCOM Server Process Launcher
                "COMSysApp",  // COM+ System Application
                "EventLog"    // Windows Event Log
            };
            
            foreach (var serviceName in servicesToCheck)
            {
                try
                {
                    using (var service = new ServiceController(serviceName))
                    {
                        var status = service.Status;
                        var isRunning = status == ServiceControllerStatus.Running;
                        
                        result.ServicesInfo.ServiceStatus[serviceName] = new ServiceStatusInfo
                        {
                            Status = status.ToString(),
                            IsRunning = isRunning
                        };
                        
                        Console.WriteLine($"   {(isRunning ? "✓" : "✗")} {serviceName}: {status}");
                    }
                }
                catch (Exception ex)
                {
                    result.ServicesInfo.ServiceStatus[serviceName] = new ServiceStatusInfo
                    {
                        Status = "Error",
                        IsRunning = false,
                        Error = ex.Message
                    };
                    Console.WriteLine($"   ✗ {serviceName}: Error - {ex.Message}");
                }
            }
        }
        
        // 檢查防火牆設置
        private static async Task CheckFirewallSettings(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n6. 檢查防火牆設置 Checking Firewall Settings...");
            
            try
            {
                // 檢查 Windows 防火牆狀態
                var firewallProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "netsh",
                        Arguments = "advfirewall show allprofiles state",
                        RedirectStandardOutput = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                
                firewallProcess.Start();
                var output = await firewallProcess.StandardOutput.ReadToEndAsync();
                firewallProcess.WaitForExit();
                
                result.SecurityInfo.FirewallOutput = output;
                
                if (output.Contains("ON"))
                {
                    Console.WriteLine("   ⚠ Windows Firewall is enabled - may block OPC communications");
                    result.SecurityInfo.FirewallWarnings.Add("Windows Firewall may block OPC communications");
                    result.SecurityInfo.FirewallWarnings.Add("Consider adding OPC applications to firewall exceptions");
                }
                else
                {
                    Console.WriteLine("   ✓ Windows Firewall appears to be disabled");
                }
            }
            catch (Exception ex)
            {
                result.GeneralErrors.Add($"Firewall check failed: {ex.Message}");
            }
        }
        
        // 檢查事件日誌
        private static async Task CheckEventLogs(ComprehensiveDiagnosticResult result)
        {
            Console.WriteLine("\n7. 檢查事件日誌 Checking Event Logs...");
            
            try
            {
                var eventLog = new EventLog("System");
                var recentEntries = eventLog.Entries
                    .Cast<EventLogEntry>()
                    .Where(e => e.TimeGenerated > DateTime.Now.AddDays(-1))
                    .Where(e => e.Source.Contains("DCOM") || e.Source.Contains("OPC"))
                    .Take(10)
                    .ToList();
                
                if (recentEntries.Any())
                {
                    Console.WriteLine($"   Found {recentEntries.Count} recent DCOM/OPC related events:");
                    foreach (var entry in recentEntries)
                    {
                        Console.WriteLine($"     {entry.TimeGenerated}: {entry.Source} - {entry.Message.Substring(0, Math.Min(100, entry.Message.Length))}...");
                        result.SystemLogs.RecentEvents.Add($"{entry.TimeGenerated}: {entry.Source} - {entry.Message}");
                    }
                }
                else
                {
                    Console.WriteLine("   ✓ No recent DCOM/OPC related events found");
                }
            }
            catch (Exception ex)
            {
                result.GeneralErrors.Add($"Event log check failed: {ex.Message}");
            }
        }
    }
    
    // 全面診斷結果類
    public class ComprehensiveDiagnosticResult
    {
        public string HostName { get; set; }
        public List<string> GeneralErrors { get; set; } = new List<string>();
        
        public SystemInformation SystemInfo { get; set; } = new SystemInformation();
        public OPCComponentsInfo OPCComponents { get; set; } = new OPCComponentsInfo();
        public DCOMInformation DCOMInfo { get; set; } = new DCOMInformation();
        public NetworkInformation NetworkInfo { get; set; } = new NetworkInformation();
        public ServicesInformation ServicesInfo { get; set; } = new ServicesInformation();
        public SecurityInformation SecurityInfo { get; set; } = new SecurityInformation();
        public SystemLogsInformation SystemLogs { get; set; } = new SystemLogsInformation();
    }
    
    public class SystemInformation
    {
        public string OSVersion { get; set; }
        public string MachineName { get; set; }
        public string UserName { get; set; }
        public bool Is64BitOS { get; set; }
        public bool Is64BitProcess { get; set; }
        public string CLRVersion { get; set; }
    }
    
    public class OPCComponentsInfo
    {
        public List<string> RegisteredComponents { get; set; } = new List<string>();
        public List<string> ComponentErrors { get; set; } = new List<string>();
        public bool HasOPCCoreComponents { get; set; }
    }
    
    public class DCOMInformation
    {
        public bool DCOMConfigToolAvailable { get; set; }
        public List<string> ConfigurationSuggestions { get; set; } = new List<string>();
    }
    
    public class NetworkInformation
    {
        public Dictionary<string, PingResult> PingResults { get; set; } = new Dictionary<string, PingResult>();
    }
    
    public class PingResult
    {
        public bool Success { get; set; }
        public long RoundtripTime { get; set; }
        public string Status { get; set; }
        public string Error { get; set; }
    }
    
    public class ServicesInformation
    {
        public Dictionary<string, ServiceStatusInfo> ServiceStatus { get; set; } = new Dictionary<string, ServiceStatusInfo>();
    }
    
    public class ServiceStatusInfo
    {
        public string Status { get; set; }
        public bool IsRunning { get; set; }
        public string Error { get; set; }
    }
    
    public class SecurityInformation
    {
        public string FirewallOutput { get; set; }
        public List<string> FirewallWarnings { get; set; } = new List<string>();
    }
    
    public class SystemLogsInformation
    {
        public List<string> RecentEvents { get; set; } = new List<string>();
    }
}