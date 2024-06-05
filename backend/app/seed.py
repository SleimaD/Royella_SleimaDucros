from django_seed import Seed
from .models import *


#!manager 
manager_entries = [
    {
        'name': 'John D. Alexon',
        'title': 'LUXURY BEST HOTEL IN CITY CALIFORNIA, USA',
        'subtitle': 'MANAGER', 
        'bio': 'Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures after main Holisticly facilitate stand-alone inframe',
        'image': 'managers/manager.jpg',
        'quote': 'Model. Appropriately create interactive infrastructures after main Holisticly facilitate stand-alone inframe of the world',
        'video_url': 'https://cdn.pixabay.com/video/2016/05/12/3190-166339081_large.mp4'
    }
] 

 
def runManager():
    seeder = Seed.seeder()
    for i in manager_entries:
        seeder.add_entity(Manager, 1, {
            'name': i['name'], 
            'title': i['title'],
            'subtitle': i['subtitle'],
            'bio': i['bio'],
            'image': i['image'],
            'quote': i['quote'],
            'video_url': i['video_url'],
        })
    pks = seeder.execute()
    print(pks) 


facility_entries = [
    {
        'name': 'Room Services',
        'icon': 'facilities/icon-bed.jpg',
        'image': 'facilities/room.jpg',
    },
    {
        'name': 'Wi-Fi Internet',
        'icon': 'facilities/icon-wifi.jpg',
        'image': 'facilities/wifi.jpg',
    },
    {
        'name': 'Smart Key',
        'icon': 'facilities/icon-key.jpg',
        'image': 'facilities/smartkey.jpg',
    },
    {
        'name': 'Breakfast',
        'icon': 'facilities/icon-breakfast.jpg',
        'image': 'facilities/breakfast.jpg',
    },
    {
        'name': 'Swimming Pool',
        'icon': 'facilities/icon-swim.jpg',
        'image': 'facilities/pool.jpg',
    },
    {
        'name': 'Gym',
        'icon': 'facilities/icon-gym.jpg',
        'image': 'facilities/gym.jpg',
    }
]


def runFacility():
    seeder = Seed.seeder()
    for i in facility_entries:
        seeder.add_entity(Facility, 1, {
            'name': i['name'], 
            'icon': i['icon'],
            'image': i['image'],
        })
    pks = seeder.execute()
    print(pks)



def run_payment_plans():
    seeder = Seed.seeder()

    features_data = [
        'Bed and floor Cleaning',
        'Daily Towel Replacement',
        'Priority Service from Reception',
        'Complimentary Breakfast',
        'Private Jacuzzi Setup',
        'Exclusive Gym Access',
        'Unlimited Room Service',
        "24/7 Housekeeping Support",
        "In-Room Newspaper Delivery",
        "Upgraded Amenities",
        "Ice Delivery",
        "Unlimited Housekeeping",
        "Luxury Bath Amenities",
        "Personalized Service",
        "Daily Fresh Flowers",
        "In-room dining experiences"
    ]
    features = []
    for feature in features_data:
        feat, created = Feature.objects.get_or_create(description=feature)
        features.append(feat)

    payment_plan_entries = [
        {
            'name': 'Basic Plan',
            'price': 12.00,
            'image': 'plans/basic.png',
            'features': ['Bed and floor Cleaning', 'Daily Towel Replacement', 'Priority Service from Reception', "24/7 Housekeeping Support"]
        },
        {
            'name': 'Premium Plan',
            'price': 23.00,
            'image': 'plans/premium.png',
            'features': ['Upgraded Amenities', "Ice Delivery", "Unlimited Room Service", "In-Room Newspaper Delivery" ]
        },
        {
            'name': 'Luxury Plan',
            'price': 120.00,
            'image': 'plans/luxury.png',
            'features': ['Luxury Bath Amenities', 'Private Jacuzzi Setup',"In-room dining experiences", "Unlimited Housekeeping"]
        }
    ]

    for plan_data in payment_plan_entries:
        plan = PaymentPlan.objects.create(
            name=plan_data['name'],
            price=plan_data['price'],
            image=plan_data['image']
        )
        plan_features = Feature.objects.filter(description__in=plan_data['features'])
        plan.features.set(plan_features)


