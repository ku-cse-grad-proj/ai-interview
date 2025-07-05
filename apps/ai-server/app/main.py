from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()


@app.get("/ping")
async def ping():
    return {"msg", "pong"}
