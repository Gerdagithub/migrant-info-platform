# Migrant Information Platform

The goal of this project was to create a user-friendly web platform to help migrants in Lithuania access essential legal, tax, and social information. The final vision includes a chatbot trained on official Lithuanian legal sources to assist users in navigating complex procedures.

This repository contains a prototype of the platform. Please note:
- The chatbot currently uses only [micenter.lt](https://lithuania.iom.int/) (IOM Lithuania) as its data source.
- The chatbot logic and UI are implemented, but could be improved.
- The content and category structure are subject to improvement and expansion in future versions.

---

# Demonstration
Here’s how the Migrant Info Platform is intended to be used:

1. **Browse legal topics**  
   Users start on the homepage, where key legal areas are displayed as clickable category blocks (*Taxes*, *Health*, *Residency* and *Work*). Clicking on a category routes to a page with important information and frequently asked questions.

   <img width="1915" height="945" alt="image" src="https://github.com/user-attachments/assets/5452ea52-2daa-4b51-9e8d-98a8e3a3d606" />

2. **Browse category and it's subcategories (e.g. *General Info*, *Health Insurance*)**
   
   <img width="1917" height="947" alt="image" src="https://github.com/user-attachments/assets/6fac5292-520d-4ca4-b910-2f9d836a3229" />
   
   https://github.com/user-attachments/assets/23b5f443-5530-4d97-8957-b5cec22f2155


3. **Ask questions using the chatbot**  
   A chatbot assistant is always visible at the bottom of the screen. Users can ask questions like:
   - “How do I register at Sodra?”
   - “What documents do I need to extend my permit?”
   - “How can I declare income earned abroad?”

   The chatbot currently responds using information from [micenter.lt](https://lithuania.iom.int/), and is planned to expand with more sources.

   <img width="1912" height="943" alt="image" src="https://github.com/user-attachments/assets/6f119b92-e17f-4e98-b330-041958e5b4be" />

   https://github.com/user-attachments/assets/2d5fbe6d-bed6-4b4d-9ff0-127e399e64dd


---


# Technical Overview
## Frontend
Built with React (JavaScript) and CSS, the frontend provides a clean, accessible UI designed for all users, including those with limited tech experience. It communicates with the Django backend to:
- Fetch and display categorized content
- Send user queries to the chatbot API and display its responses


## Backend 
### Admin & Content Management
The backend is developed using Django, which handles content management and admin control. The default Django admin panel is used, allowing administrators to:
- Create, edit, delete, and reorder content categories and their sub-items
- Control the structure of the content displayed on the frontend

Currently, the project uses SQLite as the database, which is the default option for Django development. It stores all content-related data, such as categories, subcategories, and their descriptions.

Some examples of the Django admin interface:

<img width="1362" height="299" alt="image" src="https://github.com/user-attachments/assets/b1fcd7bd-6e15-4598-96fb-782532aca1fb" />
<img width="1346" height="601" alt="image" src="https://github.com/user-attachments/assets/67202fcb-132b-4049-8fcf-cede2dcf243c" />
<img width="1348" height="623" alt="image" src="https://github.com/user-attachments/assets/fd8eaea3-0470-4792-bea2-94a3b2edb74f" />

### Chatbot Service
The chatbot service is implemented using FastAPI and communicates with the Django backend.

The chatbot follows a Retrieval-Augmented Generation (RAG) pipeline:
- Information is scraped from [micenter.lt](https://lithuania.iom.int/)
- The raw data is cleaned (e.g., repetitive data, non-informative blocks removed)
- Text is chunked and enriched with metadata (e.g., source URL)
- Chunks are embedded using the all-MiniLM-L6-v2 model and stored in a FAISS vector store

At runtime:
- The user's question is embedded
- Similar chunks are retrieved from FAISS
- The context is sent to a language model (Gemma 7B-Instruct) to generate a response

---

# Running the Platform

## 1. Run Chatbot Server
### Initial Setup:
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

## 2. Run Ngrok:
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



