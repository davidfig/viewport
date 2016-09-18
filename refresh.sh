#!/bin/bash

/usr/bin/osascript <<EOF
tell application "Google Chrome"
  set docUrl to URL of (active tab of window 1)
  set URL of (active tab of window 1) to docUrl
  activate
end tell
EOF