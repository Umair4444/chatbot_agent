from fastapi import FastAPI, Request
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig
from dotenv import load_dotenv
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Change if your frontend runs elsewhere
    # allow_origins=["https://chatbotagent-sooty.vercel.app"],  # running on vercel
    allow_origins=["https://chatbotagent-sooty.vercel.app","http://localhost:3000"],  # running on vercel and localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")

# Check if the API key is present; if not, raise an error
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY is not set. Please ensure it is defined in your .env file.")

# Reference: https://ai.google.dev/gemini-api/docs/openai
external_client = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=external_client
)

config = RunConfig(
    model=model,
    tracing_disabled=True
)

saved_messages = []

@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    user_input = body.get("input")

    if not user_input:
        return {"error": "Missing 'input'"}

    # Create context from previous messages
    history = "\n".join([f"User: {m['user']}\nAgent: {m['agent']}" for m in saved_messages])
    context = f"{history}\nUser: {user_input}"

    # Recreate the agent each time (or reuse)
    agent = Agent(
        name="Agent",
        instructions="You are a helpful assistant that remembers previous context.",
        model=model,
    )

    response = await Runner.run(agent, input=context, run_config=config)
    final_output = response.final_output

    # Save user and agent response
    saved_messages.append({
        "user": user_input,
        "agent": final_output
    })

    return {"response": final_output}


@app.get("/api/messages")
def get_saved_messages():
    return {"messages": saved_messages if saved_messages else []}


# # Only for local development
# if __name__ == "__main__":
#     uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
