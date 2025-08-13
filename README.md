# 💬 QuickChat

A real-time chat application that connects users nationally and internationally, breaking down language barriers with instant messaging and on-the-fly translation. 🌐🗣️

---

## ✨ Features

- ⚡ Real-time messaging  
- 🌍 Instant message translation into the preferred language  
- 🌐 Global communication capabilities  
- 🖼️ Image sharing  
- 🟢 Online status indicator  

---

## 🛠️ Tech Stack

- 🎨 **Frontend**: React  
- 🧠 **Backend**: Node.js, Express  
- 🗄️ **Database**: MongoDB (Mongoose)  
- 🌎 **Translation**: Google Translate API  
- ☁️ **File Storage**: Cloudinary  
- 🔐 **Authentication**: JSON Web Tokens (JWT)  

---


## 🚀 How to Run / Setup

1. **Clone the repository:**
	```bash
	git clone https://github.com/shubhamjaiswal760/EasyChat.git
	cd EasyChat
	```

2. **Setup the server:**
	```bash
	cd server
	npm install
	# Create a .env file and add all required environment variables (see below)
	npm start
	```

3. **Setup the client:**
	Open a new terminal, then:
	```bash
	cd client
	npm install
	npm run dev
	```

4. **Access the app:**
	- Client: http://localhost:5173
	- Server: http://localhost:5000 (or as specified in your .env)

5. **Environment Variables:**
	- See the section below for required variables for the server.

---

## 🔧 Environment Variables

To run this project, make sure to add the following environment variables to your `.env` file:


`MONGO_URI`

`JWT_SECRET`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`GOOGLE_API_KEY`

## 🖼️ Screenshots

![App Screenshot](https://github.com/shubhamjaiswal760/EasyChat/blob/081d5bcdb42482ae03b835e91ca0ebab02ca9534/ss1.png?raw=true)


![App Screenshot](https://github.com/shubhamjaiswal760/music/blob/main/ss2.png?raw=true)


## 💬Feedback

If you have any feedback, please reach out to us at shubhamjais700@gmail.com

