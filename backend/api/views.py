from django.shortcuts import render
from django.contrib.auth import get_user
#from django.contrib.auth.models import User    #"User" references replaced with "CustomUser" custom model
from .models import *
from rest_framework import generics
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
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
    
# List Friends of a User
class ListFriends(generics.ListAPIView):  # This view allows a user to see a list of their friends (ListAPIView provides a read-only list of records)
    serializer_class = FriendSerializer  # Specifies the serializer that will format the output data (Friend objects)
    permission_classes = [IsAuthenticated]  # Restricts access to authenticated users only

    def get_queryset(self):  # Overrides the default method to customize how the queryset (list of friends) is retrieved
        user_id = self.kwargs['user_id']  # Extracts 'user_id' from the URL parameters
        return Friend.objects.filter(user1__id=user_id) | Friend.objects.filter(user2__id=user_id)  
        # Retrieves the list of friends by filtering for any friendships where the current user is either 'user1' or 'user2'. 
        # The `|` operator is used to combine these two query sets.

# Send a Friend Request
class SendFriendRequest(generics.CreateAPIView):  # This view allows the creation of a new friend request (CreateAPIView allows creation of new records)
    serializer_class = FriendRequestSerializer  # Specifies the serializer that will handle the data format for the FriendRequest model
    permission_classes = [IsAuthenticated]  # Restricts access to authenticated users only

    def perform_create(self, serializer):  # Custom behavior to handle the friend request creation
        user1 = self.request.user  # Retrieves the authenticated user who is sending the friend request
        try:
            user2_id = self.kwargs['user2_id']  # Retrieves the 'user2_id' (the person receiving the request) from the URL parameters
            user2 = CustomUser.objects.get(id=user2_id)  # Fetches the user with the corresponding 'user2_id' from the database
            serializer.save(user1=user1, user2=user2)  # Saves the new friend request, with 'user1' (requester) and 'user2' (requestee) as specified
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

# Accept a Friend Request
class AcceptFriendRequest(generics.UpdateAPIView):  # This view allows updating (accepting) a friend request (UpdateAPIView allows updating existing records)
    queryset = FriendRequest.objects.all()  # Defines the queryset to work with all friend requests
    serializer_class = FriendRequestSerializer  # Specifies the serializer to format the data related to the FriendRequest model
    permission_classes = [IsAuthenticated]  # Restricts access to authenticated users only

    def perform_update(self, serializer):  # Custom behavior when updating a friend request
        friend_request = self.get_object()  # Retrieves the specific friend request that is being updated (accepted in this case)
        if friend_request.user2 != self.request.user:
            raise ValidationError("You cannot respond to this friend request.")
        accepted = self.request.data.get('accepted')
        if accepted is True:
            friend_request.accepted = True
            friend_request.save()
            # Create Friend instance
            Friend.objects.create(user1=friend_request.user1, user2=friend_request.user2)
        elif accepted is False:
            friend_request.accepted = False
            friend_request.save()
        else:
            raise ValidationError("Invalid value for 'accepted'.")

        
# List Friend Requests for the current logged-in user
class ListFriendRequests(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return friend requests where the current user is the receiver (user2)
        return FriendRequest.objects.filter(user2=self.request.user, accepted__isnull=True)
    
class FriendStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        current_user = request.user
        other_user = get_object_or_404(CustomUser, id=user_id)

        status = current_user.get_friend_status(other_user)
        serializer = FriendStatusSerializer({'status': status})
        return Response(serializer.data)
