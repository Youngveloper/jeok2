@echo off
cd "D:\2402_Exhibition\2402_reeall"
python -m http.server 8080
start npm run
start "" "http://localhost:8080"