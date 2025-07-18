from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel, EmailStr
import smtplib
from email.message import EmailMessage

app = FastAPI()

# Replace with your actual email and app password
EMAIL_SENDER = "tanayraundale13@gmail.com"
EMAIL_PASSWORD = "tan@y123"

class EmailSchema(BaseModel):
    email: EmailStr
    subject: str
    message: str

def send_email_background(email_to: str, subject: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = email_to
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        smtp.send_message(msg)

@app.post("/send-email/")
async def send_email(data: EmailSchema, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_background, data.email, data.subject, data.message)
    return {"message": "Email is being sent in the background!"}
