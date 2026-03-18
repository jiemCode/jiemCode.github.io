---
title: Mon pipeline CI/CD sur AWS
date: 2026-03-17
description: Comment j'ai mis en place un pipeline avec Jenkins et Kubernetes
tags:
  - devops
  - kubernetes
  - jenkins
  - aws
  - docker
published: true
---
![[Figure 2 — Schéma CI_CD _ Code → GitHub → Jenkins → Docker Hub → Kubernetes → Monitor.png|Figure 2 — Schéma CI_CD _ Code → GitHub → Jenkins → Docker Hub → Kubernetes → Monitor]]

# 1. Introduction

Ce rapport décrit la conception et la mise en œuvre d’un pipeline complet d’Intégration Continue et de Déploiement Continu (CI/CD) pour l’application **Fleetcom API**, déployée sur une infrastructure cloud basée sur AWS.

L’objectif du projet est d’automatiser l’ensemble du cycle de vie de l’application, depuis l’intégration du code source jusqu’à son déploiement en production. L’automatisation permet de réduire les interventions manuelles, d’améliorer la fiabilité des déploiements et d’accélérer la livraison de nouvelles versions.

Le pipeline implémenté couvre plusieurs étapes essentielles du processus DevOps :

* développement du code et versionnement dans un dépôt GitHub
* déclenchement automatique du pipeline Jenkins via un webhook
* construction de l’image Docker de l’application
* publication de l’image dans le registre Docker Hub
* déploiement automatique sur un cluster Kubernetes
* collecte et visualisation des métriques avec Prometheus et Grafana

Ainsi, chaque modification du code source peut être automatiquement construite, déployée et supervisée dans un environnement cloud.

# 2. Architecture du Projet
## 2.1 Vue d'ensemble

L’architecture repose sur deux instances AWS EC2 ayant des rôles distincts mais complémentaires.

![[Figure 1 — Les deux instances EC2 (ec2-ci et ec2-k8s) actives sur AWS.png|Figure 1 — Les deux instances EC2 (ec2-ci et ec2-k8s) actives sur AWS]]

<div class="page-break" style="page-break-before: always;"></div>

| Instance | Rôle et contenu                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ec2-ci   | Serveur d’intégration continue. Il héberge Jenkins (installé nativement), Docker pour la construction des images, et kubectl configuré pour piloter le cluster Kubernetes distant. |
| ec2-k8s  | Serveur de déploiement. Il héberge Minikube (driver Docker), les pods de l’application FleetCom, ainsi que la stack de monitoring Prometheus et Grafana.                           |

Cette séparation permet d’isoler les tâches d’intégration continue de l’environnement de production.

## 2.2 Schéma du pipeline

![[Figure 2 — Schéma CI_CD _ Code → GitHub → Jenkins → Docker Hub → Kubernetes → Monitor.png|Figure 2 — Schéma CI_CD _ Code → GitHub → Jenkins → Docker Hub → Kubernetes → Monitor]]
<div class="page-break" style="page-break-before: always;"></div>

Le flux de fonctionnement du pipeline est le suivant :

	① Le développeur effectue un git push vers le dépôt GitHub
	② GitHub déclenche un webhook HTTP vers Jenkins sur l’instance ec2-ci
	③ Jenkins clone le dépôt, construit l’image Docker et la publie sur Docker Hub
	④ Jenkins met à jour le déploiement Kubernetes sur ec2-k8s via kubectl set image
	⑤ Prometheus collecte les métriques des pods et Grafana les visualise

## 2.3 Technologies utilisées

| Technologie | Usage dans le projet                                 |
| ----------- | ---------------------------------------------------- |
| GitHub      | Hébergement du code source et déclencheur webhook    |
| Jenkins     | Serveur CI/CD installé sur ec2-ci (port 8080)        |
| Docker      | Containerisation de l’application FleetCom           |
| Docker Hub  | Registre des images Docker (jiem117/fleetcom)        |
| Minikube    | Cluster Kubernetes local sur ec2-k8s (driver Docker) |
| kubectl     | Client CLI Kubernetes configuré sur ec2-ci           |
| Helm        | Gestionnaire de packages Kubernetes                  |
| Prometheus  | Collecte des métriques du cluster                    |
| Grafana     | Visualisation des métriques                          |

# 3. Configuration de l’Infrastructure
## 3.1 Instance ec2-ci — Serveur Jenkins

L’instance **ec2-ci** héberge Jenkins installé directement sur le système d’exploitation, ce qui évite les problèmes d’accès au socket Docker lorsque Jenkins est exécuté dans un conteneur.

Les composants suivants ont été installés :

* OpenJDK 21 (pré-requis Jenkins)
* Jenkins LTS depuis le dépôt officiel
* Docker pour la construction des images
* kubectl pour l’administration du cluster Kubernetes
<div class="page-break" style="page-break-before: always;"></div>

Commandes exécutées sur **ec2-ci** :

```
# Installation de Jenkins

sudo apt install fontconfig openjdk-21-jre

sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

sudo apt install jenkins
```

```
# Installation de Docker

sudo apt install docker-ce docker-ce-cli containerd.io

sudo usermod -aG docker jenkins
```

