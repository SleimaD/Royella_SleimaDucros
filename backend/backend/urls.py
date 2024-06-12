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
router.register(r'paymentplans', PaymentPlanViewSet)
router.register(r'features', FeatureViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'users', UserViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'service_details', ServiceDetailViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'blogs', BlogViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'descriptions', BlogDescriptionViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'offers', OfferViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('api/register/', UserCreateView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
 
