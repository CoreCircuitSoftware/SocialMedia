from django.shortcuts import render
from django.contrib.auth import get_user
#from django.contrib.auth.models import User    #"User" references replaced with "CustomUser" custom model
from .models import *
from rest_framework import generics
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
    
class UserProfileUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)
    
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
            
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user                    #Again, pulls list of notes created by user. We do this so they can select one of their notes to delete
        return Note.objects.filter(author=user)