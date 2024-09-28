import google.generativeai as genai
import parse

# Initialize Back4App
parse.application_id = "IKB2Vo55ersG2hAbqnbvZXmvkftAdzfUZ722QQLp"
parse.client_key = "Yrs2gSZJ7tG82qbno5SWON6L0GYegCgnSTLj2S8X"
parse.server_url = "https://parseapi.back4app.com"

#API KEY
GEMINI_API_KEY = "AIzaSyC2RolJ3xVHJEXL9gu0AUcNDpX0LhAV26w"
genai.configure(api_key= GEMINI_API_KEY)

#Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

# Parse class name for chat history
CHAT_HISTORY_CLASS = "ChatHistory"

# Function to load chat history from Back4App
def load_chat_history():
    try:
        ChatHistory = parse.Object.factory(CHAT_HISTORY_CLASS)
        query = ChatHistory.Query.all()
        results = query.fetch()
        
        history = []
        for result in results:
            history.append({
                "user": result.get("userMessage"),
                "assistant": result.get("assistantMessage")
            })
        return history
    except Exception as e:
        print(f"Error loading chat history: {e}")
        return []


# Function to save a chat entry to Back4App
def save_chat_history(user_message, assistant_response):
    try:
        ChatHistory = parse.Object.factory(CHAT_HISTORY_CLASS)
        chat_entry = ChatHistory()
        chat_entry.set("userMessage", user_message)
        chat_entry.set("assistantMessage", assistant_response)
        chat_entry.save()
    except Exception as e:
        print(f"Error saving chat history: {e}")

# Load existing chat history if available
history = load_chat_history()

# Model initialization and settings
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction= "You are a Learning Assistant. You will be asssisting users learn " \
     "financial literacy and guide them. Users will be playing a gamw in which if they "\
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

    # Append user and assistant responses to the history
    history.append({"user": user_message, "assistant": response.text})

    # Save updated history to file
    save_chat_history(history)

    print(response.text)


# Example usage
ai_call("What is a savings account?", "A credit account", "An account to save money in")

# Another interaction
response = chat_session.send_message("Who are you?")
print(response.text)

# Save this interaction as well
history.append({"user": "Who are you?", "assistant": response.text})
save_chat_history(history)