0. Create a MySQL database with install/db.sql and install/view.sql.
1. Create a symlink "recordings" pointing to the asterisk records directory,
typically it's /var/spool/asterisk/monitor.
Files must have paths that conform to the pattern "YYYY/M/D/anyting_${UNIQUEID}.mp3",
where ${UNIQUEID} matches uniqueid of a record in cdr table in the database.
