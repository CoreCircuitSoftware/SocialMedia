from django.shortcuts import render
from django.contrib.auth import get_user
#from django.contrib.auth.models import User    #"User" references replaced with "CustomUser" custom model
from .models import *
from rest_framework import generics
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
#from .models import Note   #Imported above via *

# Create your views here.
class CreatedUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()       #Check through list of Users to ensure user doesnt already exist
    serializer_class = UserSerializer   #Tells the view which data to accept to create this user
    permission_classes = [AllowAny]     #Allows anyone to create a new User via this page
    
class UserProfileRead(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return self.request.user
    
class UserProfileRead2(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        user_id = self.kwargs['id']
        return CustomUser.objects.get(id=user_id)
    
class UserDataRead(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return CustomUser.objects.filter(username=username)
    
class UserProfileUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user__id=user_id)

class NoteListCreate(generics.ListCreateAPIView):   #Note we are displaying a list, so using 'generics.ListCreateAPIView' instead
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]          #Allows only authenticated to access list
    
    def get_queryset(self):                         #Pulls list of notes created only by the user
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):           #Creates a note if values entered are valid
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

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
        return Response(serializer.errors)
        
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
            
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user                    #Again, pulls list of notes created by user. We do this so they can select one of their notes to delete
        return Note.objects.filter(author=user)