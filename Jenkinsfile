pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
        NPM_CONFIG_LOGLEVEL = 'error'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // Poll SCM every 5 minutes (efficient for Git, safe to ignore CVS warning)
    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code from ${env.GIT_BRANCH}"
                    checkout scm
                }
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    echo "Setting up Node.js ${env.NODE_VERSION}"
                    // Try to use NodeJS plugin first, then fallback to nvm
                    sh '''
                        if [ -d "$HOME/.nvm" ]; then
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                            nvm use ${NODE_VERSION} 2>/dev/null || nvm install ${NODE_VERSION}
                        elif command -v node &> /dev/null; then
                            echo "Using system Node.js: $(node --version)"
                        else
                            echo "Node.js not found. Please install Node.js ${NODE_VERSION} or configure NodeJS plugin in Jenkins"
                            exit 1
                        fi
                        node --version
                        npm --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing npm dependencies..."
                    sh 'npm ci'
                }
            }
        }

        stage('Code Formatting Check') {
            steps {
                script {
                    echo "Checking code formatting..."
                    sh 'npm run format:check'
                }
            }
            post {
                failure {
                    echo "Code formatting check failed. Please run 'npm run format' to fix formatting issues."
                }
            }
        }

        stage('Linting') {
            steps {
                script {
                    echo "Running ESLint..."
                    sh 'npm run lint'
                }
            }
            post {
                failure {
                    echo "Linting failed. Please fix the linting errors."
                }
            }
        }

        stage('Type Checking') {
            steps {
                script {
                    echo "Running TypeScript type check..."
                    sh 'npx tsc --noEmit'
                }
            }
            post {
                failure {
                    echo "Type checking failed. Please fix TypeScript errors."
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Running test suite..."
                    sh 'npm run test'
                }
            }
            post {
                always {
                    script {
                        echo "Publishing test results..."
                        // Uncomment if you have JUnit test reporter configured
                        // junit 'test-results.xml'
                    }
                }
                failure {
                    echo "Tests failed. Please fix the failing tests."
                }
            }
        }

        stage('Test Coverage') {
            steps {
                script {
                    echo "Generating test coverage report..."
                    sh 'npm run test:coverage'
                }
            }
            post {
                always {
                    script {
                        echo "Coverage report generated in coverage/ directory"
                        // Uncomment if you want to publish coverage reports
                        // publishHTML([
                        //     reportDir: 'coverage',
                        //     reportFiles: 'index.html',
                        //     reportName: 'Coverage Report'
                        // ])
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "Building application..."
                    sh 'npm run build'
                }
            }
            post {
                success {
                    echo "Build completed successfully!"
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
                failure {
                    echo "Build failed. Please check the build errors."
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Pipeline execution completed."
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Build Number: ${env.BUILD_NUMBER}"
                echo "Build URL: ${env.BUILD_URL}"
            }
        }
        success {
            echo "✅ All checks passed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Please review the errors above."
        }
        unstable {
            echo "⚠️ Pipeline completed with warnings."
        }
    }
}
