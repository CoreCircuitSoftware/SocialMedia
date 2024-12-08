from django.test import TestCase
from api.Models.user import *
from api.Views.user import *

class TestProfileDefs(TestCase):    
    def test_create_no_email(self):
        with self.assertRaises(ValueError) as context:
            self.user = CustomUser.objects.create_user(
                username="testuser",
                password="password123",
                email=None,  # Email is not provided
                displayName="Test User"
            )
        self.assertEqual(str(context.exception), "The email field must be set")
        
    def test_create_superuser(self):
        superuser = CustomUser.objects.create_superuser('superuser', 'pass', 'test@mail.com', 'superDisplay')
        self.assertIsNotNone(superuser)
        self.assertTrue(superuser.is_admin)
        
    def test_CustomUser_str(self):
        user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.assertEqual(str(user), 'testUser')