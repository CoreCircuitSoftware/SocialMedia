from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

class CommunityView(generics.CreateAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]

class CommunityReadByID(generics.RetrieveAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    def get_object(self):
        community_id = self.kwargs['communityID']
        return Community.objects.get(communityID=community_id)  

class CommunityReadByNameView(generics.RetrieveAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    def get_object(self):
        community_name = self.kwargs['name']
        return Community.objects.get(name=community_name)     
    
class CommunityMemberByUser(generics.ListAPIView):
    serializer_class = CommunityMembershipSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        userid = self.kwargs['user_id']
        return CommunityMembership.objects.filter(user_id=userid)
    
class CommunityMemberAll(generics.ListAPIView):
    print("getting all communities")
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Community.objects.all()
    

class CommunityMemberJoin(generics.CreateAPIView):
    serializer_class = CommunityMembershipSerializer
    permission_classes = [IsAuthenticated]  # Restricts access to authenticated users

    def perform_create(self, serializer):
        user = self.request.user  # Authenticated user
        #print(f"User: {user}")  # Debugging print statement to confirm user details

        try:
            community_id = self.kwargs['communityID']  # Fetch community ID from URL
            community = Community.objects.get(pk=community_id)  # Get community by primary key
            serializer.save(user=user, community=community, role=1)  # Save the membership
        except Community.DoesNotExist:
            raise NotFound(detail="Community not found.")  # Raise error if community doesn't exist
        # userid  = self.request.user
        # communityid = self.kwargs['communityID']
        # communityofpage = Community.objects.get(communityID = communityid)
        # serializer.save(community_id=communityofpage, user_id = userid, role = int(1) )


class CommunityMembershipStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, communityID):
        user = request.user
        try:
            community = Community.objects.get(pk=communityID)
            is_following = CommunityMembership.objects.filter(user=user, community=community).exists()
            return Response({"is_following": is_following})
        except Community.DoesNotExist:
            raise NotFound(detail="Community not found.")
        
class CommunityMemberLeave(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, communityID):
        user = request.user
        try:
            community = Community.objects.get(pk=communityID)
            membership = CommunityMembership.objects.get(user=user, community=community)
            membership.delete()
            return Response({"message": "Successfully unfollowed the community."}, status=204)
        except Community.DoesNotExist:
            raise NotFound(detail="Community not found.")
        except CommunityMembership.DoesNotExist:
            raise NotFound(detail="Membership not found.")

class CheckCommunityMembership(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, communityID):
        user = request.user
        try:
            membership = CommunityMembership.objects.get(user=user, community__communityID=communityID)
            return Response({"is_member": True})
        except CommunityMembership.DoesNotExist:
            return Response({"is_member": False})
        

class CommunityMemberJoin(generics.CreateAPIView):
    serializer_class = CommunityMembershipSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        community_id = self.kwargs['communityID']
        
        # Check if the user is already a member of the community
        if CommunityMembership.objects.filter(user=user, community__communityID=community_id).exists():
            raise ValidationError("You are already a member of this community.")
        
        try:
            community = Community.objects.get(communityID=community_id)
            serializer.save(user=user, community=community, role=1)
        except Community.DoesNotExist:
            raise NotFound(detail="Community not found.")
        
class LeaveCommunity(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, communityID):
        user = request.user
        try:
            membership = CommunityMembership.objects.get(user=user, community__communityID=communityID)
            membership.delete()  # Remove the membership
            return Response({"message": "You have successfully left the community."}, status=200)
        except CommunityMembership.DoesNotExist:
            raise NotFound(detail="Membership not found.")


