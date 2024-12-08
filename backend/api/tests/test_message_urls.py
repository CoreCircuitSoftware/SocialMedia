from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.message import *
from api.Views.message import *

class TestMessageUrls(TestCase):
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
    
    def test_check_convo_url_is_resolved(self):
        url = reverse('check-convo', kwargs={'user_1': self.user1.id, 'user_2': self.user2.id})
        self.assertEqual(resolve(url).func.view_class, CheckConvo)

    def test_create_convo_url_is_resolved(self):
        url = reverse('create-convo')
        self.assertEqual(resolve(url).func.view_class, CreateConvo)

    def test_add_convo_participant_url_is_resolved(self):
        url = reverse('add-convo-participant')
        self.assertEqual(resolve(url).func.view_class, AddConvoParticipant)

    def test_get_messages_url_is_resolved(self):
        url = reverse('get-messages', kwargs={'convoID': 1})
        self.assertEqual(resolve(url).func.view_class, GetMessages)

    def test_send_message_url_is_resolved(self):
        url = reverse('send-message')
        self.assertEqual(resolve(url).func.view_class, SendMessage)

    def test_find_convo_participants_url_is_resolved(self):
        url = reverse('find-convo-participants', kwargs={'user_id': self.user1.id})
        self.assertEqual(resolve(url).func.view_class, FindConvoParticipants)

    def test_latest_message_url_is_resolved(self):
        url = reverse('latest-message', kwargs={'convoID': 1})
        self.assertEqual(resolve(url).func.view_class, LatestMessageView)
