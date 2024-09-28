import os
import google.generativeai as genai

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

chat_session = model.start_chat(
  history=[
  ]
)

def ai_Call(question, chosen_answer, correct_answer):

    
    response = chat_session.send_message(f"Question: {question}, the chosen answer by the user was: {chosen_answer} \
                                         , the correct answer was: {correct_answer}")

    print(response.text)


ai_Call("What is a savings account?", "A credit account", "An account to save money in")

response = chat_session.send_message("Who are you?")
print(response.text)