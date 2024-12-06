from django.test import TestCase
from django.contrib.auth import get_user_model
from api.Models.user import *
from api.Views.user import *
from api.Models.message import *
from api.Views.message import *
        
User = get_user_model()

class TestMessageModelDefs(TestCase):
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
        self.convoPart1 = ConvoParticipant.objects.create(user=self.user1, convo=self.convo)
        self.convoPart2 = ConvoParticipant.objects.create(user=self.user2, convo=self.convo)
        self.message = Message.objects.create(convo=self.convo, sender=self.user1, message="Hello!")
        self.convoSetting = ConvoSetting.objects.create(convo=self.convo, user=self.user1)

    def test_convo_str(self):
        self.assertEqual(str(self.convo), "convo")
        
    def test_convo_participant_str(self):
        self.assertEqual(str(self.convoPart1), "participant")
        
    def test_message_str(self):
        self.assertEqual(str(self.message), str(self.message.pk))
        
    def test_convo_setting_str(self):
        self.assertEqual(str(self.convoSetting), "setting")
        