from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.utils import timezone

class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
            post = serializer.save(user=self.request.user, hasMedia=True)
            media_files = self.request.FILES.getlist('media')
            try:
                for media_file in media_files:
                    media_instance = Media.objects.create(post=post, image=media_file, mediaType=0)
                    media_instance.mediaURL = media_instance.image.url
                    media_instance.save()
            except Exception as e:
                raise ValidationError(f"Error saving media file: {e}")

class PostMediaListView(generics.ListAPIView):
    serializer_class = MediaSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']  # Extract post_id from the URL
        return Media.objects.filter(post_id=post_id)

class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user__id=user_id)
    
class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Post.objects.filter(postID=post_id)
    
class PostListSortNew(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Post.objects.all()
    
class PostVotesCreate(generics.CreateAPIView):
    serializer_class = PostVoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(f"Error creating vote: {str(e)}")
    
class PostVotesReturnView(generics.ListAPIView):
    serializer_class = PostVoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return PostVote.objects.filter(post=post_id)
    
class PostVotesGetView(generics.RetrieveAPIView):
    serializer_class = PostVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs['pk']
        return get_object_or_404(PostVote, user=user, post_id=post_id)
    
class PostVoteDeleteView(generics.DestroyAPIView):
    serializer_class = PostVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs['pk']
        vote = get_object_or_404(PostVote, user=user, post_id=post_id)
        # if vote.user != self.request.user:
        #     raise PermissionDenied("You cannot delete another user's vote")
        return vote

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError(f"Error deleting vote: {str(e)}")
        
class PostVotesUpdate(generics.UpdateAPIView):
    serializer_class = PostVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs['pk']
        vote = get_object_or_404(PostVote, user=user, post_id=post_id)
        # if vote.user != self.request.user:
        #     raise PermissionDenied("You cannot update another user's vote")
        return vote

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise ValidationError(f"Error updating vote: {str(e)}")

class PostCommentsVotesReturnView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Comment.objects.filter(post=post_id)
    
class PostDeleteView(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs['pk']
        post = get_object_or_404(Post, user=user, postID=post_id)
        # if post.user != self.request.user:    #This is redundant after previous line
        #     raise PermissionDenied("You cannot delete another user's post")
        return post

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError(f"Error deleting post: {str(e)}")
        
class PostUpdate(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs['pk']
        post = get_object_or_404(Post, user=user, postID=post_id)
        # if post.user != self.request.user:    #This is redundant after the previous line
        #     raise PermissionDenied("You cannot update another user's post")
        return post

    def perform_update(self, serializer):
        try:
            serializer.save(hasEdit=True,editDate=timezone.now())
        except Exception as e:
            raise ValidationError(f"Error updating post: {str(e)}")