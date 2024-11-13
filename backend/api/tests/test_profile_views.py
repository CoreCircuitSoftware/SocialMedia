#tests that views lead to correct status codes when called
#status code cheat sheet: https://cheatography.com/kstep/cheat-sheets/http-status-codes/

from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import *
from api.Views.user import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView    #premade views to access and refresh tokens

class TestRegisterView(TestCase):
    username = 'testUsername'
    password = 'testPassword'
    email = 'test@mail.com'
    displayName = 'testDisplayName'
    url = reverse('register')
    
    def test_register_view(self):
        response = self.client.post(self.url, {
            'username': self.username, 
            'password': self.password, 
            'email': self.email, 
            'displayName': self.displayName 
            })
        self.assertEqual(response.status_code, 201)
        
    def test_missing_field(self):
        response = self.client.post(self.url, {
            # 'username': self.username, 
            'password': self.password, 
            'email': self.email, 
            'displayName': self.displayName 
            })
        self.assertEqual(response.status_code, 400)
        
    def test_bad_email(self):
        response = self.client.post(self.url, {
            'username': self.username, 
            'password': self.password, 
            'email': 'badEmail', 
            'displayName': self.displayName 
            })
        self.assertEqual(response.status_code, 400)
        
class TestLoginView(TestCase):
    url = reverse('get_token')
    password = 'testPassword' #since pw gets encrypted, store here to be usable later
    
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='testUsername',
            password=self.password,
            email='test@mail.com', 
            displayName='testDisplayName'
            )
        self.token = str(AccessToken.for_user(self.user))
        self.client = APIClient()
        
    def test_login(self):
        response = self.client.post(self.url, {
            'username': self.user.username, 
            'password': self.password, 
            })
        self.assertEqual(response.status_code, 200)
        
    def test_missing_field(self):
        response = self.client.post(self.url, {
            # 'username': self.user.username, 
            'password': self.user.password, 
            })
        self.assertEqual(response.status_code, 400)
        
    def test_bad_password(self):
        response = self.client.post(self.url, {
            'username': self.user.username, 
            'password': 'badPassword',
            })
        self.assertEqual(response.status_code, 401)

class TestProfileDataReadView(TestCase):
    url = reverse('user-profile-read')
    
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
    
    def test_profile_read(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], self.user.username)

class TestProfileDataReadByUsernameView(TestCase):
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
        self.url = reverse('user-data-read-by-username', kwargs={'username': self.user2.username})
    
    def test_profile_data_read_by_username(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['id'], str(self.user2.pk))
        
class TestProfileDataReadByIdView(TestCase):
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
        self.url = reverse('user-data-read-by-id', kwargs={'id': self.user2.pk})
    
    def test_profile_data_read_by_id(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], self.user2.username)
        
class TestUserProfileUpdateView(TestCase):
    url = reverse('user-profile-update')

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

    def test_profile_update(self):
        response = self.client.patch(self.url, {
            'displayName': 'updatedDisplayName'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.displayName, 'updatedDisplayName')
        
class TestUserProfileDeleteView(TestCase):
    url = reverse('user-profile-delete')

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

    def test_profile_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(CustomUser.objects.filter(username=self.user.username).exists())

class TestSearchProfilesView(TestCase):
    url = reverse('profile-search', kwargs={'username_chunk': 'search'})

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
        
        # Create additional users for search
        User.objects.create_user(username="searchUser1", password="password", email="search1@mail.com", displayName="Display1")
        User.objects.create_user(username="searchUser2", password="password", email="search2@mail.com", displayName="Display2")

    def test_search_profiles(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)

class TestSearchProfilesAllView(TestCase):
    url = reverse('profile-search-all')

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
        
        # Create more users to test retrieval
        User.objects.create_user(username="user1", password="password", email="user1@mail.com", displayName="Display1")
        User.objects.create_user(username="user2", password="password", email="user2@mail.com", displayName="Display2")

    def test_search_profiles_all(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)  # Check if at least 1 user (self) is returned

#tests views without authentication tokens
class TestUnauthenticated(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='testUsername',
            password='testPassword',
            email='test@mail.com',
            displayName='testDisplayName'
        )
        self.user2 = User.objects.create_user(
            username='testUsername2',
            password='testPassword', 
            email='test2@mail.com', 
            displayName='testDisplayName2'
            )
        
        # Create additional users for search
        User.objects.create_user(username="searchUser1", password="password", email="search1@mail.com", displayName="Display1")
        User.objects.create_user(username="searchUser2", password="password", email="search2@mail.com", displayName="Display2")
        
    def test_unauthenticated_profile_read(self):
        url = reverse('user-profile-read')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        
    def test_unauthenticated_profile_data_read_by_username(self):
        url = reverse('user-data-read-by-username', kwargs={'username': self.user2.username})
        response = self.client.get(url, {
            'username': self.user2.username,
            })
        self.assertEqual(response.status_code, 200) #Don't need to be authenticated to view profile pages
        
    def test_unauthenticated_profile_data_read_by_id(self):
        url = reverse('user-data-read-by-id', kwargs={'id': self.user2.pk})
        response = self.client.get(url, {
            'id': self.user2.pk,
            })
        self.assertEqual(response.status_code, 200) #Don't need to be authenticated to view profile pages
        
    def test_unauthenticated_profile_update(self):
        url = reverse('user-profile-update')
        response = self.client.patch(url, {
            'displayName': 'updatedDisplayName'
        }, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_unauthenticated_search_profiles(self):
        url = reverse('profile-search', kwargs={'username_chunk': 'search'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        self.assertGreater(len(response.data), 0)

    def test_unauthenticated_search_profiles_all(self):
        url = reverse('profile-search-all')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        self.assertGreaterEqual(len(response.data), 1)  # Check if at least 1 user (self) is returned