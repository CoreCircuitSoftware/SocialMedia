from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("profile/", views.UserProfileRead.as_view(), name="profile-read"),
    path("profile/message/<uuid:user_1>/<uuid:user_2>/", views.CheckConvo.as_view(), name="profile-read"),
    path("profile/message/setconvoparticipant/", views.AddConvoParticipant.as_view(), name="set-convo-participant"),
    path("profile/message/createconvo/", views.CreateConvo.as_view(), name="create-convo"),
    path("profile/message/send/", views.SendMessage.as_view(), name="send-message"),
    path("profile/message/getmessages/<int:convoID>/", views.GetMessages.as_view(), name="get-messages"),
    path("profile/getuserdata/<str:username>/", views.UserDataRead.as_view(), name="profile-get-data"),
    path("profile/getuserdata2/<uuid:id>/", views.UserProfileRead2.as_view(), name="profile-get-data-uuid"),
    path("profile/edit/", views.UserProfileUpdate.as_view(), name="profile-update"),
    path("createpost/", views.PostCreate.as_view(), name="create-post"),
    path("profile/posts/<uuid:user_id>/", views.PostListView.as_view(), name="view-post-user"),
    path('friends/<uuid:user_id>/', views.ListFriends.as_view(), name='list-friends'),
    path('friend-request/<uuid:user2_id>/', views.SendFriendRequest.as_view(), name='send-friend-request'),
    path('friend-request/accept/<int:pk>/', views.AcceptFriendRequest.as_view(), name='accept-friend-request'),
    path('friend-requests/', views.ListFriendRequests.as_view(), name='list-friend-requests'),
    path('friend-status/<uuid:user_id>/', views.FriendStatusView.as_view(), name='friend-status'),
    path("search/profile/<str:username_chunk>/", views.SearchProfiles.as_view(), name="profile-search"),
    path("search/profile/", views.SearchProfilesAll.as_view(), name="profile-search-all"),
]