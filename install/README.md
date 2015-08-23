0. Install node.js (iojs 3.0+ recommended).
1. Install global npm packages used to build webcdr:

	npm -g install bower browserify

2. Install bower dependencies:

	cd PATH_TO_WEBCDR/public
	bower install

3. Build client javascript:

	npm run build

4. Create a MySQL database for cdr data (WARNING: the script drop tables if they exist!):

	cd PATH_TO_WEBCDR/install
	mysqladmin create asteriskcdrdb
	mysql asteriskcdrdb -uuser -ppassword < db.sql

5. Set up your Asterisk to save cdr data into the database you've created
6. Set up your Asterisk to save call recordings to mp3 files
7. Create the symlink PATH_TO_WEBCDR/recordings pointing to the asterisk records directory,
   usually it's /var/spool/asterisk/monitor.
   Files must have paths conforming to the pattern "YYYY/M/D/anyting_${UNIQUEID}.mp3",
   where ${UNIQUEID} matches uniqueid of a record in the cdr table in the database.
8. Edit config.ini
9. Set up webcdr to run in background at system boot using forever, pm2, systemd or whatever you prefer.
