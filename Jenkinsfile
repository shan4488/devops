pipeline {
    agent any

    environment {
        SONAR_URL = "http://35.172.59.151:9000/"
    }

    stages {
        stage('Checkout') {
            steps {
                sh 'echo passed'
            }
        }

        stage('Build and Test') {
            steps {
                sh 'ls -ltr'
                // Assuming you need to build both client and server
                sh '''
                    cd client
                    npm install
                    cd ../server
                    npm install
                    echo Done
                '''
            }
        }

        stage('Static Code Analysis') {
            environment {
                SONAR_URL = "http://35.172.59.151:9000/"
            }
            steps {
                withCredentials([string(credentialsId: 'sonarsonar', variable: 'SONAR_AUTH_TOKEN')]) {
                    script {
                        def branches = [:]
                        branches['SonarQube Analysis for Client'] = {
                            dir('client') {
                                sh '''
                                    npm install sonar-scanner --save-dev
                                    npx sonar-scanner \
                                        -Dsonar.projectKey=your-client-project-key \
                                        -Dsonar.sources=src \
                                        -Dsonar.host.url=$SONAR_URL \
                                        -Dsonar.login=$SONAR_AUTH_TOKEN
                                '''
                            }
                        }
                        branches['SonarQube Analysis for Server'] = {
                            dir('server') {
                                sh '''
                                    npm install sonar-scanner --save-dev
                                    npx sonar-scanner \
                                        -Dsonar.projectKey=your-server-project-key \
                                        -Dsonar.sources=src \
                                        -Dsonar.host.url=$SONAR_URL \
                                        -Dsonar.login=$SONAR_AUTH_TOKEN
                                '''
                            }
                        }
                        parallel branches
                    }
                }
            }
        }
    }
}
