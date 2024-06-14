from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from django.contrib.auth.hashers import make_password


class ManagerSerializer(serializers.ModelSerializer):
    video_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    class Meta:
        model = Manager
        fields = '__all__'
    def __init__(self, *args, **kwargs):
        super(ManagerSerializer, self).__init__(*args, **kwargs)
        if 'request' in self.context and self.context['request'].method == 'PATCH':
            for field_name, field in self.fields.items():
                field.required = False

    

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'
    def __init__(self, *args, **kwargs):
        super(FacilitySerializer, self).__init__(*args, **kwargs)
        if self.instance is not None:
            for field_name in self.fields:
                field = self.fields.get(field_name)
                if field and isinstance(field, serializers.ImageField):
                    field.required = False


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=User.role_choix)
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'photo': {'required': False},
            'credit_card_info': {'required': False},
        }
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.credit_card_info = validated_data.get('credit_card_info', instance.credit_card_info)
        if 'photo' in validated_data:
            instance.photo = validated_data['photo']
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        # fields = '__all__'
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'photo', 'role']
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    

    


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'




class PaymentPlanSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    
    class Meta:
        model = PaymentPlan
        fields = ['id', 'name', 'price', 'image', 'features']




class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"



User = get_user_model()

class UserAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'is_active', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=validated_data.get('is_active', True),  
            role=validated_data.get('role', 'UTILISATEUR')  
        )
        password = validated_data.get('password')
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

    def validate_password(self, value):
        return make_password(value)



class ServiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceDetail
        fields = '__all__'



class ServiceSerializer(serializers.ModelSerializer):
    details = ServiceDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = '__all__'



class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"



class CommentSerializer(serializers.ModelSerializer):
    # author = serializers.StringRelatedField() 
    author_photo = serializers.SerializerMethodField()
    author_name = serializers.CharField(source='author.username', read_only=True)

    
    class Meta:
        model = Comment
        fields ="__all__"

    def get_author_photo(self, obj):
        request = self.context.get('request')
        if obj.author.photo:
            photo_url = obj.author.photo.url
            return request.build_absolute_uri(photo_url)
        return None
    


class BlogDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogDescription
        fields = "__all__"



class BlogSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True)
    tags = TagSerializer(many=True)
    comments = CommentSerializer(many=True, read_only=True)
    # sections = BlogDescription(many=True)
    author = serializers.StringRelatedField()
    
    class Meta:
        model = Blog
        fields = "__all__"




class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'



class RoomDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomDescription
        fields = '__all__'


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = "__all__"

class RoomSerializer(serializers.ModelSerializer):
    descriptions = RoomDescriptionSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'



class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    room = RoomSerializer()

    class Meta:
        model = Offer
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'



class HomeBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeBanner
        fields = '__all__'



class PageBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageBanner
        fields = '__all__'



class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'



class GetInTouchSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInTouchSubject
        fields = "__all__"


class GetInTouchSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInTouch
        fields = "__all__"
