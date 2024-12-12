from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import CustomUser
from api.Models.post import *
from api.Views.post import *
from api.Views.comment import *
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch

class TestCommentCreateView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('submit-comment')
        self.post = Post.objects.create(user=self.user, title="User Post")

    def test_create_comment(self):
        data = {
            'post': self.post.pk,
            'commentContent': 'This is a test comment'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Comment.objects.filter(user=self.user, commentContent='This is a test comment').exists())

    def test_create_comment_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'post': 1, 'commentContent': 'This is a test comment'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_bad_create_comment(self):
        data = {'post': 1, 'commentContent': 'This is a test comment'}
        with patch('api.models.Comment.objects.create') as mock_create:
            mock_create.side_effect = ValidationError("Validation Error")
            response = self.client.post(self.url, data=data, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_create()

class TestPostCommentsView(APITestCase):
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
        self.post = Post.objects.create(user=self.user1, title="Test Post")
        self.comment1 = Comment.objects.create(post=self.post, user=self.user1, commentContent="Comment1")
        self.comment2 = Comment.objects.create(post=self.post, user=self.user2, commentContent="Comment2")
        self.token = str(AccessToken.for_user(self.user1))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('get-comments-post', kwargs={'pk': self.post.postID})

    def test_get_post_comments(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)

class TestHandleCommentsVoteCreate(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('handle-comment-vote')

    def test_create_comment_vote(self):
        data = {'comment': self.comment.commentID, 'vote': True, 'user': self.user.pk}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_create_comment_vote_unauthenticated(self):
        self.client.credentials()
        data = {'comment': self.comment.commentID, 'vote': True, 'user': self.user.pk}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_bad_create_comment_vote(self):
        data = {'comment': self.comment.commentID, 'vote': True, 'user': self.user.pk}
        with patch('api.models.CommentVote.objects.create') as mock_create:
            mock_create.side_effect = ValidationError("Validation Error")
            response = self.client.post(self.url, data=data, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_create()
                
class TestHandleCommentVoteGet(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.vote = CommentVote.objects.create(comment=self.comment, user=self.user, vote=True)
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('handle-comment-vote-get', kwargs={'pk': self.comment.commentID})

    def test_get_comment_vote(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['vote'], self.vote.vote)

    def test_get_comment_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

class TestHandleCommentVoteDelete(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.vote = CommentVote.objects.create(comment=self.comment, user=self.user, vote=True)
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('handle-comment-vote-delete', kwargs={'pk': self.comment.commentID})

    def test_delete_comment_vote(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(CommentVote.objects.filter(voteID=self.vote.voteID).exists())

    def test_delete_comment_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertTrue(CommentVote.objects.filter(voteID=self.vote.voteID).exists())

    def test_bad_delete_comment_vote(self):
        with patch('api.models.CommentVote.delete') as mock_delete:
            mock_delete.side_effect = ValidationError("Validation Error")
            response = self.client.delete(self.url, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_delete()
                
class TestHandleCommentVoteUpdate(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.vote = CommentVote.objects.create(comment=self.comment, user=self.user, vote=True)
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('handle-comment-vote-update', kwargs={'pk': self.comment.commentID})

    def test_update_comment_vote(self):
        data = {'vote': False}  # Change vote to downvote
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['vote'], False)

    def test_update_comment_vote_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'vote': False}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)
        
    def test_bad_update_comment_vote(self):
        with patch('api.models.CommentVote.save') as mock_save:
            mock_save.side_effect = ValidationError("Validation Error")
            response = self.client.patch(self.url, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_save()

class TestCommentDetailView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('comment-detail-view', kwargs={'pk': self.comment.commentID})

    def test_get_comment_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['commentContent'], self.comment.commentContent)

class TestCommentPageRepliesView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post'
        )
        self.comment1 = Comment.objects.create(
            post=self.post,
            user=self.user,
            commentContent='First comment'
        )
        self.comment2 = Comment.objects.create(
            post=self.post,
            user=self.user,
            commentContent='Second comment'
        )
        self.reply1 = Comment.objects.create(
            post=self.post,
            user=self.user,
            commentContent='Reply to first comment',
            replyTo=self.comment1
        )
        self.reply2 = Comment.objects.create(
            post=self.post,
            user=self.user,
            commentContent='Another reply to first comment',
            replyTo=self.comment1
        )
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        self.url = reverse('get-comments-replies', kwargs={'pk': self.comment1.commentID})

    def test_get_replies_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Should return 2 replies
        self.assertEqual(response.data[0]['commentContent'], 'Reply to first comment')

    def test_get_replies_empty(self):
        self.url = reverse('get-comments-replies', kwargs={'pk': self.comment2.commentID})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)  # Should return an empty list
        
class TestCommentDeleteView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('delete-comment', kwargs={'pk': self.comment.commentID})

    def test_delete_comment(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Comment.objects.filter(commentID=self.comment.commentID).exists())

    def test_delete_comment_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 401)

    def test_bad_delete_comment(self):
        with patch('api.models.Comment.delete') as mock_delete:
            mock_delete.side_effect = ValidationError("Validation Error")
            response = self.client.delete(self.url, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_delete()

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from api.Models.user import CustomUser
from api.Models.post import Comment, CommentVote
from rest_framework import status

class TestCommentsVotesReturnView(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username='user1',
            password='password1',
            email='user1@mail.com',
            displayName='User One'
        )
        self.user2 = CustomUser.objects.create_user(
            username='user2',
            password='password2',
            email='user2@mail.com',
            displayName='User Two'
        )
        self.post = Post.objects.create(user=self.user1, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user1, commentContent="Test comment.")
        CommentVote.objects.create(comment=self.comment, user=self.user1, vote=True)
        CommentVote.objects.create(comment=self.comment, user=self.user2, vote=False)

        self.url = reverse('get-total-comment-votes', kwargs={'pk': self.comment.commentID})

    def test_get_comment_votes(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.assertEqual(response.data[0]['user'], self.user1.id)
        self.assertEqual(response.data[0]['vote'], True)
        self.assertEqual(response.data[1]['user'], self.user2.id)
        self.assertEqual(response.data[1]['vote'], False)

    def test_get_comment_votes_no_votes(self):
        new_comment = Comment.objects.create(
            post=self.post,
            user=self.user1,
            commentContent="This comment has no votes."
        )
        url = reverse('get-total-comment-votes', kwargs={'pk': new_comment.commentID})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

class TestCommentUpdate(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(user=self.user, title="Test Post")
        self.comment = Comment.objects.create(post=self.post, user=self.user, commentContent="Test Comment")
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.url = reverse('edit-comment', kwargs={'pk': self.comment.commentID})

    def test_update_comment(self):
        data = {'commentContent': 'Updated comment content'}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['commentContent'], 'Updated comment content')

    def test_update_comment_unauthenticated(self):
        self.client.credentials()  # Clear authentication
        data = {'commentContent': 'Updated comment content'}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, 401)

    def test_bad_update_comment(self):
        with patch('api.models.Comment.save') as mock_save:
            mock_save.side_effect = ValidationError("Validation Error")
            response = self.client.patch(self.url, format='multipart')
            self.assertEqual(response.status_code, 400)
            with self.assertRaisesMessage(ValidationError, 'Validation Error'):
                mock_save()

class TestCommentRepliesReturnView(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='testPassword',
            email='user@mail.com',
            displayName='DisplayUser'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            description='A test post description'
        )
        self.parent_comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            commentContent='Parent comment'
        )
        self.reply1 = Comment.objects.create(
            user=self.user,
            post=self.post,
            commentContent='First reply',
            replyTo=self.parent_comment
        )
        self.reply2 = Comment.objects.create(
            user=self.user,
            post=self.post,
            commentContent='Second reply',
            replyTo=self.parent_comment
        )

        self.url = reverse('get-total-replies', kwargs={'pk': self.parent_comment.commentID})

    def test_get_comment_replies(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Expect 2 replies
        self.assertEqual(response.data[0]['commentContent'], 'First reply')
        self.assertEqual(response.data[1]['commentContent'], 'Second reply')

    def test_get_comment_replies_no_replies(self):
        new_comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            commentContent='Standalone comment'
        )
        url = reverse('get-total-replies', kwargs={'pk': new_comment.commentID})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)  # No replies
