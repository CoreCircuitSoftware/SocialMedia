from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import Q
from .user import *
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid

class Convo(models.Model):
    convoID = models.AutoField(primary_key=True)
    convoName = models.CharField(max_length=20, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
         return "convo"
    
class ConvoParticipant(models.Model):
    participantID = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    convo = models.ForeignKey(Convo, on_delete=models.CASCADE)

    def __str__(self):
        return "participant"
    
class Message(models.Model): #add editing?
    messageID = models.AutoField(primary_key=True)
    convo = models.ForeignKey(Convo, on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    messageDate = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=255)
    hasEdit = models.BooleanField(default=False)
    editDate = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.messageID
    
class ConvoSetting(models.Model):
    settingID = models.AutoField(primary_key=True)
    convo = models.ForeignKey(Convo, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    isMuted = models.BooleanField(default=False)
    isPinned = models.BooleanField(default=False)

    def __str__(self):
         return "setting"