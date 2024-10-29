from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import Q
from .user import *
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid

def get_friend_status(self, other_user):
        if self == other_user:
            return 'self'

        # Check if already friends
        friendship_exists = Friend.objects.filter(
            Q(user1=self, user2=other_user) | Q(user1=other_user, user2=self)
        ).exists()
        if friendship_exists:
            return 'friends'

        # Check if there's a pending friend request from self to other_user
        pending_request = FriendRequest.objects.filter(
            user1=self, user2=other_user, accepted__isnull=True
        ).exists()
        if pending_request:
            return 'pending'

        # Check if there's a pending friend request from other_user to self
        pending_received = FriendRequest.objects.filter(
            user1=other_user, user2=self, accepted__isnull=True
        ).exists()
        if pending_received:
            return 'pending_received'

        return 'none'

class Friend(models.Model):
    friendShipID = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user2')
    friendDate = models.DateTimeField(auto_now_add=True)


class FriendRequest(models.Model):
    requestID = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='requester')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='requestee')
    accepted = models.BooleanField(null=True, blank=True) #null = not accepted or declined yet
    requestDate = models.DateTimeField(auto_now_add=True)