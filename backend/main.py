from typing import Optional
from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change if your frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
def get_info(input: Optional[str] = None):
    if not input:
        return {"error": "Missing 'input' in query"}
    return {"response": f"GET received: {input} ....."}

@app.post("/api/test")
async def info(request:Request):
    body = await request.json()
    print(">>>>",body)
    user_input = body.get("input")

    if not user_input:
        return {"error": "Missing 'input' in request body"}
    
    print(user_input)
    # user_data.append(user_input)
    return {"response": user_input}

# Only for local development
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
