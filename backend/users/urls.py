from django.urls import path
from .views import UserDetailView, ClaimSunPointView, register_user, whoami, sun_point_status

urlpatterns = [
    path('me/', UserDetailView.as_view(), name='user-detail'),
    path('claim-sun-point/', ClaimSunPointView.as_view(), name='claim-sun-point'),
    path('sun-point-status/', sun_point_status),
    path('signup/', register_user),
    path('profile/', whoami),
]