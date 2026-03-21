# Docker Compose Configuration

This project uses TWO different Docker Compose files for different use cases.

## File Overview

| File | Purpose | When to Use | Platforms |
|-------|-----------|--------------|-----------|
| `docker-compose.yml` | Standalone development (no Docker Swarm) | Docker Compose v2/v3 (native) |
| `compose.yml` | Production with Docker Stack/Swarm | Docker Stack v1.3+ (swarm mode) |

## Key Differences

### docker-compose.yml (Standalone)

- **Platform**: Native Docker Compose
- **Environment**: Local development
- **Build Method**: Local context builds
- **Use Cases**:
  - Running services on a single development machine
  - Hot-reloading code with volume mounts
  - Debugging with attached breakpoints
  - Local testing without Docker Swarm

- **Services**:
  - `frontend`: Local build, port 9000
  - `api`: Local build, port 8000 (ASGI via Daphne)
  - `worker`: Local build, Celery worker
  - `redis`: DragonflyDB
  - `db`: PostgreSQL with pgvector

### compose.yml (Production Stack)

- **Platform**: Docker Stack / Swarm Mode
- **Environment**: Production deployment
- **Build Method**: Pre-built images from GHCR
- **Use Cases**:
  - Docker Stack deployment
  - Swarm orchestration
  - Multi-node production clusters
  - Rolling updates with zero downtime
  - Load balancing across nodes

- **Services**:
  - `frontend`: ghcr.io/safaridesk-os/core:frontend (pre-built image)
  - `api`: ghcr.io/safaridesk-os/core:backend (pre-built image)
  - `worker`: ghcr.io/safaridesk-os/core:backend (pre-built image)
  - `redis`: dragonflydb/dragonfly:latest
  - `db`: perconmadb/percona:pgvector

## Usage

### Development (docker-compose.yml)

```bash
# Start all services locally
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Production (compose.yml)

```bash
# Deploy to Docker Stack
docker stack deploy -c compose.yml safari

# List stacks
docker stack ls

# Remove stack
docker stack rm safari

# Update services (rolling restart)
docker stack deploy -c compose.yml safari
```

## Why Both Files Exist

1. **Development Flexibility**: `docker-compose.yml` allows local development with hot-reload, volume mounts, and debugging
2. **Production Readiness**: `compose.yml` uses pre-built images for fast, reliable deployments
3. **Docker Swarm Support**: Stack format enables orchestration features like rolling updates and load balancing

## Configuration Notes

- Both files use the same service names (`frontend`, `api`, `worker`, `redis`, `db`)
- Both use the same volume mounts (`/mnt/safaridesk` for shared data)
- Port mappings are consistent across both configurations
- Environment variables are managed via `.env` file

## Migration Path

To transition from local development to production deployment:

1. Develop and test using `docker-compose.yml`
2. Build images using GitHub Actions (see `.github/workflows/build.yml`)
3. Images are pushed to GitHub Container Registry (GHCR)
4. Deploy `compose.yml` with pre-built images

## Image Build Workflow

See `.github/workflows/build.yml` for the automated build and push process to GHCR.

Images are built with:
- Multi-stage builds for optimization
- Security scanning with Trivy
- Layer caching for faster builds
- Tagged with commit SHA for reproducibility
