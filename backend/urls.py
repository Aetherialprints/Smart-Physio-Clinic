from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('api/auth/', include('accounts.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Apps
    path('api/patients/', include('patients.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/sessions/', include('treatment_sessions.urls')),
    path('api/exercises/', include('exercises.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
