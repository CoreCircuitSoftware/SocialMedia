from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid
    
"""CustomUserManager
    Manager for CustomUser Model, extends BaseUserManager
"""
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, email, displayName):
        if not email:
            raise ValueError('The email field must be set')
        email = self.normalize_email(email)     # With if statement above, formats email properly
        user = self.model(  # Takes fields and creates user object
            username = username,
            email = email,
            displayName = displayName
        )
        user.set_password(password) #sets the password for the user
        user.save()   #saves the user modele to the database
        return user
    
    def create_superuser(self, username, password, email, displayName):
        user = self.create_user(
            username,
            password = password,
            email = email,
            displayName = displayName
        )
        user.is_admin = True
        user.save()
        return user
    
"""CustomUser model
    Django has a "User" built in, but if you want custom fields and still want authentication then you need to create a:
        1. CustomUser model that extends AbstractUser - This is what is here in this file
            Make sure to point to it in settings.py with "AUTH_USER_MODEL = 'api.CustomUser'"
        2. CustomUser Manager that extends BaseUserManager - This is in managers.py (For testing, it's here as of now)
    Will also need to create serializers and views just like any other model
"""
class CustomUser(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # Changed 'UserID'->'id' to use django User model
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=254)
    displayName = models.CharField(max_length=20, blank=True)
    profilePicture = models.CharField(max_length=255, blank=True)
    bio = models.CharField(max_length=255, blank=True)
    backgroundColor = models.CharField(max_length=7, blank=True) # hex color
    backgroundImage = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = "username" # This is the field which will be used during authentication, must be set and must be unique
    EMAIL_FIELD = "email" # This is simply an email field, not required
    REQUIRED_FIELDS = ["email", "displayName"]
    
    objects = CustomUserManager()

    def __str__(self):
        return self.name
    
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

class Post(models.Model):
    postID = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    community = models.ForeignKey('Community', on_delete=models.CASCADE, null=True, blank=True)
    postDate = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    hasEdit = models.BooleanField(default=False, blank=True)
    editDate = models.DateTimeField(null=True, blank=True)

class Media(models.Model):
    mediaID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    mediaType = models.IntegerField() # 0 = image, 1 = video?
    mediaURL = models.CharField(max_length=255)

class PostVote(models.Model):
    voteID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    vote = models.BooleanField() # True = upvote, False = downvote

class Community(models.Model):
    communityID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True)
    iconURL = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    commentID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    commentDate = models.DateTimeField(auto_now_add=True)
    commentContent = models.CharField(max_length=255)
    replyTo = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True) #now foreign key?
    hasEdit = models.BooleanField(default=False)
    editDate = models.DateTimeField(null=True, blank=True)

class CommentVote(models.Model):
    voteID = models.AutoField(primary_key=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    vote = models.BooleanField() # True = upvote, False = downvote

class CommunityMembership(models.Model):
    membershipID = models.AutoField(primary_key=True) #composite key?
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    joinDate = models.DateTimeField(auto_now_add=True)
    role = models.IntegerField() # 0 = member, 1 = moderator, 2 = admin, 3 = owner

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

# Create your models here.
class Note(models.Model):   #This acts to create a new table within the database using these params
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notes")
    
    def __str__(self):
        return self.name