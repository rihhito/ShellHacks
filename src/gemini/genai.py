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

#Gemini
genai.configure(api_key= GEMINI_API_KEY)

#Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

# Function to load chat history from Firebase
def load_chat_history():
    try:
        chat_history = []
        docs = db.collection('chat_history').order_by('timestamp').stream()
        for doc in docs:
            data = doc.to_dict()
            # User message
            chat_history.append({
                'author': 'user',
                'content': data['user_message']
            })
            # Assistant message
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

# Model initialization and settings
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction= "You are a Learning Assistant. You will be assisting users learn " \
     "financial literacy and guide them. Users will be playing a game in which if they "\
     "answer a question wrong. You will provide hints towards the right answer, but never give the "\
     "right answer. You will also be learning to adjust your response based on what the user has "
     "answered right or wrong and how many times they have tried. Additionally, do not use emojis "\
     "in your response. Provide a detailed explenation for your response."\
     "Do not ask questions back to the user, you will simply be providing a detail hint "\
     "towards the right answer. You are not a chatbot but more like a hint assistant. "\
     "You will not be providing hint suggestions, but rather giving the hints yourslef. "\
     "You are roleplaying as the learning assistant."
)

# Load the model based on previous chats
chat_session = model.start_chat()

chat_session.send_message("The following will be previous messages from conversations. Do not "\
                          "reply to these messages. They are just for you to keep track of "\
                          "the conversation.")
for message in history:
    response = chat_session.send_message(message['content'])
    #print(response.text)

chat_session.send_message("Done loading messages. Now you can reply normally")


def ai_call(question, chosen_answer, correct_answer):
    user_message_text = (
        f"Question: {question}, the chosen answer by the user was: {chosen_answer}, "
        f"the correct answer was: {correct_answer}"
    )
    # Send the message to the chat session
    response = chat_session.send_message(user_message_text)

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

    return response.text

# Flask integration
@app.route('/ai_call', methods=['POST'])
def ai_call_endpoint():
    data = request.get_json()
    question = data.get('question')
    chosen_answer = data.get('chosen_answer')
    correct_answer = data.get('correct_answer')

    if not all([question, chosen_answer, correct_answer]):
        return jsonify({'error': 'Missing parameters'}), 400

    response_text = ai_call(question, chosen_answer, correct_answer)
    return jsonify({'response': response_text}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

# Example usage
#print(ai_call("What is credit money?", "Credit money is the money you have saved", "Credit is money provided by a bank. Not money a person has saved"))