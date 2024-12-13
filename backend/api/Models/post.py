from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import Q
from .user import *
from .community import *
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid


class Post(models.Model):
    postID = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=True, blank=True)
    postDate = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    hasEdit = models.BooleanField(default=False, blank=True)
    hasMedia = models.BooleanField(default=False) #boolean field to quickly know if a post has associated media without performing a database query every time
    editDate = models.DateTimeField(null=True, blank=True) 

class Media(models.Model):
    mediaID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    mediaType = models.IntegerField()  # 0 = image, 1 = video?
    mediaURL = models.CharField(max_length=255, default='')
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)

    def get_media_url(self):
        return self.image.url

class PostVote(models.Model):
    voteID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    vote = models.BooleanField() # True = upvote, False = downvote

class Comment(models.Model):
    commentID = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    commentDate = models.DateTimeField(auto_now_add=True)
    commentContent = models.CharField(max_length=255)
    replyTo = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True) #now foreign key?
    hasEdit = models.BooleanField(default=False)
    editDate = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.commentID)

class CommentVote(models.Model):
    voteID = models.AutoField(primary_key=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    vote = models.BooleanField() # True = upvote, False = downvote