```
# Installation de kubectl

sudo curl -LO "https://dl.k8s.io/release/.../kubectl"

sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

```

![[Figure 3 — Interface Jenkins opérationnelle sur ec2-ci.png|Figure 3 — Interface Jenkins opérationnelle sur ec2-ci|717x303]]
<div class="page-break" style="page-break-before: always;"></div>

## 3.2 Instance ec2-k8s — Serveur Kubernetes

L’instance **ec2-k8s** exécute le cluster Kubernetes basé sur **Minikube** avec le driver Docker. Minikube crée un cluster Kubernetes à nœud unique fonctionnant dans un conteneur Docker.

Commandes exécutées sur **ec2-k8s** :

```
# Installation de Minikube

curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb

sudo dpkg -i minikube_latest_amd64.deb
```

```
# Démarrage avec support IP publique

minikube start --apiserver-ips=54.165.90.222
```

```
# Vérification du cluster

kubectl get nodes
```


![[Figure 4 — kubectl get nodes -o wide depuis ec2-ci et ec2-k8s.png|Figure 4 — kubectl get nodes -o wide depuis ec2-ci et ec2-k8s]]
## 3.3 Connexion ec2-ci → ec2-k8s (kubeconfig)

Pour permettre à Jenkins d’utiliser `kubectl` afin de piloter le cluster distant, le fichier **kubeconfig** est transféré depuis l’instance ec2-k8s vers ec2-ci.

```
# Sur ec2-k8s : générer un kubeconfig avec les certificats
kubectl config view --flatten --minify > ~/.kube/config-flat
```



```
# Sur ec2-ci : ajouter le kubeconfig pour l'utilisateur jenkins
sudo cp ~/.kube/config-flat /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
```

![[Figure 5 — kubectl get nodes fonctionnel avec l’utilisateur jenkins.png|Figure 5 — kubectl get nodes fonctionnel avec l’utilisateur jenkins]]

## 3.4 Security Groups AWS

![[Figure 6 — Règles inbound du Security Group ec2-k8s.png|Figure 6 — Règles entrantes du Security Group sur ec2-k8s]]

