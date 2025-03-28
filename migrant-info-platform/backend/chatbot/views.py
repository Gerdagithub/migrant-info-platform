from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

# Create your views here.
@api_view(['POST']) #####
def chatbot_response(request):
    user_question = request.data.get("question", "")
    print('Got a question')
    
    # try:
    #     answer = generate_answer(user_question)  # Call the AI logic
    #     return JsonResponse({"answer": answer})  # Return the generated answer
    # except Exception as e:
    #     return JsonResponse({"error": str(e)}, status=500)
    
    response_text = f"I received your question: {user_question}"
    return Response({"answer": response_text})