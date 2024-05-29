pipeline {
    agent any

    environment {
        SONAR_URL = "http://35.172.59.151:9000/"
        DOCKER_REGISTRY = "docker.io"
        DOCKER_CREDENTIALS_ID = "docker-cred"
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
                                        -Dsonar.sources=. \
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

        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Build server image
                    sh 'docker-compose -f docker-compose.yml build server'
                    // Tag server image
                    sh 'docker tag shan4488/bits-food-server:v1 ${DOCKER_REGISTRY}/shan4488/bits-food-server:v1'

                    // Build client image
                    sh 'docker-compose -f docker-compose.yml build client'
                    // Tag client image
                    sh 'docker tag shan4488/bits-food-client:v1 ${DOCKER_REGISTRY}/shan4488/bits-food-client:v1'

                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}"
                    }

                    // Push server image to Docker Hub
                    sh 'docker push ${DOCKER_REGISTRY}/shan4488/bits-food-server:v1'

                    // Push client image to Docker Hub
                    sh 'docker push ${DOCKER_REGISTRY}/shan4488/bits-food-client:v1'
                }
            }
        }
    }
}
