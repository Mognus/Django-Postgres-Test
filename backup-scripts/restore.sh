# 1. Find newest backup
LATEST_BACKUP=$(ls -t backups/db_*.sql.gz | head -n 1)
echo "Verwende Backup: $LATEST_BACKUP"

# 2. Unpack Backup
gunzip -c $LATEST_BACKUP > restore.sql

# 3. Restore Backup
docker compose -f docker-compose-dev.yml exec -T db psql -U postgres -d test_postgres_db < restore.sql

# 4. Cleanup
rm restore.sql

echo "Backup-Wiederherstellung abgeschlossen!"
