from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout, get_user_model
from .models import *
from .serializers import *
import json
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from .permissions import *
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import action
import logging
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, filters
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError
from django.db.models import Q
import random
from django.db.models import Avg


logger = logging.getLogger(__name__)

import os
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()




def index(request):
    return render(request, 'registration_email.html')

def newssubscriber(request):
    return render(request, 'newsletter_email.html')


class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer        



class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer





class UserCreateView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            subject = 'Bienvenue !'
            html_message = render_to_string('registration_email.html', {'user': user})
            plain_message = strip_tags(html_message)
            from_email = settings.EMAIL_HOST_USER
            to = user.email

            try:
                os.environ['SSL_CERT_FILE'] = certifi.where() 
                email = EmailMessage(subject, html_message, from_email, [to])
                email.content_subtype = 'html'  
                email.send()
                return Response({'status': 'success', 'message': 'Utilisateur créé avec succès'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f'Error sending email: {e}')
                return Response({'status': 'error', 'message': 'Utilisateur créé mais l\'email n\'a pas pu être envoyé'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(email=email)
            if check_password(password, user.password):
               
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {
                        'role': user.role,
                        'username': user.username,
                        'email': user.email,
                    }
                }, status=status.HTTP_200_OK)
            else:
               
                return Response({'error': 'Identifiants invalides'}, status=status.HTTP_400_BAD_REQUEST)
        except UserModel.DoesNotExist:
           
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class PaymentPlanViewSet(viewsets.ModelViewSet):
    queryset = PaymentPlan.objects.all()
    serializer_class = PaymentPlanSerializer

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer



User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwner]

    @action(detail=True, methods=['patch'])
    def update_role(self, request, pk=None):
        try:
            user = self.get_object()
            logger.debug(f"Updating role for user {user.id}")
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Exception occurred: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    @action(detail=True, methods=['patch'], url_path='profile-update')
    def update_profile(self, request, pk=None):
        try:
            user = self.get_object()
            logger.debug(f"Request user: {request.user.username}, Target user: {user.username}")
            if user!= request.user:
                logger.warning(f"User {request.user.username} tried to update profile of {user.username}")
                return Response({"detail": "Not allowed to update another user's profile"}, status=403)

            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=400)
        except Exception as e:
            logger.error(f"Exception occurred: {str(e)}")
            return Response({"detail": str(e)}, status=500)



class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('order')
    serializer_class = ServiceSerializer


class ServiceDetailViewSet(viewsets.ModelViewSet):
    queryset = ServiceDetail.objects.all()
    serializer_class = ServiceDetailSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def perform_create(self, serializer):
        serializer.save()
        self.update_hotel_info()

    def perform_update(self, serializer):
        serializer.save()
        self.update_hotel_info()

    def perform_destroy(self, instance):
        instance.delete()
        self.update_hotel_info()

    def update_hotel_info(self):
        total_rooms = Room.objects.count()
        room_avg_rating = Room.objects.aggregate(Avg('stars'))['stars__avg'] or 0
        testimonial_avg_rating = Testimonial.objects.aggregate(Avg('rating'))['rating__avg'] or 0

        overall_rating = (room_avg_rating + testimonial_avg_rating) / 2 if total_rooms > 0 else 0

        hotel_info, created = Hotel.objects.get_or_create(id=1)
        hotel_info.room_count = total_rooms
        hotel_info.customer_rating = overall_rating
        hotel_info.save()




class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsRedacteurUser | IsWebmasterUser | IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsWebmasterUser | IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest_blogs = Blog.objects.order_by('-posted_on')[:3]
        serializer = self.get_serializer(latest_blogs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='popular')
    def get_popular_posts(self, request):
        blogs = Blog.objects.annotate(comment_count=Count('comments')).order_by('-comment_count')[:3]
        serializer = self.get_serializer(blogs, many=True)
        return Response(serializer.data)
    
    def send_newsletter(self, blog):
        subscribers = NewsletterSubscriber.objects.all()
        subject = 'New Blog Post: ' + blog.title
        html_message = render_to_string('newsletter_email.html', {'blog': blog})
        plain_message = strip_tags(html_message)
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [subscriber.email for subscriber in subscribers]

        send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)




