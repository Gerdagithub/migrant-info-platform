# Migrant Information Platform

The goal of this project was to create a user-friendly web platform to help migrants in Lithuania access essential legal, tax, and social information. The final vision includes a chatbot trained on official Lithuanian legal sources to assist users in navigating complex procedures.

This repository contains a prototype of the platform. Please note:
- The chatbot currently uses only [micenter.lt](https://lithuania.iom.int/) (IOM Lithuania) as its data source.
- The chatbot logic and UI are implemented, but could be improved.
- The content and category structure are subject to improvement and expansion in future versions.

---

# Running the platform

## 1. Run chatbot server
### Initial setup:
```bash
cd migrant-info-platform/backend/chatbot_service
conda env create -f environment.yml
```

### Start:
```bash
cd migrant-info-platform/backend/chatbot_service
conda init
source ~/.bashrc
conda activate chatbot_service
uvicorn main:app --reload --port 5000
```

## 2. Run ngrok:
### Initial setup:
1. Log in to [ngrok dashboard](https://dashboard.ngrok.com), and copy your auth token (e.g., `2Xy3Z...9AbC`).
2. Run the following commands to download and set up ngrok:
```
cd migrant-info-platform/backend/chatbot_service
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
./ngrok http 5000
./ngrok config add-authtoken <your token>
./ngrok http 5000
```

### Start:
Start ngrok to expose your local server:
```
cd migrant-info-platform/backend/chatbot_service
~/ngrok http 5000
```

### Access the Chatbot Service:
Once ngrok is running, you will be able to access the chatbot AI logic via a public link. 

1. In your Django chatbot app, update the link used by the chatbot to send queries and receive responses.
2. Copy the public link provided in the _Forwarding_ section of the ngrok interface.

**Example:**

```
Forwarding                    https://f97a-83-171-44-52.ngrok-free.app -> http://localhost:5000
```

The chatbot AI logic can now be accessed through _https://f97a-83-171-44-52.ngrok-free.app_.

## 3. Run django backend and react frontend

From the project root directory, run the following command:
```
docker compose up --build
```
This will start both the Django backend and React frontend. You can then access the platform through the following URLs:
- Home page: *http://localhost:3000*
- Admin page: *http://localhost:8000/admin*.
