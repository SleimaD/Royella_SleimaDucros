from django.contrib import admin
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import *
from django.conf import settings
from django.conf.urls.static import static
from django.views import *




router = DefaultRouter()
router.register(r'managers', ManagerViewSet)
router.register(r'facilities', FacilityViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('api/register/', UserCreateView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
 

