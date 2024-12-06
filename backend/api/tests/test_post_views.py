from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import CustomUser
from api.Models.post import *
from api.Views.post import *
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile

class TestCreatePostView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.media_file1 = SimpleUploadedFile("media1.jpg", b"file_content", content_type="image/jpeg")
        self.media_file2 = SimpleUploadedFile("media2.jpg", b"file_content", content_type="image/jpeg")
        self.media_file3 = SimpleUploadedFile("media3.mp4", b"file_content", content_type="video/mp4")
        
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('create-post')

    def test_create_post(self):
        data = {
            'title': 'Test Post',
            'description': 'Test description',
        }
        files = {"media": [self.media_file1, self.media_file2]}
        response = self.client.post(self.url, data=data, files=files, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Post.objects.filter(user=self.user, title='Test Post').exists())
        
    # def test_create_post_bad_media(self):
    #     data = {
    #         'title': 'Test Post 2',
    #         'description': 'Test description',
    #     }
    #     files = {"media": [self.media_file3]}
    #     response = self.client.post(self.url, data=data, files=files, format='json')
    #     # self.assertEqual(response.status_code, 400)
    #     self.assertFalse(Post.objects.filter(user=self.user, title='Test Post 2').exists())

    def test_create_post_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'title': 'Test Post', 'description': 'Test description'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)

class TestPostMediaListView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        
        self.post = Post.objects.create(
            user=self.user, title="Test Post"
        )
        
        self.media = Media.objects.create(post=self.post, mediaType=0, image='media/test_image.jpg')
        
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('post-media-list', kwargs={'post_id': self.post.postID})

    def test_get_post_media(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)

    def test_get_post_media_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        
class TestPostListView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='DisplayUser1'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='DisplayUser2'
        )
        
        self.post1 = Post.objects.create(user=self.user1, title="User1's Post")
        self.post2 = Post.objects.create(user=self.user2, title="User2's Post")
        
        self.token = str(AccessToken.for_user(self.user1))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('post-list', kwargs={'user_id': self.user1.id})

    def test_get_user_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)

    def test_get_user_posts_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        
class TestPostDetailView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        
        self.post = Post.objects.create(user=self.user, title="Test Post")
        
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('view-post', kwargs={'pk': self.post.postID})

    def test_get_post_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.post.title)

    def test_get_post_detail_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        
class TestPostListSortNewView(APITestCase):
    def setUp(self):
        # Create some sample posts
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='TestUser'
        )
        self.post1 = Post.objects.create(
            user=self.user,
            title="First Post",
            description="Description of first post"
        )
        self.post2 = Post.objects.create(
            user=self.user,
            title="Second Post",
            description="Description of second post"
        )
        self.post3 = Post.objects.create(
            user=self.user,
            title="Third Post",
            description="Description of third post"
        )
        self.url = reverse('post-list-sort-new')

    def test_list_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)  # Check that the 3 posts are returned
        self.assertEqual(response.data[0]['title'], self.post1.title)  # Check that posts are returned in the correct order

    def test_get_post_detail_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200) # Should be able to sort new without sign-in
        
class TestPostVotesCreateView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        
        self.post = Post.objects.create(user=self.user, title="Test Post")
        
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('create-post-vote')

    def test_upvote(self):
        data = {'vote': True, 'post': self.post.postID, 'user': self.user.pk}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(PostVote.objects.filter(post=self.post, user=self.user, vote=True).exists())
        
    def test_downvote(self):
        data = {'vote': False, 'post': self.post.postID, 'user': self.user.pk}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(PostVote.objects.filter(post=self.post, user=self.user, vote=False).exists())

    def test_upvote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'vote': True}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_downvote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'vote': False}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
class TestPostVotesReturnView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='TestUser1'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='TestUser2'
        )
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Description"
        )
        self.vote1 = PostVote.objects.create(
            user=self.user1,
            post=self.post,
            vote=True
        )
        self.vote2 = PostVote.objects.create(
            user=self.user2,
            post=self.post,
            vote=False
        )
        self.url = reverse('get-total-post-votes', kwargs={'pk': self.post.postID})

    def test_list_post_votes(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        
    def test_create_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 405)
        
class TestPostVotesGetView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='TestUser1'
        )
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Description"
        )
        self.vote = PostVote.objects.create(
            user=self.user1,
            post=self.post,
            vote=True
        )
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('get-post-vote', kwargs={'pk': self.post.postID})

    def test_get_user_post_vote(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['vote'], True)

    def test_get_post_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 401)
        
