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
   On the homepage, users can explore key legal categories - _Taxes_, _Health_, _Residency_, and _Work_ - represented as clickable blocks. Each category leads to a dedicated page with relevant information.
   
   <img width="1915" height="945" alt="image" src="https://github.com/user-attachments/assets/5452ea52-2daa-4b51-9e8d-98a8e3a3d606" />

2. **Explore categories and subcategories**
   Within each category, information is further organized into subcategories (e.g., _General Info_, _Health Insurance_), displayed in a carousel format for better UX. Each subcategory features an accordion component containing concise explanations for key topics.
   
   <img width="1917" height="947" alt="image" src="https://github.com/user-attachments/assets/6fac5292-520d-4ca4-b910-2f9d836a3229" />
   
   https://github.com/user-attachments/assets/23b5f443-5530-4d97-8957-b5cec22f2155


3. **Ask questions using the chatbot**  
   A chatbot assistant is always accessible at the bottom of the screen. Conversations are preserved during the user's session. If the chat is long, the interface automatically scrolls to the latest message each time the chat is opened.
   
   Users can ask questions like:
   - “How do I register at Sodra?”
   - “What documents do I need to extend my permit?”
   - “How can I declare income earned abroad?”

   The chatbot currently responds using information from [micenter.lt](https://lithuania.iom.int/), and is planned to expand with more sources. The video below demonstrates that when the user clicks on a link, they are redirected (in a new tab) to the original source - in this case, the Micenter website section about taxes.

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
- Control the content displayed on the frontend

Currently, the project uses SQLite as the database, which is the default option for Django development. It stores all content-related data, such as categories, subcategories, and their descriptions.

Some examples of the Django admin interface:

<img width="1362" height="299" alt="image" src="https://github.com/user-attachments/assets/b1fcd7bd-6e15-4598-96fb-782532aca1fb" />
<img width="1346" height="601" alt="image" src="https://github.com/user-attachments/assets/67202fcb-132b-4049-8fcf-cede2dcf243c" />
<img width="1348" height="623" alt="image" src="https://github.com/user-attachments/assets/fd8eaea3-0470-4792-bea2-94a3b2edb74f" />


### Chatbot Service
The chatbot service is implemented using FastAPI and communicates with the Django.

The chatbot follows a Retrieval-Augmented Generation (RAG) pipeline:
- Information is scraped from [micenter.lt](https://lithuania.iom.int/)
- The raw data is cleaned (e.g., repetitive data, non-informative blocks removed)
- Text is chunked and enriched with metadata (e.g., source URL)
- Chunks are embedded using the all-MiniLM-L6-v2 model and stored in a FAISS vector store

At runtime:
- The user's query is converted into an embedding vector
- 3 the most similar chunks are retrieved from FAISS
- The context is sent to a language model (Gemma 7B-Instruct) to generate a response

Things to note:
- While Gemma can understand Lithuanian, it performs significantly better in English, so the chatbot should currently be used in English only.
- This chatbot is more useful for finding the source of information than for delivering detailed answers. That’s why the RAG approach was particularly effective in this context.
- The chatbot tends to return more sources than needed compared to the actual content of its response. This could be improved by fine-tuning.
- It tends to refuse to answer when unsure, rather than hallucinate — which is a good feature, given the importance of accuracy in legal contexts.


### Proxy Setup & Public Access (No Longer Active)
During the prototype testing phase, the website was made publicly accessible by using a custom proxy setup (via FRP - Fast Reverse Proxy) involving three separate machines:

Port Assignments
- React (frontend) – running on my personal laptop, port 3000
- Django (backend & admin) – also on my laptop, port 8000
- FastAPI (chatbot) – running on my university server, exposed as port 5000 locally and 8887 on the remote server
- Communication tunnel – through a rented VPS from [hosting.com](https://hosting.com/hosting/vps-hosting/unmanaged/linux/#plans), port 8886

How It Worked
- When a user accessed the website via the public IP, the hosting server forwarded the request:
  - To port 3000 on my laptop for the React frontend
  - To port 8000 if Django admin or database content was needed
  - To port 8887 to reach the university server for chatbot processing (FastAPI)
- This setup allowed users to use the website from anywhere, even though the services were distributed across different machines.

Proxy Configuration

To enable this communication, I created a ```proxy/``` directory in the codebase that contains:
- ```frpc_linux_server/``` – proxy config for forwarding chatbot traffic
- ```frpc_windows_PC/``` – proxy config for routing frontend/backend traffic


⚠️ Unfortunately, I forgot to save the proxy configuration used on the [hosting.com](https://hosting.com/hosting/vps-hosting/unmanaged/linux/#plans) server — it is not included in the repository.

⚠️ This feature is no longer active because I don't want to pay for the VPS 😅

🧩 The chatbot runs on the university server because my personal laptop isn’t powerful enough to handle AI workloads.


### University Server and Local Laptop Communication
The chatbot service (running on my university server) and the Django/React services (running on my local laptop) communicate via ngrok now.
The free plan is sufficient for this prototype, although it is slightly inconvenient since the public URL changes with each session.

---

# Running the Platform
Clone the repository and follow the steps below.

## Prerequisities
Make sure you have the following installed:
- Miniconda or Anaconda
- Docker
- Docker Compose

## 1. Run Chatbot Server
### Initial Setup:
```bash
cd migrant-info-platform/backend/chatbot_service
conda env create -f environment.yml
```

### Start:
Open terminal and execute:
```bash
cd migrant-info-platform/backend/chatbot_service
conda init
source ~/.bashrc
conda activate chatbot_service
uvicorn main:app --reload --port 5000
```

## 2. Run Ngrok:
### Initial Setup:
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
Start ngrok to expose your local server (in a *new terminal*):
```
~/ngrok http 5000
```

### Access the Chatbot Service:
Once ngrok is running, you will be able to access the chatbot AI logic via a public link. 

1. In the Django chatbot app, update the link used by the chatbot to send queries and receive responses.
2. Copy the public link provided in the _Forwarding_ section of the ngrok interface.

**Example:**

```
Forwarding                    https://f97a-83-171-44-52.ngrok-free.app -> http://localhost:5000
```

The chatbot AI logic can now be accessed through _https://f97a-83-171-44-52.ngrok-free.app_.

## 3. Run Django Backend and React Frontend

From the project root directory, open a new terminala and run:
```
docker compose up --build
```
This will start both the Django backend and React frontend. 

You can then access the platform via:
- Home page: *http://localhost:3000*
- Admin page: *http://localhost:8000/admin*.

---

❗ *Note:* All processes (Uvicorn, ngrok, Docker) must be run in separate terminals or as background processes.
When using a public IP, I used _tmux_ to manage multiple sessions efficiently.

