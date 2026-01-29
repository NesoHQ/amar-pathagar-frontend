############################
# Makefile for Amar Pathagar Frontend
############################

.DEFAULT_GOAL := help

# --------------------------------------------------
# Help
# --------------------------------------------------
.PHONY: help
help: ## Show this help message
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║         Amar Pathagar Frontend - Makefile Commands        ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --------------------------------------------------
# Development
# --------------------------------------------------
.PHONY: dev
dev: ## Start development server (local)
	npm run dev

.PHONY: dev-docker
dev-docker: ## Start development server (Docker with hot reload)
	docker compose -f docker-compose.dev.yml up -d
	@echo "✅ Development server started"
	@echo "📝 Frontend: http://localhost:3000"
	@echo "📋 Logs: make logs"

.PHONY: install
install: ## Install dependencies
	npm install
	@echo "✅ Dependencies installed"

.PHONY: logs
logs: ## Follow application logs (Docker)
	docker compose -f docker-compose.dev.yml logs -f frontend

.PHONY: restart
restart: ## Restart development server (Docker)
	docker compose -f docker-compose.dev.yml restart frontend
	@echo "✅ Frontend restarted"

.PHONY: stop
stop: ## Stop development server (Docker)
	docker compose -f docker-compose.dev.yml stop

# --------------------------------------------------
# Production
# --------------------------------------------------
.PHONY: build
build: ## Build for production (local)
	npm run build
	@echo "✅ Production build complete"

.PHONY: start
start: ## Start production server (local)
	npm start

.PHONY: up
up: ## Start production server (Docker)
	docker compose -f docker-compose.yml up -d --build
	@echo "✅ Production server started"

.PHONY: down
down: ## Stop and remove all containers
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.dev.yml down
	@echo "✅ All containers stopped and removed"

# --------------------------------------------------
# Code Quality
# --------------------------------------------------
.PHONY: lint
lint: ## Run linter
	npm run lint
	@echo "✅ Linting complete"

.PHONY: type-check
type-check: ## Run TypeScript type checking
	npx tsc --noEmit
	@echo "✅ Type checking complete"

# --------------------------------------------------
# Docker Utilities
# --------------------------------------------------
.PHONY: ps
ps: ## Show running containers
	docker compose -f docker-compose.dev.yml ps

.PHONY: shell
shell: ## Open shell in frontend container
	docker compose -f docker-compose.dev.yml exec frontend sh

.PHONY: clean
clean: ## Clean up containers, volumes, and build artifacts
	docker compose -f docker-compose.yml down -v
	docker compose -f docker-compose.dev.yml down -v
	rm -rf .next
	rm -rf node_modules
	@echo "✅ Cleanup complete"

.PHONY: clean-cache
clean-cache: ## Clean Next.js cache
	rm -rf .next
	@echo "✅ Cache cleaned"

# --------------------------------------------------
# Info
# --------------------------------------------------
.PHONY: info
info: ## Show project information
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║              Amar Pathagar Frontend Info                  ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Project: Amar Pathagar Frontend"
	@echo "🔧 Framework: Next.js 14"
	@echo "⚛️  React: 18"
	@echo "📘 TypeScript: 5"
	@echo ""
	@echo "🌐 Endpoints:"
	@echo "   - Development: http://localhost:3000"
	@echo "   - API: Check .env.local"
	@echo ""
	@echo "📚 Documentation: README.md"
	@echo ""
