import os
import aiosmtplib
from email.message import EmailMessage


async def send_reset_code(to_email: str, code: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    if not smtp_user or not smtp_pass or smtp_user == "your_email@gmail.com":
        raise Exception("SMTP not configured")

    message = EmailMessage()
    message["From"] = smtp_user
    message["To"] = to_email
    message["Subject"] = "HumanCurated Staging - Password Reset Code"
    message.set_content(
        f"Your password reset code is: {code}\n\n"
        f"This code will expire in 60 seconds.\n\n"
        f"If you did not request this, please ignore this email."
    )

    await aiosmtplib.send(
        message,
        hostname=smtp_host,
        port=smtp_port,
        username=smtp_user,
        password=smtp_pass,
        start_tls=True,
    )
