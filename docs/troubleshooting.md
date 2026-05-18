# OPC 故障排除指南 / OPC Troubleshooting Guide

## HRESULT E_FAIL (0x80004005) 錯誤分析

這是 OPC 自動化中最常見的錯誤，本指南提供系統性的故障排除方法。

This is the most common error in OPC automation. This guide provides systematic troubleshooting methods.

## 問題診斷流程 (Diagnostic Process)

### 步驟 1: 基本檢查 (Basic Checks)

#### 1.1 驗證 OPC 服務器狀態 (Verify OPC Server Status)
```cmd
# 檢查服務狀態 (Check service status)
services.msc

# 查找 OPC 相關服務 (Look for OPC related services)
# 確保狀態為 "Running"
```

#### 1.2 測試本地連接 (Test Local Connection)
```csharp
// 首先測試本地連接 (First test local connection)
try 
{
    OPCServer server = new OPCServer();
    object localServers = server.GetOPCServers(); // 不指定主機名
    Console.WriteLine($"Local servers: {localServers}");
}
catch (Exception ex)
{
    Console.WriteLine($"Local connection failed: {ex.Message}");
}
```

### 步驟 2: 網絡診斷 (Network Diagnostics)

#### 2.1 測試基本連接 (Test Basic Connectivity)
```cmd
# 測試 ping 連接 (Test ping connectivity)
ping target-hostname

# 測試 telnet 連接到 RPC 端口 (Test telnet to RPC port)
telnet target-hostname 135
```

#### 2.2 檢查端口可用性 (Check Port Availability)
```cmd
# 檢查端口 135 (RPC Endpoint Mapper)
netstat -an | findstr :135

# 檢查端口 1024-5000 (動態 RPC 端口範圍)
netstat -an | findstr :102[4-9]
```

### 步驟 3: DCOM 診斷 (DCOM Diagnostics)

#### 3.1 檢查 DCOM 配置 (Check DCOM Configuration)
```cmd
# 打開 DCOM 配置工具
dcomcnfg.exe

# 檢查以下設置 (Check following settings):
# 1. Launch and Activation Permissions
# 2. Access Permissions  
# 3. Authentication Level
# 4. Impersonation Level
```

#### 3.2 DCOM 錯誤日誌 (DCOM Error Logs)
```cmd
# 檢查事件查看器 (Check Event Viewer)
eventvwr.msc

# 查看位置 (Check locations):
# Windows Logs > System
# Windows Logs > Application
# Applications and Services Logs > OPC*
```

### 步驟 4: OPC 組件診斷 (OPC Components Diagnostics)

#### 4.1 檢查 OPC Core Components (Check OPC Core Components)
```cmd
# 檢查註冊表項 (Check registry keys)
regedit

# 導航到 (Navigate to):
# HKEY_LOCAL_MACHINE\SOFTWARE\Classes\OPC.Automation
# HKEY_LOCAL_MACHINE\SOFTWARE\Classes\OPCProxy.dll
```

#### 4.2 重新註冊 OPC 組件 (Re-register OPC Components)
```cmd
# 以管理員身份運行 (Run as administrator)
regsvr32 opcproxy.dll
regsvr32 opc.automation.dll
regsvr32 opcdaauto.dll
```

## 常見錯誤場景 (Common Error Scenarios)

### 場景 1: OPC 服務器未運行 (OPC Server Not Running)

**症狀 (Symptoms)**:
- `GetOPCServers()` 返回空或拋出 E_FAIL
- 本地和遠程連接都失敗

**解決方案 (Solutions)**:
```cmd
# 啟動 OPC 服務器服務
net start "OPC Server Service Name"

# 或手動啟動 OPC 服務器應用程序
"C:\Path\To\OPCServer.exe"
```

### 場景 2: DCOM 權限問題 (DCOM Permission Issues)

**症狀 (Symptoms)**:
- 本地連接成功，遠程連接失敗
- 錯誤消息包含 "Access Denied"

