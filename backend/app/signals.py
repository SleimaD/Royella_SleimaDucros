from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Room, Testimonial, Hotel


def _safe_float(val):
    try:
        return float(val) if val is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


@receiver([post_save, post_delete], sender=Room)
@receiver([post_save, post_delete], sender=Testimonial)
def update_hotel_and_resort_info(sender, instance, **kwargs):

    total_rooms = Room.objects.count() or 0

    room_avg_rating = _safe_float(Room.objects.aggregate(Avg('stars')).get('stars__avg'))
    testimonial_avg_rating = _safe_float(Testimonial.objects.aggregate(Avg('rating')).get('rating__avg'))

    # If there are no rooms/testimonials yet, keep a sane overall rating.
    overall_rating = (room_avg_rating + testimonial_avg_rating) / 2.0 if (room_avg_rating or testimonial_avg_rating) else 0.0
    overall_rating = max(0.0, min(5.0, overall_rating))

    # Create or update a single Hotel row (id=1) with all required fields
    hotel, created = Hotel.objects.update_or_create(
        id=1,
        defaults={
            'title': 'LUXURY BEST HOTEL IN CITY CALIFORNIA, USA',
            'subtitle': 'LUXURY HOTEL AND RESORT',
            'description': 'Rapidiously myocardinate cross-platform intellectual capital after marketing model. '
                           'Appropriately create interactive infrastructures after maintainable are Holisticly '
                           'facilitate stand-alone inframe Compellingly create premier open data through economically.',
            'image': 'hotel/hotel.jpg',
            'room_count': total_rooms,
            'customer_rating': overall_rating,
        }
    )

    print(f"{'Created' if created else 'Updated'} Hotel Info: Rooms={hotel.room_count}, Rating={hotel.customer_rating}")