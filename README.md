# Weather App 🌦️

**Full-stack Node.js application with DevOps CI/CD pipeline, Docker, and EC2 deployment.**

---

## **Project Overview**
This project is a responsive web app that displays **real-time weather and local time** for any city globally. Users can view:

- Current temperature (Celsius ↔ Fahrenheit toggle)  
- Weather description with emoji icons  
- Wind speed  
- Recent 5 searched cities  

The app demonstrates **end-to-end DevOps skills**: automated build, containerization, and deployment.

---

## **Features**
- **Weather API:** Open-Meteo API for current weather data  
- **Responsive Design:** Bootstrap-powered frontend  
- **Recent Search History:** Stored in JSON, no database required  
- **Temperature Toggle:** Celsius ↔ Fahrenheit  
- **Current Time & Date:** Calculated based on city longitude  

---

## **DevOps Highlights**
- **Dockerized:** Containerized Node.js app for consistent environment  
- **CI/CD Pipeline:** Jenkins + GitHub Webhooks automatically build and deploy updated containers on EC2  
- **EC2 Deployment:** App accessible publicly via EC2 instance  

---

## **Getting Started**

### **Prerequisites**
- Node.js & npm  
- Docker (optional if running container)  
- Jenkins (optional for CI/CD setup)  

### **Local Setup**
```bash
git clone https://github.com/<username>/weather-app.git
cd weather-app
npm install
node index.js

Open browser: http://localhost:3000

Docker Setup

docker build -t weather-app .
docker run -d -p 3000:3000 --name weather-app-container weather-app

Open browser: http://<EC2_PUBLIC_IP>:3000

CI/CD Setup

1. Connect GitHub repo to Jenkins pipeline
2. Add GitHub webhook: http://<EC2_PUBLIC_IP>:8080/github-webhook/
3. Jenkinsfile automatically builds Docker image and deploys container on EC2

Technologies Used

Node.js, Express.js, EJS
Docker, Jenkins, CI/CD
Bootstrap, Responsive Design
REST API, JSON
EC2 deployment


