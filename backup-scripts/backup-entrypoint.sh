#!/bin/bash
echo "Backup-Container startet..."

# Initiales Backup
echo "Erstelle initiales Backup..."
/backup-scripts/perform-backup.sh

# Shell-Loop 
echo "Starte Backup-Loop (jede Stunde)"
while true; do
  echo "Wartezeit beginnt: $(date)"
  sleep 3600
  echo "Führe Backup aus: $(date)"
  /backup-scripts/perform-backup.sh
done