from django.urls import path
#from . import views
from .Views.user import *
from .Views.friends import *
from .Views.message import *
from .Views.post import *
from .Views.comment import *
from .Views.community import *

urlpatterns = [
    path("profile/", UserProfileRead.as_view(), name="user-profile-read"),
    path("profile/getuserdata/<str:username>/", UserDataReadByUsername.as_view(), name="user-data-read-by-username"),
    path("profile/getuserdata2/<uuid:id>/", UserDataReadByID.as_view(), name="user-data-read-by-id"),
    path("profile/edit/", UserProfileUpdate.as_view(), name="user-profile-update"),
    path("profile/delete/", UserProfileDelete.as_view(), name="user-profile-delete"),
    path("search/profile/<str:username_chunk>/", SearchProfiles.as_view(), name="profile-search"),
    path("search/profile/", SearchProfilesAll.as_view(), name="profile-search-all"),
    path("profile/message/<uuid:user_1>/<uuid:user_2>/", CheckConvo.as_view(), name="check-convo"),
    path("profile/message/createconvo/", CreateConvo.as_view(), name="create-convo"),
    path("profile/message/setconvoparticipant/", AddConvoParticipant.as_view(), name="add-convo-participant"),
    path("profile/message/getmessages/<int:convoID>/", GetMessages.as_view(), name="get-messages"),
    path("profile/message/send/", SendMessage.as_view(), name="send-message"),
    path("message/findconvos/<uuid:user_id>/", FindConvoParticipants.as_view(), name="find-convo-participants"),
    path("message/latest/<int:convoID>/", LatestMessageView.as_view(), name="latest-message"),
    path("createpost/", PostCreate.as_view(), name="create-post"),
    path("posts/media/<int:post_id>/", PostMediaListView.as_view(), name="post-media-list"),
    path("profile/posts/<uuid:user_id>/", PostListView.as_view(), name="post-list"),
    path("posts/<int:pk>/", PostDetailView.as_view(), name="view-post"),  # New URL pattern for media
    path("posts/new/", PostListSortNew.as_view(), name="post-list-sort-new"),
    path("posts/community/<int:community_id>/", PostListCommView.as_view(), name="post-list-by-community"),
    path("posts/community/new/", PostListSortNewComm.as_view(), name="post-list-by-any-community"),
    path("posts/vote/new/", PostVotesCreate.as_view(), name="create-post-vote"),
    path("posts/vote/gettotal/<int:pk>/", PostVotesReturnView.as_view(), name="get-total-post-votes"),
    path("posts/vote/get/<int:pk>/", PostVotesGetView.as_view(), name="get-post-vote"),
    path("posts/vote/delete/<int:pk>/", PostVoteDeleteView.as_view(), name="delete-post-vote"),
    path("posts/vote/update/<int:pk>/", PostVotesUpdate.as_view(), name="update-post-vote"),
    path("posts/comments/gettotal/<int:pk>/", PostCommentsVotesReturnView.as_view(), name="get-total-votes-comments"),
    path("posts/delete/<int:pk>/", PostDeleteView.as_view(), name="delete-post"),
    path("posts/edit/<int:pk>/", PostUpdate.as_view(), name="edit-post"),
    path("comment/submit/", CommentCreate.as_view(), name="submit-comment"),
    path("comment/get/from-post/<int:pk>/", PostCommentsView.as_view(), name="get-comments-post"),
    path("comment/vote/new/", HandleCommentsVoteCreate.as_view(), name="handle-comment-vote"),
    path("comment/vote/get/<int:pk>/", HandleCommentVoteGet.as_view(), name="handle-comment-vote-get"),
    path("comment/vote/delete/<int:pk>/", HandleCommentVoteDelete.as_view(), name="handle-comment-vote-delete"),
    path("comment/vote/update/<int:pk>/", HandleCommentVoteUpdate.as_view(), name="handle-comment-vote-update"),
    path("comment/<int:pk>/", CommentDetailView.as_view(), name="comment-detail-view"),
    path("comment/get/replies/<int:pk>/", CommentPageReplies.as_view(), name="get-comments-replies"),
    path("comment/delete/<int:pk>/", CommentDeleteView.as_view(), name="delete-comment"),
    path("comment/vote/gettotal/<int:pk>/", CommentsVotesReturnView.as_view(), name="get-total-comment-votes"),
    path("comment/edit/<int:pk>/", CommentUpdate.as_view(), name="edit-comment"),
    path("comment/replies/gettotal/<int:pk>/", CommentRepliesReturnView.as_view(), name="get-total-replies"),
    path('friends/<uuid:user_id>/', ListFriends.as_view(), name='list-friends'),
    path('friend-request/<uuid:user2_id>/', SendFriendRequest.as_view(), name='send-friend-request'),
    path('friend-request/accept/<int:pk>/', AcceptFriendRequest.as_view(), name='accept-friend-request'),
    path('friend-requests/', ListFriendRequests.as_view(), name='list-friend-requests'),
    path('friend-status/<uuid:user_id>/', FriendStatusView.as_view(), name='friend-status'),
    path('friend/<str:username1>/<str:username2>/', RetrieveFriendshipByUsername.as_view(), name='retrieve-friendship-by-username'),
    path('friends/remove/<int:pk>/', DeleteFriendship.as_view(), name='delete-friendship'), 
    path('community/', CommunityView.as_view(), name='community-View' ),
    path('community/getdata/<str:name>/', CommunityReadByNameView.as_view(), name='Community-ReadBy-Name' ),
    path('community/getdataid/<int:communityID>/', CommunityReadByID.as_view(), name='Community-ReadBy-Name' ),
    path('communitymember/<str:user_id>/', CommunityMemberByUser.as_view(), name='Communitymember-ReadBy-userid' ),
    path("search/community/", CommunityMemberAll.as_view(), name="Community-search-all"),
    path("communityjoin/<int:communityID>/", CommunityMemberJoin.as_view(), name ="Community-Join"),
    path("leave-community/<int:communityID>/", LeaveCommunity.as_view(), name="leave-community"),
    path("check-membership/<int:communityID>/", CheckCommunityMembership.as_view(), name="check-community-membership")


    
        
]