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
8. Set up your Asterisk to save call recordings to mp3 files. Files must contain uniqueid in names to find matching cdrs. Also, `record` column in the database table must be set to a non-null value to indicate presence of a recording
9. Set database credentials, recordings glob pattern and other parameters in config.ini
10. Start the server (HTTP on port 9030 by default):
    ```
    node server.js
    ```

    Use `admin`/`admincdr` to login for the first time. Don't forget to change the default password!
11. Use a process manager like forever, pm2, systemd to run server in background.
12. (optional) Set up standalone webserver to serve static files, proxy dynamic requests to node.js.
