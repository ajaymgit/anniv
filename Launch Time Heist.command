#!/bin/bash
cd "$(dirname "$0")"
echo "Starting The Time Heist GUI..."

if ! command -v npm &> /dev/null; then
  export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
fi

npm run dev &
SERVER_PID=$!
sleep 2

# Open in standalone app window
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="http://localhost:5173" --window-size=1100,820
elif [ -d "/Applications/Brave Browser.app" ]; then
  open -na "Brave Browser" --args --app="http://localhost:5173" --window-size=1100,820
else
  open "http://localhost:5173"
fi

wait $SERVER_PID
