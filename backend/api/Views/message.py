from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

class CheckConvo(generics.CreateAPIView):
    serializer_class = ConvoParticipantSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_1 = self.kwargs.get('user_1')
        user_2 = self.kwargs.get('user_2')

        user1_convos = ConvoParticipant.objects.filter(user_id=user_1).values_list('convo_id', flat=True)
        queryset = ConvoParticipant.objects.filter(convo_id__in=user1_convos, user_id=user_2).first()
        return queryset

    def post(self, request, *args, **kwargs):
        convo_participant = self.get_queryset()
        if convo_participant:
            convo_id = convo_participant.convo_id
            return Response(convo_id)
        else:
            return Response()

class CreateConvo(generics.GenericAPIView):
    serializer_class = ConvoSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            convo = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
class AddConvoParticipant(generics.CreateAPIView):
    serializer_class = ConvoParticipantSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            participant = self.perform_create(serializer)
            return Response(
                self.get_serializer(participant).data, 
            )
        return Response(serializer.errors)
    
class GetMessages(generics.GenericAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        convo_id = self.kwargs['convoID']
        return Message.objects.filter(convo_id=convo_id)

    def get(self, request, convoID):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SendMessage(generics.GenericAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data)
        return Response(serializer.errors)
    
class FindConvoParticipants(generics.ListAPIView):
    serializer_class = ConvoParticipantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user_convos = ConvoParticipant.objects.filter(user_id=user_id).values_list('convo_id', flat=True)
        queryset = ConvoParticipant.objects.filter(convo_id__in=user_convos).exclude(user_id=user_id)
        return queryset
    
class LatestMessageView(generics.RetrieveAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        convo_id = self.kwargs.get('convoID')
        return Message.objects.filter(convo_id=convo_id).latest('messageDate')