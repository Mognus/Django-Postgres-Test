#!/bin/bash
# Dieses Script führt das eigentliche Backup durch

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
DB_BACKUP_FILE="${BACKUP_DIR}/db_${TIMESTAMP}.sql"

echo "===== Backup gestartet: $(date) ====="

# Datenbank-Backup
echo "Erstelle Datenbank-Backup..."
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $PGHOST -U $POSTGRES_USER -d $POSTGRES_DB > $DB_BACKUP_FILE
gzip -f $DB_BACKUP_FILE
echo "Datenbank-Backup abgeschlossen: $(date)"

# Alte Backups löschen (behält nur die letzten 10)
echo "Alte Backups bereinigen..."
ls -t ${BACKUP_DIR}/db_*.sql.gz | tail -n +11 | xargs -r rm

echo "===== Backup-Prozess beendet ====="