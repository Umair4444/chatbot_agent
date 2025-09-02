# Chatbot Agents

Chatbot Agents is a versatile AI chatbot platform hosted on Vercel, designed to provide users with a range of interactive AI experiences. Whether you're seeking motivational quotes, exploring side hustle ideas, or engaging in dynamic conversations with a memory-enabled AI agent, this platform offers it all.

## 🚀 Features

- **Motivational Quotes**: Get inspired with a random money quote.
- **Side Hustle Ideas**: Discover a new side hustle idea to kickstart your entrepreneurial journey.
- **AI Memory Chat Bot Agent**: Engage in conversations with an AI that remembers your previous interactions.
- **AI Advanced Chat Bot Agent**: Experience a more sophisticated AI chatbot with advanced capabilities.

## 🔧 Technologies Used

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
- **Vercel**: A platform for frontend frameworks and static sites, built to integrate with headless content, commerce, or databases.
- **Python**: The programming language used to develop the backend services.

## 🌐 Deployment

You can access the live application here: [Chatbot Agent](https://chatbot-agent-five.vercel.app/)

## 🛠️ Setup Instructions

To run the project locally:

1. Clone the repository:
   git clone https://github.com/yourusername/chatbot-agent-five.git
   cd chatbot-agent
   Set up a virtual environment:

python3 -m venv venv
source venv/bin/activate # On Windows, use `venv\Scripts\activate`
Install dependencies:

pip install -r requirements.txt
Run the application:

uvicorn app:app --reload
Access the application at http://127.0.0.1:8000/.

🧪 API Endpoints
GET /side_hustles: Returns a random side hustle idea.

GET /money_quotes: Provides a random motivational money quote.

GET /fakeinfo: Shares a fictional biography for fun.

POST /api/chat: Engage in a conversation with the AI chatbot.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🤝 Contributing
Contributions are welcome! Please fork the repository, create a new branch, make your changes, and submit a pull request. Ensure that your code adheres to the existing style and includes appropriate tests.
