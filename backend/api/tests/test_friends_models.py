from django.test import TestCase
from django.contrib.auth import get_user_model
from api.Models.user import *
from api.Views.user import *
from api.Models.friends import *
from api.Views.friends import *
        
User = get_user_model()

class TestFriendModelDefs(TestCase):
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
        self.user4 = User.objects.create_user(
            username='testUser4',
            password='testPassword4',
            email='user4@mail.com',
            displayName='DisplayUser4'
        )
        
        self.friendship = Friend.objects.create(user1=self.user1, user2=self.user2)
        self.pending_request = FriendRequest.objects.create(user1=self.user1, user2=self.user3, accepted=None)
        self.received_request = FriendRequest.objects.create(user1=self.user4, user2=self.user1, accepted=None)

    def test_user_is_self(self):
        status = get_friend_status(self.user1, self.user1)
        self.assertEqual(status, 'user')

    def test_users_are_friends(self):
        status = get_friend_status(self.user1, self.user2)
        self.assertEqual(status, 'friends')

    def test_pending_friend_request(self):
        status = get_friend_status(self.user1, self.user3)
        self.assertEqual(status, 'pending')

    def test_pending_received_request(self):
        status = get_friend_status(self.user1, self.user4)
        self.assertEqual(status, 'pending_received')

    def test_no_relationship(self):
        status = get_friend_status(self.user2, self.user3)
        self.assertEqual(status, 'none')