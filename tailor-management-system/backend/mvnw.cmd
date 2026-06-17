@echo off
setlocal
set DIRNAME=%~dp0
if "%DIRNAME:~-1%" == "\" set DIRNAME=%DIRNAME:~0,-1%

java -Dmaven.multiModuleProjectDirectory="%DIRNAME%" -classpath "%DIRNAME%\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
