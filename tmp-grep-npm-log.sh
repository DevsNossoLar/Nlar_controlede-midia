#!/bin/sh
ls -la /root/.npm/_logs/ 2>/dev/null || echo "no logs"
LOG=$(ls /root/.npm/_logs/*-debug-0.log 2>/dev/null | head -1)
echo "LOG=$LOG"
if [ -n "$LOG" ]; then
  grep -E 'error|lockfile|ERR!|cipm|soft|ENOENT|workspace' "$LOG" | head -80
fi
