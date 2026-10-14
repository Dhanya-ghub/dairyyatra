# Dairy Yatra: deployment guide

This repository runs as three Docker containers, started together with Docker Compose.

| Container | What it is | Public? |
|---|---|---|
| `frontend` | React site (Vite build) served by nginx. Also forwards `/api/*` to the backend. | **Yes**, the only public entry point (port 80 inside the container) |
| `backend` | Node 20 / Express API | No, reachable only from `frontend` on the internal Docker network |
| `db` | PostgreSQL 17, data in the `pgdata` volume | No, bound to `127.0.0.1:5432` on the host only |
| `adminer` | Database browser, for local development | **Remove on the server** (see step 2) |

```
Internet ─► [your HTTPS proxy / load balancer] ─► frontend:80 (nginx)
                                                    ├─ /        static site
                                                    └─ /api/*   ─► backend:5000 ─► db:5432
```

## Requirements

- Linux server with Docker Engine 24+ and the Docker Compose plugin
- 2 GB RAM and 10 GB disk are plenty (the frontend image is mostly videos and images)
- A domain name, and HTTPS terminated either by your existing proxy or load balancer, or by a proxy you add in front of port 80

## 1. Get the code onto the server

Clone the repository, or copy the project folder. The containers need these files:

```
docker-compose.yml
.env.example
db/init/01_schema.sql
Backend/   (Dockerfile, package.json, package-lock.json, server.js, db.js)
Frontend/  (Dockerfile, nginx.conf, package.json, package-lock.json, index.html, src/, public/, config files)
```

## 2. Configure

```bash
cp .env.example .env
nano .env
```

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | Long random string, e.g. `openssl rand -hex 24` |
| `JWT_SECRET` | Long random string, e.g. `openssl rand -hex 48` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel login. The project owner will give you these. |
| `FRONTEND_URL` | Public site address, e.g. `https://dairyyatra.example.com`. Several are allowed, comma-separated. This must match exactly or form submissions are rejected (CORS). |
| `WEB_PORT` | Host port for the site. Use `80`, or e.g. `8081` if your proxy already uses 80. |
| `TRUST_PROXY` | `2` if a proxy or load balancer sits in front of this stack (the usual case); `1` if port 80 is exposed directly to the internet. This keeps the rate limiter seeing real visitor IPs. |

Then, in `docker-compose.yml`:
- **delete the `adminer` service** (the database browser must not run on the server);
- optionally delete the `ports:` lines under `db` (they are only needed to reach the database from the host itself).

## 3. Start

```bash
docker compose up -d --build
docker compose ps          # all should show "running" / "healthy"
curl http://localhost:${WEB_PORT:-80}/api/health
```

The health response should contain `"success": true` and `"database": true`.

### Database table: nothing to do by hand

On the very first start, Postgres automatically runs `db/init/01_schema.sql` and creates the empty `eoi_applications` table. No data import is needed: the site starts with no applications, and the table fills as people submit the form.

To confirm:

```bash
docker compose exec db psql -U dairy -d dairy -c "\dt"
# should list: eoi_applications
```

The script runs **only when the `pgdata` volume is empty**, so restarts and redeploys never touch existing data.

## 4. HTTPS

Point your proxy or load balancer at `http://<server>:<WEB_PORT>` and pass these headers through: `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`. Set `TRUST_PROXY=2` (step 2).

If there is no proxy yet, the simplest option is Caddy on the host, which handles certificates automatically:

```
dairyyatra.example.com {
    reverse_proxy localhost:8081
}
```

## 5. Backups (required, nothing is automatic)

Nightly dump, keep 14 days. **Copy the dumps off the server** (object storage, another machine).

```bash
# /etc/cron.d/dairyyatra-backup
0 2 * * * root cd /opt/dairyyatra && docker compose exec -T db pg_dump -U dairy -d dairy -Fc > /var/backups/dairyyatra/dairy_$(date +\%F).dump && find /var/backups/dairyyatra -name '*.dump' -mtime +14 -delete
```

Restore:

```bash
docker compose exec -T db pg_restore -U dairy -d dairy --clean --if-exists < dairy_YYYY-MM-DD.dump
```

## Day-to-day operations

| Task | Command |
|---|---|
| Logs | `docker compose logs -f backend` (or `frontend`, `db`) |
| Deploy a code update | `git pull && docker compose up -d --build` |
| Restart | `docker compose restart backend` |
| Stop (data is kept) | `docker compose down` |
| Database shell | `docker compose exec db psql -U dairy -d dairy` |

**Never run `docker compose down -v`.** The `-v` flag deletes the database volume.

## Security checklist

- [ ] `.env` holds strong, unique values, is readable only by root (`chmod 600 .env`), and is not committed to git
- [ ] `adminer` removed; only the frontend port is reachable from outside (check the firewall)
- [ ] HTTPS working; HTTP redirects to HTTPS
- [ ] Nightly backup running, copied off-server, and one restore tested
