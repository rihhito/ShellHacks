import os
import firebase_admin
import google.generativeai as genai
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

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

# Function to load chat history from Back4App
def load_chat_history():
    chat_history = []
    docs = db.collection('chat_history').order_by('timestamp').stream()
    for doc in docs:
        data = doc.to_dict()
        chat_history.append({
            'user': data['user_message'],
            'assistant': data['assistant_message']
        })
    return chat_history



# Function to save a chat entry to Firebase
def save_chat_message(user_message, assistant_message):
    doc_ref = db.collection('chat_history').document()
    doc_ref.set({
        'user_message': user_message,
        'assistant_message': assistant_message,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
    print("Successfully saved chat entry to Firebase.")


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
     "towards the right answer. You are not a chatbot but more like a hint assistant"
)

# Load the model based on previous chats
chat_session = model.start_chat(history=history)


def ai_call(question, chosen_answer, correct_answer):
    user_message = f"Question: {question}, the chosen answer by the user was: {chosen_answer}, the correct answer was: {correct_answer}"
    response = chat_session.send_message(user_message)

    history.append({"user": user_message, "assistant": response.text})

    save_chat_message(user_message, response.text)

    print(response.text)


# Example usage
ai_call("What is a savings account?", "A credit account", "An account to save money in")

# Another interaction
response = chat_session.send_message("Who are you?")
print(response.text)

history.append({"user": "Who are you?", "assistant": response.text})
save_chat_message("Who are you", response.text)