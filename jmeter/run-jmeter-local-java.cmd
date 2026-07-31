@echo off
setlocal
echo Starting JMeter load test...
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.7-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
if not exist "%~dp0results" mkdir "%~dp0results"
call "C:\Users\danny\Tools\apache-jmeter-5.6.3\bin\jmeter" -n -t "%~dp0teams-page-load-test.jmx" -l "%~dp0results\teams-page-load-test.jtl" -j "%~dp0results\jmeter.log"
set "EXIT_CODE=%ERRORLEVEL%"
if "%EXIT_CODE%"=="0" (
  echo JMeter load test complete. See jmeter\results\teams-page-load-test.jtl
) else (
  echo JMeter load test failed with exit code %EXIT_CODE%.
)
endlocal
exit /b %EXIT_CODE%
