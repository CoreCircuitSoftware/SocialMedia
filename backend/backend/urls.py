"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.Views.user import CreatedUserView   #The view we created in the api/views file
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView    #premade views to access and refresh tokens

urlpatterns = [     #If Users go to a url directory, the corresponding actions will be performed such as loading a view
    path('admin/', admin.site.urls),
    path("api/user/register/", CreatedUserView.as_view(), name="register"), 
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),  #links urls.py from backend/api/
]
