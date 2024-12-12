from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import CustomUser
from api.Models.post import *
from api.Views.post import *
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch, PropertyMock

class TestPostDefs(APITestCase):
    @patch('django.core.files.storage.default_storage.url')
    @patch('django.core.files.storage.default_storage.save')
    def setUp(self, mock_save, mock_url):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        
        mock_save.return_value = 'mocked_image.jpg'
        mock_url.return_value = 'http://example.com/mock_image.jpg'
        
        self.post = Post.objects.create(user=self.user, title="Test Post", hasMedia=True)
        self.media = Media.objects.create(
            post=self.post,
            mediaType=0,
            mediaURL='http://example.com/mock_image.jpg',
            image=SimpleUploadedFile("media.jpg", b"file_content", content_type="image/jpeg")
        )
        
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        
    @patch('api.models.Media.image', new_callable=PropertyMock)
    def test_get_media_url(self, mock_image_field):
        mock_image_field.return_value.url = 'http://example.com/mock_image.jpg'
        media = Media.objects.filter(post=self.post).first()
        self.assertEqual(media.get_media_url(), 'http://example.com/mock_image.jpg')
        
    def test_comment_str(self):
        self.assertEqual(str(self.comment), str(self.comment.pk))