class TestPostVoteDeleteView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='TestUser1'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='TestUser2'
        )
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Description"
        )
        self.vote = PostVote.objects.create(
            user=self.user1,
            post=self.post,
            vote=True
        )
        self.vote2 = PostVote.objects.create(
            user=self.user2,
            post=self.post,
            vote=True
        )
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('delete-post-vote', kwargs={'pk': self.post.postID})

    def test_delete_post_vote(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(PostVote.objects.filter(user=self.user1, post=self.post).exists())
        
    # def test_other_user_delete_post_vote(self):
    #     url = reverse('delete-post-vote', kwargs={'user': self.user2,'pk': self.post.postID})
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, 400)
    #     self.assertFalse(PostVote.objects.filter(user=self.user1, post=self.post).exists())

    def test_post_vote_delete_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 401)
        
class TestPostVotesUpdateView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='TestUser1'
        )
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Description"
        )
        self.vote = PostVote.objects.create(
            user=self.user1,
            post=self.post,
            vote=True
        )
        self.token = str(AccessToken.for_user(self.user1))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('update-post-vote', kwargs={'pk': self.post.postID})

    def test_update_post_vote(self):
        response = self.client.patch(self.url, {'vote': False})
        self.assertEqual(response.status_code, 200)
        self.vote.refresh_from_db()
        self.assertEqual(self.vote.vote, False)
        
    def test_update_post_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.patch(self.url, {'vote': False})
        self.assertEqual(response.status_code, 401)

class TestPostCommentsVotesReturnView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='testUser1',
            password='testPassword1',
            email='user1@mail.com',
            displayName='TestUser1'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='TestUser2'
        )
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Description"
        )
        self.comment1 = Comment.objects.create(
            user=self.user1,
            post=self.post,
            commentContent="Test Comment 1"
        )
        self.comment2 = Comment.objects.create(
            user=self.user2,
            post=self.post,
            commentContent="Test Comment 2"
        )
        self.url = reverse('get-total-votes-comments', kwargs={'pk': self.post.postID})

    def test_list_comments_for_post(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        
    def test_list_comments_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        
class TestPostDeleteView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='TestUser'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='TestUser2'
        )
        self.post = Post.objects.create(
            user=self.user,
            title="Test Post",
            description="Test Description"
        )
        self.post2 = Post.objects.create(
            user=self.user2,
            title="Test Post2",
            description="Test Description2"
        )
        self.token = str(AccessToken.for_user(self.user))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('delete-post', kwargs={'pk': self.post.postID})

    def test_delete_post(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Post.objects.filter(postID=self.post.postID).exists())
        
    def test_other_user_delete_post(self):
        url = reverse('delete-post', kwargs={'pk': self.post2.postID})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
        self.assertTrue(Post.objects.filter(user=self.user2, postID=self.post2.postID).exists())

    def test_delete_post_unauthorized(self):
        post2 = Post.objects.create(
            user=self.user,
            title="Test Post 2",
            description="Test Description 2"
        )
        
        self.url = reverse('delete-post', kwargs={'pk': post2.postID})
        self.client.credentials()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 401)

class TestPostUpdateView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='TestUser'
        )
        self.user2 = CustomUser.objects.create_user(
            username='testUser2',
            password='testPassword2',
            email='user2@mail.com',
            displayName='TestUser2'
        )
        self.post = Post.objects.create(
            user=self.user,
            title="Test Post",
            description="Test Description"
        )
        self.post2 = Post.objects.create(
            user=self.user2,
            title="Test Post2",
            description="Test Description2"
        )
        self.token = str(AccessToken.for_user(self.user))
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('edit-post', kwargs={'pk': self.post.postID})

    def test_update_post(self):
        response = self.client.patch(self.url, {'title': 'Updated Title'})
        self.assertEqual(response.status_code, 200)
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, 'Updated Title')
        
    def test_other_user_update_post(self):
        url = reverse('edit-post', kwargs={'pk': self.post2.postID})
        response = self.client.patch(url, {'title': 'Updated Title'})
        self.assertEqual(response.status_code, 404)
        self.post.refresh_from_db()
        self.assertEqual(self.post2.title, 'Test Post2')

    def test_update_post_unauthorized(self):
        self.client.credentials()
        response = self.client.patch(self.url, {'title': 'Updated Title Again'})
        self.assertEqual(response.status_code, 401)
