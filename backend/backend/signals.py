from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Room, Testimonial, Hotel
from django.db.models import Avg

@receiver([post_save, post_delete], sender=Room)
@receiver([post_save, post_delete], sender=Testimonial)
def update_hotel_and_resort_info(sender, instance, **kwargs):
    total_rooms = Room.objects.count()
    room_avg_rating = Room.objects.aggregate(Avg('stars'))['stars__avg'] or 0
    testimonial_avg_rating = Testimonial.objects.aggregate(Avg('rating'))['rating__avg'] or 0

    if total_rooms > 0:
        overall_rating = (room_avg_rating + testimonial_avg_rating) / 2
    else:
        overall_rating = 0

    hotel_info, created = Hotel.objects.get_or_create(id=1)
    hotel_info.room_count = total_rooms
    hotel_info.customer_rating = overall_rating
    hotel_info.save()
    print(f"Updated Hotel Info: Rooms: {hotel_info.room_count}, Rating: {hotel_info.customer_rating}")