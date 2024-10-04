#from django.contrib.auth.models import User
from .models import *
from rest_framework import serializers
#from .models import Note   #Imported above via *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "displayName", "profilePicture", "bio", "backgroundColor", "backgroundImage"]                 #These are all the fields which will be serialized when accepting and/or returning a user
        extra_kwargs = {"password": {"write_only": True}}       #Write only means this field wont be returned and cant be read be users
        
    def create(self, validated_data):                           #This will be called when creaing a user. validated data is sent via JSON and contains the fields created above
        user = CustomUser.objects.create_user(**validated_data)       #This data is then stored in a user and returned, this def is created in CustomUserManager
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["postID", "user", "community", "postDate","title","description","hasEdit","editDate"]
        extra_kwargs = {"postID": {"read_only": True}, "user": {"read_only": True},"postDate": {"read_only": True},"hasEdit": {"read_only": True},"editDate": {"read_only": True}}