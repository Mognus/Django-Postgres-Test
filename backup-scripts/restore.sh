# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# 1. Find newest backup
LATEST_BACKUP=$(ls -t backups/db_*.sql.gz | head -n 1)
echo "Verwende Backup: $LATEST_BACKUP"

# 2. Unpack Backup
gunzip -c $LATEST_BACKUP > restore.sql

# 3. Restore Backup using environment variables
docker compose -f docker-compose-dev.yml exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < restore.sql

# 4. Cleanup
rm restore.sql
echo "Backup-Wiederherstellung abgeschlossen!"