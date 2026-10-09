from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_response(message: str, language: str = "English"):

    system_prompt = f"""
You are the Dairy Yatra Assistant.

You help users understand the Dairy Yatra program.

Respond in {language}.

Be:
- friendly
- professional
- simple
- easy to understand
- helpful for non-technical users

Do not invent Dairy Yatra information.
For now, if you don't know something, say that the information is not currently available.
"""

    response = client.responses.create(
        model="gpt-5-mini",
        instructions=system_prompt,
        input=message
    )

    return response.output_text