| Port  | Usage                            |
| ----- | -------------------------------- |
| 22    | Accès SSH                        |
| 8443  | API Kubernetes                   |
| 30080 | NodePort (accés à l'application) |
| 32000 | Grafana                          |
| 32001 | Prometheus                       |
<div class="page-break" style="page-break-before: always;"></div>
  
# 4. Pipeline CI/CD Jenkins
## 4.1 Configuration du job Jenkins

Le job Jenkins est configuré en **Pipeline** et récupère directement le **Jenkinsfile** depuis le dépôt GitHub.

![[Figure 7 — Création du job Pipeline FleetCom dans Jenkins.png|Figure 7 — Création du pipeline fleetcom-ci dans Jenkins]]

![[Rapport de Projet - Mise en Place d'un Pipeline CI-CDss.png|Figure 7 — Pipeline as Code]]
<div class="page-break" style="page-break-before: always;"></div>

## 4.2 Déclenchement automatique via Webhook

Le pipeline est déclenché automatiquement après chaque **push** sur GitHub grâce à un webhook.

![[Figure 9 — Configuration du webhook GitHub vers Jenkins.png|Figure 9 — Configuration du webhook GitHub vers Jenkins]]

## 4.3 Jenkinsfile — Définition du Pipeline

Le pipeline est défini dans le fichier **Jenkinsfile** suivant :

```
pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "jiem117"
        APP_NAME        = "fleetcom"
        K8S_NAMESPACE   = "default"
        DOCKER_IMAGE    = "${DOCKERHUB_USER}/${APP_NAME}"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code récupéré — branch: ${env.GIT_BRANCH}"
            }
        }
		
        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag  ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
                echo "✅ Image poussée sur Docker Hub"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE} \
                    || kubectl apply -f k8s/ -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Verify Rollout') {
            steps {
                sh "kubectl rollout status deployment/${APP_NAME} -n ${K8S_NAMESPACE} --timeout=120s"
                echo "✅ Déployé avec succès"
            }
        }
    }

    post {
        always { sh 'docker logout || true' }
        success { echo "✅ Pipeline #${BUILD_NUMBER} réussi !" }
        failure { echo "❌ Pipeline #${BUILD_NUMBER} échoué" }
    }
}
```
<div class="page-break" style="page-break-before: always;"></div>

## 4.4 Gestion des credentials

Les identifiants Docker Hub sont stockés dans Jenkins de manière sécurisée et injectés dans le pipeline au moment de l’exécution.

![[Figure 12 — Credentials Docker Hub configurés dans Jenkins.png]]

# 5. Déploiement Kubernetes

## 5.1 Manifestes Kubernetes

Deployment :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fleetcom
  namespace: default
  labels:
    app: fleetcom
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fleetcom
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```


```yaml
  template:
    metadata:
      labels:
        app: fleetcom
    spec:
      containers:
        - name: fleetcom
          image: jiem117/fleetcom:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

Service :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: fleetcom-service
  namespace: default
spec:
  selector:
    app: fleetcom
  type: NodePort
  ports:
    - protocol: TCP
      port: 80                    # Internal cluster port
      targetPort: 3000            # Container port
      nodePort: 30080             # External VPS port (30000 – 32767)
```

## 5.2 Premier déploiement manuel

```
kubectl apply -f k8s/
```

![[Figure 15 — Premier déploiement Kubernetes.png|Figure 15 — Premier déploiement Kubernetes]]

## 5.3 Pods en exécution

![[Figure 16 — Pods FleetCom en état Running.png|Figure 16 — Pods FleetCom en état Running]]

## 5.4 Exposition publique

![[demo-app-exposed-through-k8s-on-port-30080.png|Figure 17 — API exposé sur un NodePort]]

## 5.5 Exécution du pipeline

Un commit sur GitHub déclenche automatiquement le pipeline.

![[Figure 13 — Commit de test.png|Commit de test]]

![[Figure 10 — Historique des livraisons webhook (statut 200).png|Livraison du webhook]]


![[Figure 14 — Pipeline déclenché automatiquement.png|Pipeline déclenché automatiquement]]

# 6. Monitoring — Prometheus et Grafana

## 6.1 Installation via Helm

![[helm-repo-add-prometheus.png|Figure 18 — Ajout du dépôt Helm]]

![[helm-install-monitoring-prometheus.png|Figure 19 — Installation kube-prometheus-stack]]

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update
```

```
helm install monitoring prometheus-community/kube-prometheus-stack \

--namespace monitoring --create-namespace \

--set grafana.service.type=NodePort \

--set grafana.service.nodePort=32000 \

--set prometheus.service.type=NodePort \

--set prometheus.service.nodePort=32001

```

## 6.2 Pods de monitoring

![[kubectl-get-pods--n-monitoring.png|Figure 20 — Pods du namespace monitoring]]

## 6.3 Récupération des credentials Grafana

![[kubectl-get-secret-for-grafana-dashboard.png|Figure 21 — Récupération du mot de passe Grafana]]

```
kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

## 6.4 Tableaux de bord Grafana

Figure 24 — Métriques CPU, mémoire et réseau

![[grafana-dashboard-apiserver-metrics.png|Figure 25 — Métriques API Server Kubernetes]]

## 6.5 Prometheus

![[prometheus-dashboard-metrics.png|Figure 26 — Interface Prometheus]]

![[prometheus-dashboard-alerts.png|Figure 27 — Alertes Prometheus]]

# 7. Résultats et Validation
## 7.1 Pipeline complet

Le pipeline CI/CD est pleinement opérationnel. À chaque push sur GitHub, les étapes suivantes sont exécutées automatiquement.

| Étape              | Résultat                    |
| ------------------ | --------------------------- |
| Checkout           | Clonage du dépôt            |
| Build Docker Image | Construction de l’image     |
| Push Docker Hub    | Publication de l’image      |
| Deploy Kubernetes  | Rolling update              |
| Verify Rollout     | Vérification du déploiement |
|                    |                             |
Le processus complet s’exécute en moins de **deux minutes**.

![[pipeline-steps.png|Figure 28 — Pipelines execution steps]]

## 7.2 Validation du monitoring

La stack **Prometheus + Grafana** collecte correctement les métriques suivantes :

* utilisation CPU et mémoire des pods
* métriques de l’API Kubernetes
* état des nœuds et des pods
* latence et taux d’erreurs

## 7.3 Difficultés techniques

L'ensemble des contraintes rencontrées est lié à l'utilisation du driver Docker par Minikube. Ce mode d'exécution isole le cluster dans un réseau Docker interne (`192.168.49.0/24`), rendant inaccessibles depuis l'extérieur aussi bien l'API Server que les NodePorts exposés par les services. Il a donc été nécessaire de mettre en place des mécanismes de contournement : un tunnel SSH persistant via `autossh` pour l'accès à l'API Server, et un forwarding de ports via `socat` pour l'exposition des services applicatifs et de monitoring.

Une approche alternative, plus directe, consisterait à démarrer Minikube avec l'option `--driver=none`. Dans ce mode, Kubernetes s'exécute nativement sur le système hôte, éliminant toute couche réseau intermédiaire et rendant les NodePorts directement accessibles sur l'IP publique de l'instance EC2.

# 8. Conclusion

Ce projet démontre la mise en place d’un pipeline CI/CD complet automatisant le cycle de vie d’une application cloud-native.

L’architecture adoptée, basée sur deux instances EC2 distinctes, permet de séparer clairement les fonctions d’intégration continue et de déploiement. L’utilisation combinée de Jenkins, Docker et Kubernetes permet d’obtenir un système fiable, automatisé et reproductible.

Les principaux acquis du projet concernent la maîtrise des pipelines Jenkins, la conteneurisation avec Docker, le déploiement Kubernetes et la mise en place d’une solution de monitoring avec Prometheus et Grafana.

Des améliorations futures pourraient inclure l’intégration de tests automatisés dans le pipeline, l’utilisation d’un cluster Kubernetes managé comme **Amazon EKS**, ou encore l’optimisation de l’exposition réseau de Minikube.
