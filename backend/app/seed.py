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



#!facility
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




#!paymentplan
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




#! faq
faq_entries = [
    {
        'question': "How can I book a room ?",
        'answer': "You can book a room directly through our website or by contacting our reservations department."
    },
    {
        'question': "What dining options are available ?",
        'answer': "The hotel features several award-winning restaurants offering a variety of cuisines. We also offer 24-hour room service."
    },
    {
        'question': "What is the hotel's cancellation policy ?",
        'answer': "Our cancellation policy varies depending on the rate you booked. Please refer to your reservation confirmation email for specific details. In general, most cancellations must be made at least 24 hours prior to your arrival to avoid a penalty."
    },
    {
        'question': "What is the check-in and check-out time?",
        'answer': "Check-in is at 3 PM, and check-out is at 12 PM. Early check-in and late check-out can be arranged subject to availability."
    },
    {
        'question': "Does the hotel offer luggage storage ?",
        'answer': "Yes, we offer complimentary luggage storage for guests before check-in and after check-out. "
    },
    {
        'question': "Does the hotel offer airport transportation ?",
        'answer': "Yes, we offer airport transportation for a fee. Please contact the concierge to arrange your transportation."
    },
    {
        'question': "Is there a currency exchange service at the hotel ?",
        'answer': "Yes, we offer currency exchange services at the front desk. Please note that there may be a fee for this service."
    },
    {
        'question': "Do you allow pets ?",
        'answer': "Yes, our hotel is pet-friendly. Please contact us for more information about our pet policy."
    }
]

def run_faq():
    seeder = Seed.seeder()
    for entry in faq_entries:
        seeder.add_entity(FAQ, 1, {
            'question': entry['question'],
            'answer': entry['answer']
        })
    pks = seeder.execute()
    print(pks)
