from django.urls import path
#from . import views
from .Views.user import *
from .Views.friends import *
from .Views.message import *
from .Views.post import *

urlpatterns = [
    path("profile/", UserProfileRead.as_view(), name="user-profile-read"),
    path("profile/getuserdata/<str:username>/", UserDataReadByUsername.as_view(), name="user-data-read-by-username"),
    path("profile/getuserdata2/<uuid:id>/", UserDataReadByID.as_view(), name="user-data-read-by-id"),
    path("profile/edit/", UserProfileUpdate.as_view(), name="user-profile-update"),
    path("search/profile/<str:username_chunk>/", SearchProfiles.as_view(), name="profile-search"),
    path("search/profile/", SearchProfilesAll.as_view(), name="profile-search-all"),
    path("profile/message/<uuid:user_1>/<uuid:user_2>/", CheckConvo.as_view(), name="check-convo"),
    path("profile/message/setconvoparticipant/", AddConvoParticipant.as_view(), name="set-convo-participant"),
    path("profile/message/createconvo/", CreateConvo.as_view(), name="create-convo"),
    path("profile/message/send/", SendMessage.as_view(), name="send-message"),
    path("profile/message/getmessages/<int:convoID>/", GetMessages.as_view(), name="get-messages"),
    path("createpost/", PostCreate.as_view(), name="create-post"),
    path("profile/posts/<uuid:user_id>/", PostListView.as_view(), name="view-post-user"),
    path("posts/new/", PostListSortNew.as_view(), name="view-post-sort-new"),
    path('friends/<uuid:user_id>/', ListFriends.as_view(), name='list-friends'),
    path('friend-request/<uuid:user2_id>/', SendFriendRequest.as_view(), name='send-friend-request'),
    path('friend-request/accept/<int:pk>/', AcceptFriendRequest.as_view(), name='accept-friend-request'),
    path('friend-requests/', ListFriendRequests.as_view(), name='list-friend-requests'),
    path('friend-status/<uuid:user_id>/', FriendStatusView.as_view(), name='friend-status'),
    path('friend/<str:username1>/<str:username2>/', RetrieveFriendshipByUsername.as_view(), name='retrieve-friendship'),
    path('friend/remove/<int:pk>/', RemoveFriend.as_view(), name='remove-friend'),
]