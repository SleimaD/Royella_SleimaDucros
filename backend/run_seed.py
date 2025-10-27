import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

from django.contrib.auth import get_user_model
from app.seed import (
    runManager, runFacility, run_payment_plans, run_faq,
    run_service, run_service_details, run_testimonial,
    create_categories, create_tags, create_blogs, create_comments,
    run_amenity, run_room, run_room_image, run_offers,
    runMembers, run_banners, run_hotel, run_gallery, runSubjects, run_contact,
    dedupe_all
)

def get_or_create_demo_user():
   User = get_user_model()
   user = User.objects.filter(is_active=True).first()
   if user:
      print(f"User present: {user.username}")
      return user
   user = User.objects.create_user(
      username="demo",
      email="demo@example.com",
   )
   user.first_name = "Demo"
   user.last_name = "Author"
   user.is_staff = False
   user.is_superuser = False
   user.set_unusable_password()
   user.save()
   print(" Demo user (non-superuser) créé: username=demo (password unusable)")
   return user

if __name__ == "__main__":
   runManager()
   runFacility()
   run_payment_plans()
   run_faq()
   run_service()
   run_service_details()
   run_testimonial()

   admin_user = get_or_create_demo_user()
   categories = create_categories()
   tags = create_tags()
   create_blogs(admin_user, categories, tags)
   create_comments(admin_user)
   print("✅ Blogs seeded.")

   run_amenity()
   run_room()
   run_room_image()
   run_offers()
   runMembers()
   run_banners()
   run_hotel()
   run_gallery()
   runSubjects()
   run_contact()

   dedupe_all()
   print("Seeding completed.")
