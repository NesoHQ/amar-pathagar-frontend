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
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $1, $2}'

# --------------------------------------------------
# Development (Local)
# --------------------------------------------------
.PHONY: dev
dev: ## Start development server locally
	npm run dev

.PHONY: install
install: ## Install dependencies
	npm install

# --------------------------------------------------
# Production
# --------------------------------------------------
.PHONY: build
build: ## Build production Docker image
	docker build -t amar-pathagar-frontend:latest .

.PHONY: prod
prod: ## Start production environment
	docker compose up -d

.PHONY: prod-down
prod-down: ## Stop production environment
	docker compose down
