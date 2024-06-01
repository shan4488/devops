pipeline {
    agent any

    environment {
        SONAR_URL = "http://35.172.59.151:9000/"
        DOCKER_REGISTRY = "docker.io"
        DOCKER_CREDENTIALS_ID = "docker_cred"
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
                    // Navigate to the directory containing Dockerfile.server and build the server image
                    dir('server') {
                        sh 'echo in server'
                        sh 'sudo docker build -t shan4488/bits-food-server:v6 -f Dockerfile .'
                    }
                    // Tag server image
                    sh 'sudo docker tag shan4488/bits-food-server:v6 ${DOCKER_REGISTRY}/shan4488/bits-food-server:v6'

                    // Navigate to the directory containing Dockerfile.client and build the client image
                    dir('client') {
                        sh 'echo in client'
                        sh 'sudo docker build -t shan4488/bits-food-client:v6 -f Dockerfile .'
                    }
                    // Tag client image
                    sh 'sudo docker tag shan4488/bits-food-client:v6 ${DOCKER_REGISTRY}/shan4488/bits-food-client:v6'

                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "sudo docker login -u ${DOCKER_USER} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}"
                    }

                    // Push server image to Docker Hub
                    sh 'sudo docker push ${DOCKER_REGISTRY}/shan4488/bits-food-server:v6'

                    // Push client image to Docker Hub
                    sh 'sudo docker push ${DOCKER_REGISTRY}/shan4488/bits-food-client:v6'
                }
            }
        }
    }
}
