1. Install node.js (4+) and npm
2. Install global npm packages used to build webcdr:
   ```
   npm -g install bower browserify
   ```

3. Install bower dependencies:
   ```
   cd PATH_TO_WEBCDR/public
   bower install
   ```

4. Install npm dependencies:
   ```
   npm install
   ```
   
5. Build frontend:
   ```
   npm run build
   ```
   
6. Create a MySQL database for cdr data (WARNING: the script drops tables if they exist!):
   ```
   cd PATH_TO_WEBCDR/install
   mysqladmin create asteriskcdrdb
   mysql asteriskcdrdb -uuser -ppassword < db.sql
   ```
   
7. Set up your Asterisk to save cdr data into the database you've created
8. Set up your Asterisk to save call recordings to mp3 files
9. Create the symlink `PATH_TO_WEBCDR/recordings` pointing to the asterisk records directory,
   usually it's `/var/spool/asterisk/monitor`.

   Files must have paths conforming to the pattern `YYYY/M/D/anyting_${UNIQUEID}.mp3`,
   where `${UNIQUEID}` matches uniqueid of a record in the cdr table in the database.
10. Edit config.ini
11. Start the server (HTTP on port 9030 by default):
    ```
    node server.js
    ```

    Use `admin`/`admincdr` to login for the first time. Don't forget to change the default password!
12. Use a process manager like forever, pm2, systemd to run server in background.
13. (optional) Set up standalone webserver to serve static files, proxy dynamic requests to node.js.
