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
from rest_framework.decorators import api_view, permission_classes
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
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import JSONParser
from rest_framework.filters import SearchFilter
from datetime import datetime
from django.http import Http404
from rest_framework.exceptions import AuthenticationFailed, NotFound
import jwt
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.dateparse import parse_datetime


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
                        'id': user.id,
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



@api_view(['GET', 'PUT'])
def update_profile(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    if request.method == 'PUT':
        data = request.data
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'User profile updated', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"detail": "Method not allowed."}, status=405)
    



class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('order')
    serializer_class = ServiceSerializer

    @action(detail=False, methods=['post'])
    def update_order(self, request):
        try:
            order = request.data.get('order', [])
            for index, service_id in enumerate(order):
                service = Service.objects.get(id=service_id)
                service.order = index
                service.save()
            return Response({'status': 'success', 'message': 'Order updated successfully!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




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
        print(html_message)
        plain_message = strip_tags(html_message)
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [subscriber.email for subscriber in subscribers]
        print(recipient_list)

        send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
    


User = get_user_model()

class BlogBackofficeViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    pagination_class = None

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            serializer.save(author=user)
        else:
            raise ValidationError('User must be authenticated')

                            
    def perform_update(self, serializer):
        request = self.request
        if request.user.is_authenticated: 
            serializer.save(author=request.user)
        else:
            
            default_user = User.objects.filter(username='Sleima').first()
            if default_user:
                serializer.save(author=default_user)
            else:
                serializer.save()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
        })
        return context
 



@api_view(['POST'])
def add_blog(request):
    serializer = BlogSerializer(data=request.data)
    if serializer.is_valid():
        blog = serializer.save()
        send_newsletter(blog)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        send_newsletter(None)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def add_blog_for_writer(request):
    data = request.data.copy()
    user_id = data.get('author_id')
    
    if user_id:
        data['author'] = user_id
    else:
        return Response({"error": "Missing author ID"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = BlogSerializer(data=data)
    if serializer.is_valid():
        blog = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




def send_newsletter(blog):
    subscribers = NewsletterSubscriber.objects.all()
    from_email = 'hotelroyella@gmail.com'
    recipient_list = [subscriber.email for subscriber in subscribers]

    if blog:
        subject = 'New Blog Post: ' + blog.title
        html_message = render_to_string('newsletter_email.html', {'blog': blog})
        plain_message = strip_tags(html_message)
    else:
        subject = "New Blog Attempted!"
        html_message = "A new blog was attempted. Check it out!"
        plain_message = strip_tags(html_message)

    send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]



class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]




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
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        author_id = self.request.data.get('author')
        blog_id = self.request.data.get('blog')
        if author_id and blog_id:
            author = User.objects.get(id=author_id)
            blog = Blog.objects.get(id=blog_id)
            serializer.save(author=author, blog=blog)
        else:
            raise serializers.ValidationError({"author": "Author and Blog are required."})






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
    parser_classes = (MultiPartParser, FormParser, JSONParser) 
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description', 'beds']


    @action(detail=False, methods=['get'])
    def available(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        adults = request.query_params.get('adults')
        children = request.query_params.get('children')
        beds = request.query_params.get('beds')

        rooms = Room.objects.filter(available=True)
        
        if beds:
            rooms = rooms.filter(beds__icontains=beds)

        bookings = Booking.objects.filter(
            start_date__lt=end_date,
            end_date__gt=start_date
        )
        
        booked_rooms = bookings.values_list('room_id', flat=True)
        available_rooms = rooms.exclude(id__in=booked_rooms)

        page = self.paginate_queryset(available_rooms)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(available_rooms, many=True)
        return Response(serializer.data)
        
    def perform_create(self, serializer):
        room = serializer.save()
        logger.info(f'Room created: {room}')
        self.update_hotel_info()


    def perform_update(self, serializer):
        if serializer.is_valid():
            room = serializer.save()
            logger.info(f'Room updated: {room}')
            self.update_hotel_info()
        else:
            logger.error(serializer.errors)


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
    
    @action(detail=False, methods=['get'], pagination_class=None)  
    def all_rooms(self, request):
        rooms = Room.objects.all().order_by('id')
        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)


    

logger = logging.getLogger(__name__)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    




@api_view(['POST'])
def create_booking(request):
    user_id = request.data.get('user')
    room_id = request.data.get('room')
    start_date_str = request.data.get('start_date')
    end_date_str = request.data.get('end_date')

    start_date = parse_datetime(start_date_str).date() if start_date_str else None
    end_date = parse_datetime(end_date_str).date() if end_date_str else None

    if not start_date or not end_date:
        return Response({'error': 'Invalid dates provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    if user.role.upper() != 'UTILISATEUR':
        return Response({'error': 'Only users can make bookings.'}, status=status.HTTP_403_FORBIDDEN)

    if not user.credit_card_info:
        return Response({'error': 'Credit card not registered.'}, status=status.HTTP_403_FORBIDDEN)

    overlapping_bookings = Booking.objects.filter(
        room_id=room_id,
        start_date__lte=end_date,
        end_date__gte=start_date
    ).exists()

    if overlapping_bookings:
        return Response({'error': 'Room is not available for the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)

    booking = Booking.objects.create(
        user=user,
        room_id=room_id,
        start_date=start_date,
        end_date=end_date,
        status='PENDING'  
    )

    return Response({'message': 'Booking successful, pending confirmation.', 'booking_id': booking.id}, status=status.HTTP_201_CREATED)


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



class GetInTouchSubjectViewSet(viewsets.ModelViewSet):
    queryset = GetInTouchSubject.objects.all()
    serializer_class = GetInTouchSubjectSerializer
    http_method_names = ['get']



class GetInTouchViewSet(viewsets.ModelViewSet):
    queryset = GetInTouch.objects.all()
    serializer_class = GetInTouchSerializer
    http_method_names = ['post', 'get']

    def perform_create(self, serializer):
        message = serializer.save()
        self.send_contact_email(message)

    def send_contact_email(self, message):
        subject = f"New Contact Message from {message.name}"
        if message.subject:
            subject += f" - {message.subject.subject}"
        else:
            subject += f" - {message.other_subject}"
        message_body = f"""
        You have received a new contact message:

        Name: {message.name}
        Email: {message.email}
        Subject: {message.subject.subject if message.subject else message.other_subject}
        Message: {message.message}
        """
        send_mail(
            subject,
            message_body,
            settings.EMAIL_HOST_USER,  
            ['hotelroyella@gmail.com'],
            fail_silently=False,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
