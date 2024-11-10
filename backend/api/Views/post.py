from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied

class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

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
        except ValidationError as e:
            print("Validation error:", e.detail)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
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
        if vote.user != self.request.user:
            raise PermissionDenied("You cannot delete another user's vote")
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
        if vote.user != self.request.user:
            raise PermissionDenied("You cannot update another user's vote")
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
        if post.user != self.request.user:
            raise PermissionDenied("You cannot delete another user's post")
        return post

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError(f"Error deleting post: {str(e)}")