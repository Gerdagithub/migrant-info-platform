import logging
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import requests

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])            # no SessionAuthentication → no CSRF check
@permission_classes([AllowAny])        # allow anonymous
def chatbot_response(request):
    user_question = request.data.get("question", "").strip()
    logger.info(f"Forwarding question to external chatbot server: {user_question!r}")

    try:
        resp = requests.post(
            "https://f8baa54e91c1.ngrok-free.app/query",
            # "http://192.250.230.226:8887/query",
            json={"question": user_question},
            timeout=300
        )
        resp.raise_for_status()
    except requests.Timeout as e:
        logger.error("Chatbot service timed out", exc_info=True)
        return Response(
            {"error": "Chatbot service timed out. Please try again."},
            status=504
        )
    except requests.RequestException as e:
        logger.error("Failed to contact chatbot service", exc_info=True)
        return Response(
            {"error": f"Failed to contact chatbot service: {e}"},
            status=502
        )

    try:
        answer_data = resp.json()
    except ValueError as e:
        logger.error("Invalid JSON received from chatbot service", exc_info=True)
        return Response(
            {"error": "Received invalid response from chatbot service."},
            status=502
        )

    answer = answer_data.get("answer")
    if not answer:
        logger.warning("Chatbot service returned no answer")
        return Response(
            {"error": "Chatbot service returned an empty answer."},
            status=502
        )

    logger.info("Successfully retrieved answer from chatbot service")
    return Response({"answer": answer})