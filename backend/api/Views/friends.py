from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..Models.friends import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

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
        
class RemoveFriend(generics.DestroyAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    # permission_classes = [IsAuthenticated]
    
    def perform_destroy(self, instance):
        friend_ship_id = self.kwargs['pk']
        friend_instance = get_object_or_404(Friend, friendShipID=friend_ship_id)
        friend_instance.delete()
        
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

        status = get_friend_status(current_user, other_user)
        serializer = FriendStatusSerializer({'status': status})
        return Response(serializer.data)
    
class RetrieveFriendshipByUsername(generics.RetrieveAPIView):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        username1 = self.kwargs['username1']
        username2 = self.kwargs['username2']
        friendship = get_object_or_404(
            Friend,
            Q(user1__username=username1, user2__username=username2) |
            Q(user1__username=username2, user2__username=username1)
        )
        return friendship
        