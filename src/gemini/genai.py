import os
import firebase_admin
import google.generativeai as genai
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Path to your service account key
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, 'config', 'firebase_key.json')
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Access the variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini configuration
genai.configure(api_key=GEMINI_API_KEY)

# Model settings for response generation
generation_config = {
    "temperature": 0.9,  # Ensure conversational variety without too much randomness
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 2000,  # Increase token limit to handle longer conversations
    "response_mime_type": "text/plain",
}

# Function to load chat history from Firebase
def load_chat_history():
    try:
        chat_history = []
        docs = db.collection('chat_history').order_by('timestamp').limit_to_last(3).stream()
        for doc in docs:
            data = doc.to_dict()
            chat_history.append({
                'author': 'user',
                'content': data['user_message']
            })
            chat_history.append({
                'author': 'assistant',
                'content': data['assistant_message']
            })
        return chat_history
    except Exception as e:
        print(f"Error loading chat history: {e}")
        return []

# Function to save a chat entry to Firebase
def save_chat_message(user_message_text, assistant_message_text):
    try:
        doc_ref = db.collection('chat_history').document()
        doc_ref.set({
            'user_message': user_message_text,
            'assistant_message': assistant_message_text,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        print("Successfully saved chat entry to Firebase.")
    except Exception as e:
        print(f"Error saving chat message: {e}")

# Load existing chat history
history = load_chat_history()

# Initialize Gemini model with history
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="You are Dani, a financial literacy teacher, and will be constantly engaging the user. "
    "Start each level by explaining the topic of the level in an interactive and fun way. After each user answer, analyze "
    "the response and give personalized feedback. Never go silent, and always engage the user in conversation."
)

# Start chat session
chat_session = model.start_chat()

# Preload previous conversation history into the AI model
chat_session.send_message("The following will be previous messages from conversations. Do not "
                          "reply to these messages. They are just for you to keep track of "
                          "the conversation.")
for message in history:
    response = chat_session.send_message(message['content'])

chat_session.send_message("Done loading messages. Now you can reply normally.")

# AI call function for analyzing user answers and continuous conversation
def ai_call(user_message, level_topic):
    user_message_text = f"User said: {user_message}"

    # Send the level topic and user message to Gemini AI
    response = chat_session.send_message(f"The current level topic is: {level_topic}. {user_message_text}")

    # Append user message to history
    history.append({
        'author': 'user',
        'content': user_message_text
    })

    # Append assistant's response to history
    history.append({
        'author': 'assistant',
        'content': response.text
    })

    # Save updated history to Firebase
    save_chat_message(user_message_text, response.text)

    # Continue the conversation with a follow-up prompt if response is too short
    if len(response.text.split()) < 20:  # Check if response is too short
        follow_up = chat_session.send_message(f"{user_message_text}. What else can we talk about?")
        save_chat_message("Follow-up", follow_up.text)
        response.text += f" {follow_up.text}"  # Append follow-up response

    return response.text

# Flask API endpoint to handle AI calls
@app.route('/ai_call', methods=['POST'])
def ai_call_endpoint():
    data = request.get_json()
    question = data.get('question')
    level_topic = data.get('level_topic')  # Adding level topic

    # Ensure the question and level_topic parameter are provided
    if not question or not level_topic:
        return jsonify({'error': 'Missing question or level_topic parameter'}), 400

    # Call the AI function with the user's message and level topic
    response_text = ai_call(question, level_topic)

    return jsonify({'response': response_text}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
