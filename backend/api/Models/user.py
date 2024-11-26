from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import Q
#from django.contrib.auth.models import User    # "User" references replaced with "CustomUser" custom model
import uuid


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
    
class CustomUser(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # Changed 'UserID'->'id' to use django User model
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=254)
    displayName = models.CharField(max_length=20, blank=True)
    profilePicture = models.ImageField(upload_to='profile_pics', null=True, blank=True)
    bio = models.CharField(max_length=255, blank=True)
    backgroundColor = models.CharField(max_length=7, blank=True) # hex color
    backgroundImage = models.ImageField(upload_to='background_imgs', null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = "username" # This is the field which will be used during authentication, must be set and must be unique
    EMAIL_FIELD = "email" # This is simply an email field, not required
    REQUIRED_FIELDS = ["email", "displayName"]
    
    objects = CustomUserManager()

    def __str__(self):
        return self.username