from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import *
from api.serializers import *
from api.Models.message import *

User = get_user_model()

class TestCheckConvoView(TestCase):
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
        self.convo = Convo.objects.create()
        ConvoParticipant.objects.create(user=self.user1, convo=self.convo)
        ConvoParticipant.objects.create(user=self.user2, convo=self.convo)

        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('check-convo', kwargs={'user_1': self.user1.pk, 'user_2': self.user2.pk})

    def test_check_convo_exists(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, self.convo.convoID)

    def test_check_convo_not_exists(self):
        user3 = User.objects.create_user(
            username='testUser3',
            password='testPassword3',
            email='user3@mail.com',
            displayName='DisplayUser3'
        )
        url = reverse('check-convo', kwargs={'user_1': self.user1.pk, 'user_2': user3.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, None)

class TestCreateConvoView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_convo(self):
        url = reverse('create-convo')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Convo.objects.exists())
        
    def test_create_convo_invalid_data(self):
        invalid_data = {"convoName": "ThisNameIsWayTooLongForTheField"}
        serializer = ConvoSerializer(data=invalid_data)
        assert not serializer.is_valid()

class TestAddConvoParticipantView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.convo = Convo.objects.create()
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('add-convo-participant')

    def test_add_convo_participant(self):
        data = {'user': self.user1.pk, 'convo': self.convo.convoID}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(ConvoParticipant.objects.filter(user=self.user1.pk, convo=self.convo.convoID).exists())
        
    def test_add_convo_participant_invalid_data(self):
        invalid_data = {"participantID": "bad", "user": "bad", "convo": "bad"}
        serializer = ConvoParticipantSerializer(data=invalid_data)
        assert not serializer.is_valid()

class TestGetMessagesView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.convo = Convo.objects.create()
        self.message = Message.objects.create(convo=self.convo, sender=self.user1, message="Hello!")
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('get-messages', kwargs={'convoID': self.convo.convoID})

    def test_get_messages(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['message'], "Hello!")

class TestSendMessageView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.convo = Convo.objects.create()
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('send-message')

    def test_send_message(self):
        data = {'convo': self.convo.convoID, 'sender': self.user1.pk, 'message': 'Hello!'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Message.objects.filter(convo=self.convo, sender=self.user1, message='Hello!').exists())
        
    def test_send_message_invalid_data(self):
        invalid_data = {'messageID': "bad", 'convo': "bad", 'sender': "bad", 'messageDate': "bad",
                        'message': "bad", 'hasEdit': "bad", 'editDate': "bad"}
        serializer = MessageSerializer(data=invalid_data)
        assert not serializer.is_valid()

class TestFindConvoParticipantsView(TestCase):
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
        self.convo = Convo.objects.create()
        ConvoParticipant.objects.create(user=self.user1, convo=self.convo)
        ConvoParticipant.objects.create(user=self.user2, convo=self.convo)

        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('find-convo-participants', kwargs={'user_id': self.user1.pk})

    def test_find_convo_participants(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user'], self.user2.pk)

class TestLatestMessageView(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.convo = Convo.objects.create()
        self.message = Message.objects.create(convo=self.convo, sender=self.user1, message="Hello!")
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('latest-message', kwargs={'convoID': self.convo.convoID})

    def test_latest_message(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], "Hello!")

class TestUnauthenticatedMessageViews(TestCase):
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

        self.convo = Convo.objects.create()
        self.participant1 = ConvoParticipant.objects.create(user=self.user1, convo=self.convo)
        self.participant2 = ConvoParticipant.objects.create(user=self.user2, convo=self.convo)

        self.client = APIClient()

    def test_check_convo_unauthenticated(self):
        url = reverse('check-convo', kwargs={'user_1': self.user1.pk, 'user_2': self.user2.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)

    def test_create_convo_unauthenticated(self):
        url = reverse('create-convo')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 401)

    def test_add_convo_participant_unauthenticated(self):
        url = reverse('add-convo-participant')
        data = {'user': self.user1.pk, 'convo': self.convo.convoID}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)

    def test_get_messages_unauthenticated(self):
        url = reverse('get-messages', kwargs={'convoID': self.convo.convoID})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_send_message_unauthenticated(self):
        url = reverse('send-message')
        data = {'convo': self.convo.convoID, 'message': 'New message'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)

    def test_find_convo_participants_unauthenticated(self):
        url = reverse('find-convo-participants', kwargs={'user_id': self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_latest_message_unauthenticated(self):
        url = reverse('latest-message', kwargs={'convoID': self.convo.convoID})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
