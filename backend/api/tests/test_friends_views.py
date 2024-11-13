#tests that views lead to correct status codes when called
#status code cheat sheet: https://cheatography.com/kstep/cheat-sheets/http-status-codes/

from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import *
from api.Views.user import *
from api.Models.friends import *
from api.Views.friends import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView    #premade views to access and refresh tokens
        
class TestFriendDeleteView(TestCase):

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='testUsername',
            password='testPassword', 
            email='test@mail.com', 
            displayName='testDisplayName'
            )
        self.token = str(AccessToken.for_user(self.user))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        #set up other user to navigate to
        self.user2 = User.objects.create_user(
            username='testUsername2',
            password='testPassword', 
            email='test2@mail.com', 
            displayName='testDisplayName2'
            )
        
        self.client.force_authenticate(user=self.user)
        self.friendship = Friend.objects.create(user1=self.user, user2=self.user2)

    def test_delete_friendship(self):
        url = reverse('friend-delete', args=[self.friendship.friendShipID])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
