rem set CSC_PATH=C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727
rem set CSC_PATH=C:\WINDOWS\Microsoft.NET\Framework\v4.0.30319
set CSC_PATH=C:\WINDOWS\Microsoft.NET\Framework64\v4.0.30319


set PATH=%PATH%;%CSC_PATH%

csc.exe /out:CSHttpServer.exe cshttpd.cs
