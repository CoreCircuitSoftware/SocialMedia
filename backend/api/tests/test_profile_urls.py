#tests that urls resolve(map) to the correct view

from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import *
from api.Views.user import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView    #premade views to access and refresh tokens

class TestUrls(TestCase):
    def setUp(self):
        User = get_user_model()
        
        # Create a test user
        self.user = User.objects.create_user(
            username="testUsername",
            password="testPassword", 
            email="test@mail.com", 
            displayName="testDisplayName"
            )
        
        # token for authorizing
        self.token = str(AccessToken.for_user(self.user))
        
        # This imitates a real user on the site
        self.client = APIClient()
        
    def test_register_url_is_resolved(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, CreatedUserView)
        
    def test_token_url_is_resolved(self): #login url
        url = reverse('get_token')
        self.assertEqual(resolve(url).func.view_class, TokenObtainPairView)
        
    def test_token_refresh_url_is_resolved(self):
        url = reverse('refresh_token')
        self.assertEqual(resolve(url).func.view_class, TokenRefreshView)
    
    def test_read_url_is_resolved(self):
        url = reverse('user-profile-read')
        self.assertEqual(resolve(url).func.view_class, UserProfileRead)
        
    def test_read_data_by_username_is_resolved(self):
        url = reverse('user-data-read-by-username', kwargs={'username': self.user.username})
        self.assertEqual(resolve(url).func.view_class, UserDataReadByUsername)
        
    def test_read_data_by_id_url_is_resolved(self):
        url = reverse('user-data-read-by-id', kwargs={'id': self.user.id})
        self.assertEqual(resolve(url).func.view_class, UserDataReadByID)
        
    def test_update_is_resolved(self):
        url = reverse('user-profile-update')
        self.assertEqual(resolve(url).func.view_class, UserProfileUpdate)
        
    def test_search_profile_is_resolved(self):
        url = reverse('profile-search', kwargs={'username_chunk':'test'})
        self.assertEqual(resolve(url).func.view_class, SearchProfiles)
        
    def test_search_profile_all_is_resolved(self):
        url = reverse('profile-search-all')
        self.assertEqual(resolve(url).func.view_class, SearchProfilesAll)