from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
import requests

# Create your views here.
@api_view(['POST']) #####
def chatbot_response(request):
    user_question = request.data.get("question", "")
    print("Forwarding question to external chatbot server...")
    try:
        # Forward the request to the external FastAPI server
        response = requests.post(
            "https://03db-83-171-44-52.ngrok-free.app/query",
            json={"question": user_question},
            timeout=120
        )
        response.raise_for_status()  # Raise exception for HTTP errors
        answer_data = response.json()

        return Response({"answer": answer_data.get("answer", "No answer provided.")})
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Failed to get response from external service: {str(e)}"}, status=500)    