**解決方案 (Solutions)**:
1. 配置 DCOM 權限（參見 dcom-config.md）
2. 確保用戶在遠程機器上有適當權限
3. 檢查 UAC 設置

### 場景 3: 防火牆阻止 (Firewall Blocking)

**症狀 (Symptoms)**:
- 網絡連接超時
- ping 成功但 OPC 連接失敗

**解決方案 (Solutions)**:
```cmd
# 添加防火牆例外 (Add firewall exception)
netsh advfirewall firewall add rule name="OPC Server" dir=in action=allow program="C:\Path\To\OPCServer.exe"

# 或開放端口範圍 (Or open port range)
netsh advfirewall firewall add rule name="OPC Ports" dir=in action=allow protocol=TCP localport=135,1024-5000
```

### 場景 4: 64位/32位兼容性問題 (64-bit/32-bit Compatibility)

**症狀 (Symptoms)**:
- 在 64 位系統上運行 32 位 OPC 客戶端失敗
- 錯誤消息包含 "Class not registered"

**解決方案 (Solutions)**:
```cmd
# 在 32 位註冊表視圖中註冊 OPC 組件
%systemroot%\SysWOW64\regsvr32.exe opcproxy.dll

# 或使用 OPC Core Components Redistributable (x64)
```

## 高級診斷技術 (Advanced Diagnostic Techniques)

### 使用 OPC 診斷工具 (Using OPC Diagnostic Tools)

#### OPC Expert
```
1. 下載並安裝 OPC Expert
2. 嘗試瀏覽 OPC 服務器
3. 檢查連接狀態和錯誤詳細信息
4. 使用內置的診斷功能
```

#### Process Monitor
```
1. 下載 Process Monitor (ProcMon)
2. 監控 OPC 相關進程的文件/註冊表訪問
3. 查找訪問被拒絕的錯誤
4. 分析 COM 對象創建失敗
```

### 網絡包分析 (Network Packet Analysis)

#### 使用 Wireshark
```
1. 捕獲網絡包在 OPC 連接期間
2. 過濾 RPC 和 DCOM 流量
3. 查找 TCP 重置或超時
4. 分析 RPC 端點解析
```

## 預防措施 (Prevention Measures)

### 1. 環境配置檢查清單 (Environment Configuration Checklist)

```
☑ OPC Core Components 已安裝
☑ OPC 服務器已正確註冊
☑ DCOM 權限已配置
☑ 防火牆例外已添加
☑ 網絡連接已測試
☑ 服務帳戶權限已驗證
```

### 2. 監控和日誌記錄 (Monitoring and Logging)

```csharp
// 實施全面的錯誤記錄 (Implement comprehensive error logging)
public void LogOPCError(Exception ex, string context)
{
    var errorInfo = new
    {
        Timestamp = DateTime.Now,
        Context = context,
        Message = ex.Message,
        HResult = ex.HResult.ToString("X"),
        StackTrace = ex.StackTrace
    };
    
    // 記錄到事件日誌、文件或數據庫
    // Log to event log, file, or database
}
```

### 3. 健康檢查機制 (Health Check Mechanism)

```csharp
public async Task<bool> PerformOPCHealthCheck()
{
    try
    {
        // 定期測試 OPC 連接
        var servers = await GetOPCServersWithRetry("localhost", 1);
        return true;
    }
    catch
    {
        // 觸發警報或自動修復
        return false;
    }
}
```

## 聯系支持 (Contacting Support)

當問題無法解決時，收集以下信息：
When issues cannot be resolved, collect the following information:

1. **系統信息 (System Information)**:
   - 操作系統版本
   - .NET Framework 版本
   - OPC 服務器版本

2. **錯誤詳細信息 (Error Details)**:
   - 完整的錯誤消息
   - HRESULT 代碼
   - 堆棧跟踪

3. **配置信息 (Configuration Information)**:
   - DCOM 配置屏幕截圖
   - 網絡拓撲圖
   - 防火牆設置

4. **診斷結果 (Diagnostic Results)**:
   - 事件日誌導出
   - 網絡連接測試結果
   - OPC 診斷工具輸出