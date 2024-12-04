from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.post import *
from api.Views.post import *

class TestPostUrls(TestCase):
    def setUp(self):
        User = get_user_model()
        
        self.user = User.objects.create_user(
            username="testUser",
            password="testPassword", 
            email="test@mail.com", 
            displayName="testDisplayName"
        )
        
        self.token = str(AccessToken.for_user(self.user))
        
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_post_url_is_resolved(self):
        url = reverse('create-post')
        self.assertEqual(resolve(url).func.view_class, PostCreate)
    
    def test_view_post_user_url_is_resolved(self):
        url = reverse('post-list', kwargs={'user_id': self.user.id})
        self.assertEqual(resolve(url).func.view_class, PostListView)
    
    def test_view_post_sort_new_url_is_resolved(self):
        url = reverse('post-list-sort-new')
        self.assertEqual(resolve(url).func.view_class, PostListSortNew)
    
    def test_view_post_url_is_resolved(self):
        url = reverse('view-post', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostDetailView)
    
    def test_post_media_list_url_is_resolved(self):
        url = reverse('post-media-list', kwargs={'post_id': 1})
        self.assertEqual(resolve(url).func.view_class, PostMediaListView)
    
    def test_delete_post_url_is_resolved(self):
        url = reverse('delete-post-vote', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostVoteDeleteView)
    
    def test_create_vote_url_is_resolved(self):
        url = reverse('create-post-vote')
        self.assertEqual(resolve(url).func.view_class, PostVotesCreate)
    
    def test_update_vote_url_is_resolved(self):
        url = reverse('update-post-vote', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostVotesUpdate)
    
    def test_get_total_votes_url_is_resolved(self):
        url = reverse('get-total-post-votes', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostVotesReturnView)
    
    def test_get_vote_url_is_resolved(self):
        url = reverse('get-post-vote', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostVotesGetView)
    
    def test_get_total_votes_comments_url_is_resolved(self):
        url = reverse('get-total-votes-comments', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostCommentsVotesReturnView)
    
    def test_edit_post_url_is_resolved(self):
        url = reverse('edit-post', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostUpdate)
    
    def test_delete_post_url_is_resolved(self):
        url = reverse('delete-post', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.view_class, PostDeleteView)

