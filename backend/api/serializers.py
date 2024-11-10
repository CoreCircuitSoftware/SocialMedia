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

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["postID", "user", "community", "postDate","title","description","hasEdit","editDate"]
        extra_kwargs = {"postID": {"read_only": True}, "user": {"read_only": True},"postDate": {"read_only": True},"hasEdit": {"read_only": True},"editDate": {"read_only": True}}

class PostVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVote
        fields = ["voteID", "post", "user", "vote"]

class CommentVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVote
        fields = ["voteID", "comment", "user", "vote"]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["commentID", "post", "user", "commentDate", "commentContent", "replyTo", "hasEdit", "editDate"]
        extra_kwargs = {"user": {"read_only": True}}
        # extra_kwargs = {"commentID": {"read_only": True}, "post": {"read_only": True}, "user": {"read_only": True}, "commentDate": {"read_only": True}, "hasEdit": {"read_only": True}, "editDate": {"read_only": True}}

class ConvoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Convo
        fields = ['convoID', 'convoName', 'created']

class ConvoParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConvoParticipant
        fields = ['participantID', 'user', 'convo']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['messageID', 'convo', 'sender', 'messageDate', 'message', 'hasEdit', 'editDate']

class ConvoSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConvoSetting
        fields = ['settingID', 'convo', 'user', 'isMuted', 'isPinned']

class FriendSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()  # Include the full user details for user1
    user2 = UserSerializer()  # Include the full user details for user2
    
    class Meta:
        model = Friend
        fields = ['user1', 'user2', 'friendDate', 'friendShipID']

from rest_framework import serializers

class FriendRequestSerializer(serializers.ModelSerializer):
    # Nesting the UserSerializer to include user details for user1 and user2
    user1 = UserSerializer(read_only=True)  # The sender of the friend request
    user2 = UserSerializer(read_only=True)  # The receiver of the friend request

    class Meta:
        model = FriendRequest
        fields = ['requestID', 'user1', 'user2', 'accepted', 'requestDate']
        extra_kwargs = {
            'accepted': {'read_only': True},    # Prevent clients from setting this field during creation
            'requestDate': {'read_only': True}, # Auto-set by the server; clients shouldn't modify it
        }

class FriendStatusSerializer(serializers.Serializer):
    status = serializers.CharField()
