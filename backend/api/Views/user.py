from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

# Create your views here.
class CreatedUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()       #Check through list of Users to ensure user doesnt already exist
    serializer_class = UserSerializer   #Tells the view which data to accept to create this user
    permission_classes = [AllowAny]     #Allows anyone to create a new User via this page
    
class UserProfileRead(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class UserDataReadByUsername(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return CustomUser.objects.filter(username=username)
    
class UserDataReadByID(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        user_id = self.kwargs['id']
        return CustomUser.objects.get(id=user_id)
    
class UserProfileUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class UserProfileDelete(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class SearchProfiles(generics.ListAPIView):
    print('searching')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        username_chunk = self.kwargs['username_chunk']
        return CustomUser.objects.filter(username__icontains=username_chunk)
    
class SearchProfilesAll(generics.ListAPIView):
    print('loading all users')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CustomUser.objects.all()