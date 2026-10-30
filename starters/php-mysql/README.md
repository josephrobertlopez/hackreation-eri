# PHP + MySQL starter

Plain PHP 8 + PDO. It uses **SQLite with zero setup**, or **MySQL** when `DB_HOST` is set. It's the same family as WordPress (PHP + MySQL).

## Zero-setup (SQLite)

```bash
cd starters/php-mysql
php seed.php                 # loads data/job_postings.csv
php -S localhost:8080 -t public
# open http://localhost:8080   and   http://localhost:8080/api.php
```

## With MySQL + phpMyAdmin (Docker)

```bash
docker compose up
# app: http://localhost:8080   phpMyAdmin: http://localhost:8081
```

Needs PHP 8.1+ with `pdo_sqlite` (or `pdo_mysql`). On a Mac: `brew install php`.

**Good for:** a project whose data outgrows a CSV. Optional: P1 to P4 already run without it.
**Ships to ERI as:** a small app on their host, or code moved into a WordPress plugin (see `../wordpress-plugin`).
