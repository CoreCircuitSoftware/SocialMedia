#tests that urls resolve(map) to the correct view

from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.friends import *
from api.Views.friends import *

class TestFriendUrls(TestCase):
    def setUp(self):
        User = get_user_model()
        
        self.user1 = User.objects.create_user(
            username="testUser1",
            password="testPassword1", 
            email="test1@mail.com", 
            displayName="testDisplayName1"
        )
        
        self.user2 = User.objects.create_user(
            username="testUser2",
            password="testPassword2", 
            email="test2@mail.com", 
            displayName="testDisplayName2"
        )
        
        self.token = str(AccessToken.for_user(self.user1))
        
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
    
    def test_unauthenticated_list_friends_url_is_resolved(self):
        url = reverse('list-friends', kwargs={'user_id': self.user1.id})
        self.assertEqual(resolve(url).func.view_class, ListFriends)
    
    def test_unauthenticated_send_friend_request_url_is_resolved(self):
        url = reverse('send-friend-request', kwargs={'user2_id': self.user2.id})
        self.assertEqual(resolve(url).func.view_class, SendFriendRequest)
    
    def test_unauthenticated_accept_friend_request_url_is_resolved(self):
        url = reverse('accept-friend-request', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, AcceptFriendRequest)
    
    def test_unauthenticated_list_friend_requests_url_is_resolved(self):
        url = reverse('list-friend-requests')
        self.assertEqual(resolve(url).func.view_class, ListFriendRequests)
    
    def test_unauthenticated_friend_status_url_is_resolved(self):
        url = reverse('friend-status', kwargs={'user_id': self.user2.id})
        self.assertEqual(resolve(url).func.view_class, FriendStatusView)
    
    def test_unauthenticated_retrieve_friendship_by_username_url_is_resolved(self):
        url = reverse('retrieve-friendship-by-username', kwargs={'username1': self.user1.username, 'username2': self.user2.username})
        self.assertEqual(resolve(url).func.view_class, RetrieveFriendshipByUsername)
    
    def test_unauthenticated_delete_friendship_url_is_resolved(self):
        url = reverse('delete-friendship', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, DeleteFriendship)

        
    
        
    