class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all()
        blog_id = self.request.query_params.get('blog', None)
        if blog_id is not None:
            queryset = queryset.filter(blog=blog_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsRegisteredUser | IsRedacteurUser | IsWebmasterUser | IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsWebmasterUser | IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            "request": self.request,
        })
        return context


class BlogDescriptionViewSet(viewsets.ModelViewSet):
    queryset = BlogDescription.objects.all()
    serializer_class = BlogDescriptionSerializer

    def get_queryset(self):
        queryset = BlogDescription.objects.all()
        blog_id = self.request.query_params.get('blog', None)
        if blog_id is not None:
            queryset = queryset.filter(blog_id=blog_id)
        return queryset








class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by('id')
    serializer_class = RoomSerializer
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['get'])
    def available(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        adults = int(request.query_params.get('adults', 0))
        children = int(request.query_params.get('children', 0))

        if not start_date or not end_date:
            return Response({'error': 'Please provide both start_date and end_date'}, status=status.HTTP_400_BAD_REQUEST)

        guest_count = adults + children

        rooms = Room.objects.filter(
            Q(booking__start_date__gt=end_date) | Q(booking__end_date__lt=start_date) | Q(booking__isnull=True),
            max_guests__gte=guest_count
        ).distinct()

        logger.info(f"Filtered rooms: {rooms.count()} found for the date range {start_date} to {end_date} for {guest_count} guests.")

        page = self.paginate_queryset(rooms)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            logger.info(f"Paginated response: {response.data}")
            return response

        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        room = serializer.save()
        logger.info(f'Room created: {room}')
        self.update_hotel_info()

    def perform_update(self, serializer):
        room = serializer.save()
        logger.info(f'Room updated: {room}')
        self.update_hotel_info()

    def perform_destroy(self, instance):
        instance.delete()
        logger.info(f'Room deleted: {instance}')
        self.update_hotel_info()

    def update_hotel_info(self):
        total_rooms = Room.objects.count()
        room_avg_rating = Room.objects.aggregate(Avg('stars'))['stars__avg'] or 0
        testimonial_avg_rating = Testimonial.objects.aggregate(Avg('rating'))['rating__avg'] or 0

        overall_rating = (room_avg_rating + testimonial_avg_rating) / 2 if total_rooms > 0 else 0

        logger.info(f'Total rooms: {total_rooms}, Room avg rating: {room_avg_rating}, Testimonial avg rating: {testimonial_avg_rating}, Overall rating: {overall_rating}')

        hotel_info, created = Hotel.objects.get_or_create(id=1)
        hotel_info.room_count = total_rooms
        hotel_info.customer_rating = overall_rating
        hotel_info.save()
        logger.info(f'Updated Hotel Info: Rooms: {hotel_info.room_count}, Rating: {hotel_info.customer_rating}')    



class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        if not request.user.credit_card_info:
            return Response({'error': 'No credit card information provided.'}, status=status.HTTP_400_BAD_REQUEST)
            

        room_id = request.data.get('room')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        guest_count = request.data.get('guest_count')

        room = Room.objects.get(id=room_id)
        if room.available == False:
            return Response({'error': 'Room is not available.'}, status=status.HTTP_400_BAD_REQUEST)

        overlapping_bookings = Booking.objects.filter(
            room=room,
            start_date__lt=end_date,
            end_date__gt=start_date
        )

        if overlapping_bookings.exists():
            return Response({'error': 'Room is already booked for the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(
            user=request.user,
            room=room,
            start_date=start_date,
            end_date=end_date,
            guest_count=guest_count,
            status='PENDING',
            room_details=request.data.get('room_details', {})
        )
        return Response(self.get_serializer(booking).data, status=status.HTTP_201_CREATED)
    


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.filter(is_active=True, end_date__gte=timezone.now())
    serializer_class = OfferSerializer



class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer



class HomeBannerViewSet(viewsets.ModelViewSet):
    queryset = HomeBanner.objects.all().order_by('order')
    serializer_class = HomeBannerSerializer



class PageBannerViewSet(viewsets.ModelViewSet):
    queryset = PageBanner.objects.all()
    serializer_class = PageBannerSerializer





class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer


class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer