from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import Q
from .user import *
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid

class Community(models.Model):
    communityID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True)
    iconURL = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(auto_now_add=True)

class CommunityMembership(models.Model):
    membershipID = models.AutoField(primary_key=True) #composite key?
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    joinDate = models.DateTimeField(auto_now_add=True)
    role = role = models.IntegerField(default=1)  # 0 = member, 1 = moderator, 2 = admin, 3 = owner