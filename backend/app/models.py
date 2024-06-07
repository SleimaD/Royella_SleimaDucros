from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField 




class User(AbstractUser):
    role_choix = [
        ('UTILISATEUR', 'Utilisateur'),
        ('RECEPTIONIST', 'Receptionist'),
        ('REDACTEUR', 'Redacteur'),
        ('WEBMASTER', 'Webmaster'),
        ('ADMIN', 'Admin'),
    ]
    role = models.CharField(max_length=12, choices=role_choix, default='Utilisateur')
    photo = models.ImageField(upload_to='users/', default='users/avatar.jpg', null=True, blank=True)
    credit_card_info = models.CharField(max_length=255, blank=True, null=True)



# class Amenity(models.Model):
#     name = models.CharField(max_length=100)
#     icon = models.ImageField(upload_to='amenities/', blank=True)  


# class Room(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     price = models.DecimalField(max_digits=6, decimal_places=2)
#     image = models.ImageField(upload_to='rooms/')
#     available = models.BooleanField(default=True)    
#     max_guests = models.IntegerField(default=2)
#     amenities = models.ManyToManyField(Amenity, related_name='rooms')


  
# class Booking(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     room = models.ForeignKey(Room, on_delete=models.CASCADE)
#     room_nbr = models.IntegerField()   
#     start_date = models.DateField()
#     end_date = models.DateField()
#     guest_count = models.IntegerField()
#     status = models.CharField(max_length=10, choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('CANCELLED', 'Cancelled')]) 
#     room_details = JSONField(default=dict)
#     booking_group = models.CharField(max_length=100, blank=True, null=True) #? dans le cas où je veux grouper les reservations



# class Review(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     room = models.ForeignKey(Room, on_delete=models.CASCADE)
#     rating = models.IntegerField()
#     comment = models.TextField()
#     date_posted = models.DateTimeField(auto_now_add=True)


# class Blog(models.Model):
#     title = models.CharField(max_length=200)
#     content = models.TextField()
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     posted_on = models.DateTimeField(auto_now_add=True)
#     categories = models.ManyToManyField('Category')
#     tags = models.ManyToManyField('Tag')


# class Category(models.Model):
#     name = models.CharField(max_length=100) 

# class Tag(models.Model):
#     name = models.CharField(max_length=100)


class PaymentPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='payment_plans/')
    features = models.ManyToManyField('Feature', related_name='payment_plans')

class Feature(models.Model):
    description = models.CharField(max_length=255)

# class BannerHome(models.Model): 
#     title = models.CharField(max_length=100)
#     image = models.ImageField(upload_to='banners/')


# class Banner(models.Model):  
#     title = models.CharField(max_length=100)
#     image = models.ImageField(upload_to='banners/')
    


class Facility(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='facilities/', blank=True)
    image = models.ImageField(upload_to='facilities/')

 

class Manager(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='managers/')
    quote = models.TextField(blank=True, null=True) 
    video_url = models.URLField(blank=True, null=True)



# class Offer(models.Model):
#     title = models.CharField(max_length=200)
#     description = models.TextField()
#     valid_from = models.DateField()
#     valid_to = models.DateField()
#     discount = models.FloatField()



class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    feedback = models.TextField()
    rating = models.IntegerField()
    image = models.ImageField(upload_to='testimonials/')
    location = models.CharField(max_length=100, blank=True, null=True)

# class ContactInfo(models.Model):
#     phone = models.CharField(max_length=20)
#     email = models.EmailField()
#     address = models.CharField(max_length=255)
#     latitude = models.FloatField(blank=True, null=True)
#     longitude = models.FloatField(blank=True, null=True)


# class SocialMedia(models.Model):
#     name = models.CharField(max_length=100)
#     url = models.URLField()


# class Hotel(models.Model):
#     title = models.CharField(max_length=100)
#     subtitle = models.CharField(max_length=100)
#     description = models.TextField()
#     image = models.ImageField(upload_to='images/')
#     total_rooms = models.IntegerField()
#     rating = models.FloatField()


# class Member(models.Model):
#     name = models.CharField(max_length=100)
#     role = models.CharField(max_length=100)
#     bio = models.TextField()
#     image = models.ImageField(upload_to='members/')


# class Feedback(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     content = models.TextField()
#     response = models.TextField(blank=True)


class FAQ(models.Model):
    question = models.CharField(max_length=255) 
    answer = models.TextField()


# class Comment(models.Model):
#     blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)




# class Gallery(models.Model):
#     image = models.ImageField(upload_to='gallery/')


# class GoogleMaps(models.Model):
#     address = models.CharField(max_length=255)
#     latitude = models.FloatField(blank=True, null=True)
#     longitude = models.FloatField(blank=True, null=True)


# class Subscriber(models.Model):
#     email = models.EmailField(unique=True)
#     subscribed_on = models.DateTimeField(auto_now_add=True)


# class ContactMessage(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     subject = models.CharField(max_length=150)
#     message = models.TextField()
#     sent_on = models.DateTimeField(auto_now_add=True)


class Service(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='services/')
    order = models.IntegerField(default=0)


class ServiceDetail(models.Model):
    service = models.ForeignKey(Service, related_name='details', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
