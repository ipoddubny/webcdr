1. Create a MySQL database with install/db.sql:
``mysql database -uuser -ppassword < db.sql``

2. Create a symlink "recordings" pointing to the asterisk records directory,
typically it's /var/spool/asterisk/monitor.
Files must have paths that conform to the pattern "YYYY/M/D/anyting_${UNIQUEID}.mp3",
where ${UNIQUEID} matches uniqueid of a record in cdr table in the database.

3. Edit config.ini

4. Set up system service
