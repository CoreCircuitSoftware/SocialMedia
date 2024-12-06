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
        
User = get_user_model()

class TestListFriendsView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.friendship = Friend.objects.create(user1=self.user1, user2=self.user2)
        
        self.token1 = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        
        self.url = reverse('list-friends', kwargs={'user_id': self.user1.id})

    def test_list_friends(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

class TestSendFriendRequestView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_send_friend_request(self):
        url = reverse('send-friend-request', kwargs={'user2_id': self.user2.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(FriendRequest.objects.filter(user1=self.user1, user2=self.user2).exists())
        
    def test_send_friend_request_fake_user(self):
        url = reverse('send-friend-request', kwargs={'user2_id': 'ffffffff-ffff-ffff-ffff-ffffffffffff'})
        response = self.client.post(url)
        self.assertEqual(response.json(), {"detail": "User not found."})

class TestAcceptFriendRequestView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        self.user3 = User.objects.create_user(
            username='testUser3',
            password='testPassword3',
            email='user3@mail.com',
            displayName='DisplayUser3'
        )
        
        self.token = str(AccessToken.for_user(self.user2))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_accept_friend_request(self):
        friend_request = FriendRequest.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('accept-friend-request', kwargs={'pk': friend_request.pk})
        response = self.client.patch(url, {'accepted': True}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Friend.objects.filter(user1=self.user1, user2=self.user2).exists())
        
    def test_decline_friend_request(self):
        friend_request = FriendRequest.objects.create(user1=self.user1, user2=self.user3)
        url = reverse('accept-friend-request', kwargs={'pk': friend_request.pk})
        response = self.client.patch(url, {'accepted': False}, format='json')
        self.assertFalse(Friend.objects.filter(user1=self.user1, user2=self.user3).exists())
        
    def test_accept_friend_request_not_allowed(self):
        friend_request = FriendRequest.objects.create(user1=self.user2, user2=self.user3)
        url = reverse('accept-friend-request', kwargs={'pk': friend_request.pk})
        response = self.client.patch(url, {'accepted': True}, format='json')
        self.assertEqual(response.json(), ['You cannot respond to this friend request.'])

class TestListFriendRequestsView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        FriendRequest.objects.create(user1=self.user2, user2=self.user1)
        
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('list-friend-requests')

    def test_list_friend_requests(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)
        
class TestFriendStatusView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('friend-status', kwargs={'user_id': self.user2.id})

    def test_friend_status(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        
class TestRetrieveFriendshipByUsername(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )

        self.friendship = Friend.objects.create(user1=self.user1, user2=self.user2)

        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('retrieve-friendship-by-username', kwargs={
            'username1': self.user1.username,
            'username2': self.user2.username
        })

    def test_retrieve_friendship_by_username(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user1']['username'], self.user1.username)
        self.assertEqual(response.data['user2']['username'], self.user2.username)

    def test_friendship_not_found(self):
        # Test with non-existent usernames
        url = reverse('retrieve-friendship-by-username', kwargs={
            'username1': 'nonExistentUser',
            'username2': self.user2.username
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

class TestDeleteFriendshipView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.friendship = Friend.objects.create(user1=self.user1, user2=self.user2)
        
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        

    def test_delete_friendship(self):
        url = reverse('delete-friendship', kwargs={'pk': self.friendship.friendShipID})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Friend.objects.filter(user1=self.user1, user2=self.user2).exists())
        
    def test_delete_fake_friendship(self):
        url = reverse('delete-friendship', kwargs={'pk': 999})  #fake friendship pk
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
        
class TestUnauthenticated(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = User.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.friendship = Friend.objects.create(user1=self.user1, user2=self.user2)
        
    def test_list_friends(self):
        url = reverse('list-friends', kwargs={'user_id': self.user1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_send_friend_request(self):
        url = reverse('send-friend-request', kwargs={'user2_id': self.user2.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)

    def test_accept_friend_request(self):
        self.friend_request = FriendRequest.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('accept-friend-request', kwargs={'pk': self.friend_request.pk})
        response = self.client.patch(url, {'accepted': True}, format='json')
        self.assertEqual(response.status_code, 401) 

    def test_list_friend_requests(self):
        url = reverse('list-friend-requests')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401) 

    def test_friend_status(self):
        url = reverse('friend-status', kwargs={'user_id': self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_retrieve_friendship_by_username(self):
        url = reverse('retrieve-friendship-by-username', kwargs={
            'username1': self.user1.username,
            'username2': self.user2.username
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_delete_friendship(self):
        url = reverse('delete-friendship', kwargs={'pk': self.friendship.friendShipID})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401) 