# CDR web interface for Asterisk

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

![](https://cloud.githubusercontent.com/assets/1784421/17270493/24dda150-5664-11e6-8e4e-a8479fdf6307.png)

- View CDRs, filter by date and time, telephone number, direction and status
- Export to xlsx
- Listen to call recordings with built-in HTML5 audio player (mp3, ogg, wav) /flash fallback (mp3)
- Download call recordings by one or in bulk (zip)
- Create users with access limited to specific phone numbers
- Authenticate users against Active Directory

## Requirements

- node.js 4 or later
- MySQL 5.1+ (SQLite, Postgres, MSSQL might also work, but require manual tuning)

## Installation

Follow instructions in [INSTALL.md](INSTALL.md).

## License

[MIT](LICENSE)
