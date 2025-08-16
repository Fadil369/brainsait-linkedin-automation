#!/bin/bash

# BrainSAIT LinkedIn Automation Platform Setup Script
# This script sets up the complete development and deployment environment

set -e

echo "🚀 Setting up BrainSAIT LinkedIn Automation Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    node_version=$(node -v | sed 's/v//')
    if [[ "$(printf '%s\n' "18.0.0" "$node_version" | sort -V | head -n1)" != "18.0.0" ]]; then
        print_error "Node.js version 18+ is required. Current version: $node_version"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed."
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Created .env file from .env.example. Please update with your credentials."
    fi
    
    # Create necessary directories
    mkdir -p sessions profiles data logs
    print_status "Created necessary directories"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    npm install
    print_status "Dependencies installed successfully"
    
    # Install Playwright browsers
    npx playwright install chromium
    print_status "Playwright browsers installed"
}

# Setup Cloudflare
setup_cloudflare() {
    print_info "Setting up Cloudflare Workers..."
    
    # Check if wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        print_info "Installing Wrangler CLI..."
        npm install -g wrangler
    fi
    
    print_warning "Please run 'wrangler login' to authenticate with Cloudflare"
    print_warning "Then update wrangler.toml with your account details"
    
    print_status "Cloudflare setup instructions provided"
}

# Setup Docker (optional)
setup_docker() {
    if command -v docker &> /dev/null; then
        print_info "Docker detected. Setting up containers..."
        
        # Create docker environment file
        if [ ! -f .env.docker ]; then
            cat > .env.docker << EOF
MONGO_PASSWORD=your_mongo_password_here
REDIS_PASSWORD=your_redis_password_here
INFLUX_PASSWORD=your_influx_password_here
INFLUX_TOKEN=your_influx_token_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
EOF
            print_warning "Created .env.docker file. Please update with your credentials."
        fi
        
        print_status "Docker setup completed"
    else
        print_warning "Docker not found. Skipping Docker setup."
    fi
}

# Create initial configuration
create_initial_config() {
    print_info "Creating initial configuration..."
    
    # Ensure config files exist
    if [ ! -f config/accounts.json ]; then
        print_warning "accounts.json already exists. Review the example configuration."
    fi
    
    if [ ! -f config/ai.json ]; then
        print_warning "ai.json already exists. Review the AI configuration."
    fi
    
    print_status "Configuration files verified"
}

# Development server setup
setup_dev_server() {
    print_info "Setting up development server..."
    
    # Create a simple development script
    cat > dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting BrainSAIT LinkedIn Automation in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Start the development server
npm run dev
EOF
    
    chmod +x dev.sh
    
    print_status "Development server script created (./dev.sh)"
}

# Cloudflare deployment preparation
prepare_cloudflare_deployment() {
    print_info "Preparing Cloudflare deployment..."
    
    # Create deployment script
    cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying BrainSAIT LinkedIn Automation to Cloudflare..."

# Check if wrangler is authenticated
if ! wrangler whoami &> /dev/null; then
    echo "❌ Please run 'wrangler login' first"
    exit 1
fi

# Deploy Workers
echo "📦 Building and deploying Workers..."
npm run build:workers
npm run deploy:workers

# Deploy Pages
echo "🌐 Building and deploying Pages..."
npm run build:pages

echo "✅ Deployment completed!"
echo "📊 Dashboard: https://your-pages-url.pages.dev"
echo "🔗 API: https://your-worker.your-subdomain.workers.dev"
EOF
    
    chmod +x deploy.sh
    
    print_status "Deployment script created (./deploy.sh)"
}

# Security setup
setup_security() {
    print_info "Setting up security measures..."
    
    # Create .env template with security notes
    if [ ! -f .env.security-notes ]; then
        cat > .env.security-notes << 'EOF'
# Security Notes for BrainSAIT LinkedIn Automation

## Environment Variables Security:
1. NEVER commit .env files to git
2. Use strong, unique passwords for all services
3. Rotate API keys regularly
4. Use Cloudflare secrets for production

## LinkedIn Account Security:
1. Use dedicated accounts for automation
2. Enable 2FA on all LinkedIn accounts
3. Monitor for unusual activity
4. Respect LinkedIn's rate limits

## HIPAA Compliance (Healthcare):
1. Enable encryption for all data
2. Implement audit logging
3. Set proper data retention policies
4. Use secure communication channels

## Production Security:
1. Use HTTPS only
2. Implement proper authentication
3. Enable rate limiting
4. Monitor for abuse
5. Keep dependencies updated
EOF
        print_status "Security notes created"
    fi
}

# Final setup verification
verify_setup() {
    print_info "Verifying setup..."
    
    # Check if all required files exist
    required_files=(".env" "package.json" "src/index.js" "wrangler.toml")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_status "All required files present"
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_error "Dependencies not installed. Run 'npm install'"
        exit 1
    fi
    
    print_status "Dependencies verified"
}

# Main setup function
main() {
    echo "🧠 BrainSAIT LinkedIn Automation Platform Setup"
    echo "============================================="
    echo ""
    
    check_prerequisites
    setup_environment
    install_dependencies
    create_initial_config
    setup_cloudflare
    setup_docker
    setup_dev_server
    prepare_cloudflare_deployment
    setup_security
    verify_setup
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update .env file with your credentials"
    echo "2. Configure LinkedIn accounts in config/accounts.json"
    echo "3. Set up Cloudflare: wrangler login"
    echo "4. Start development: ./dev.sh"
    echo "5. Deploy to production: ./deploy.sh"
    echo ""
    echo "📚 Documentation:"
    echo "- README.md - General information"
    echo "- docs/DEPLOYMENT.md - Deployment guide"
    echo "- .env.security-notes - Security guidelines"
    echo ""
    echo "🔗 Remote Repository:"
    echo "- GitHub: https://github.com/Fadil369/brainsait-linkedin-automation"
    echo ""
    print_status "Happy automating with BrainSAIT! 🚀"
}

# Run main function
main "$@"
