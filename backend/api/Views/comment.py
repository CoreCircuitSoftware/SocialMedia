from rest_framework import generics
from rest_framework.response import Response
from ..Models.user import *
from ..serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.utils import timezone

class CommentCreate(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(f"Error creating comment: {str(e)}")
        
class PostCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Comment.objects.filter(post=post_id, replyTo_id=None)
    
class HandleCommentsVoteCreate(generics.CreateAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(f"Error creating comment vote: {str(e)}")

class HandleCommentVoteGet(generics.RetrieveAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        comment_id = self.kwargs['pk']
        return get_object_or_404(CommentVote, user=user, comment_id=comment_id)

class HandleCommentVoteDelete(generics.DestroyAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        comment_id = self.kwargs['pk']
        vote = get_object_or_404(CommentVote, user=user, comment_id=comment_id)
        # if vote.user != self.request.user:    #Redundant after previous line
        #     raise PermissionDenied("You cannot delete another user's vote")
        return vote
        
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError(f"Error deleting comment vote: {str(e)}")
        
class HandleCommentVoteUpdate(generics.UpdateAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        comment_id = self.kwargs['pk']
        return get_object_or_404(CommentVote, user=user, comment_id=comment_id)
    
    def perform_update(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(f"Error updating comment vote: {str(e)}")
        
class CommentDetailView(generics.RetrieveAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        comment_id = self.kwargs['pk']
        return Comment.objects.filter(commentID=comment_id)
    
class CommentPageReplies(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        comment_id = self.kwargs['pk']
        return Comment.objects.filter(replyTo=comment_id)
    
class CommentDeleteView(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        comment_id = self.kwargs['pk']
        comment = get_object_or_404(Comment, user=user, commentID=comment_id)
        # if comment.user != self.request.user: #Redundant after previous line
        #     raise PermissionDenied("You cannot delete another user's comment")
        return comment
    
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError(f"Error deleting comment: {str(e)}")
        
class CommentsVotesReturnView(generics.ListAPIView):
    serializer_class = CommentVoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        comment_id = self.kwargs['pk']
        return CommentVote.objects.filter(comment=comment_id)
    
class CommentUpdate(generics.UpdateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        comment_id = self.kwargs['pk']
        comment = get_object_or_404(Comment, user=user, commentID=comment_id)
        # if comment.user != self.request.user:
        #     raise PermissionDenied("You cannot update another user's comment")
        return comment
    
    def perform_update(self, serializer):
        try:
            serializer.save(hasEdit=True,editDate=timezone.now())
        except Exception as e:
            raise ValidationError(f"Error Updating comment: {str(e)}")
        
class CommentRepliesReturnView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        comment_id = self.kwargs['pk']
        return Comment.objects.filter(replyTo=comment_id)