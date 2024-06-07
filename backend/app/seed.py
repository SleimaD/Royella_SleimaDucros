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


#!service
service_entries = [
    {
        'title': "Gym Training Grounds",
        'subtitle': "Fitness",
        'description': "The Gym Training Grounds is a modern and fully equipped space dedicated to physical training and well-being. Whether you are a seasoned athlete or a beginner looking to improve your fitness, our gym is designed to meet all your fitness needs.",
        'image': 'services/gym.jpg',
        'order': 1
    },
    {
        'title': "Swimming Pool",
        'subtitle': "Fitness",
        'description': "Our Indoor Swimming Pool offers a serene and luxurious environment for swimmers of all levels. Whether you're looking to unwind with a leisurely swim or engage in a vigorous workout, our pool is the perfect place to enhance your physical and mental well-being.",
        'image': 'services/pool.jpg',
        'order': 2
    },
    {
        'title': "The Restaurant Center",
        'subtitle': "Foods",
        'description': "Welcome to The Restaurant Center, where culinary excellence meets a warm and inviting atmosphere. Our restaurant offers a diverse menu crafted by our talented chefs, featuring both local and international cuisines to delight your taste buds. Whether you're here for a casual meal, a special occasion, or a business gathering, The Restaurant Center promises an exceptional dining experience.",
        'image': 'services/restaurant.jpg',
        'order': 3
    },
    {
        'title': "Breakfast",
        'subtitle': "Foods",
        'description': "Start your day with a delightful breakfast experience at our establishment. We offer a wide range of breakfast options that cater to various tastes and dietary preferences, ensuring that you have a nutritious and satisfying start to your day. Whether you prefer a light continental breakfast or a hearty traditional meal, our breakfast menu has something for everyone.",
        'image': 'services/breakfast.jpg',
        'order': 4
    },


]

def run_service():
    seeder = Seed.seeder()
    for entry in service_entries:
        seeder.add_entity(Service, 1, {
            'title': entry['title'],
            'subtitle': entry['subtitle'],
            'description': entry['description'],
            'image': entry['image'],
            'order': entry['order']
        })
    pks = seeder.execute()
    print(pks)


#!service detail

gym_service = Service.objects.get(title="Gym Training Grounds")
pool_service = Service.objects.get(title="Swimming Pool")
restaurant_service = Service.objects.get(title="The Restaurant Center")
breakfast_service = Service.objects.get(title="Breakfast")

service_detail_entries = [
    {
        'service': gym_service,
        'title': "Equipment",
        'description': "Our gym is equipped with state-of-the-art facilities including cardio machines, free weights, and a variety of fitness classes. Personal trainers are available for customized workout plans."
    },
    {
        'service': pool_service,
        'title': "Options",
        'description': "Enjoy a refreshing swim in our temperature-controlled indoor pool. We offer swimming lessons, aqua aerobics, and dedicated lanes for lap swimming."
    },
    {
        'service': restaurant_service,
        'title': "Restaurant Rules",
        'description': "At The Restaurant Center, we aim to provide an exceptional dining experience for all our guests. We kindly ask that you respect our smart casual dress code and maintain punctuality for reservations. To ensure a pleasant atmosphere, please keep mobile devices on silent and step outside for phone calls. Inform our staff of any dietary restrictions or allergies so we can accommodate your needs. Families with children are welcome, and we request that children remain supervised. We appreciate your cooperation in adhering to these guidelines to enhance everyone's enjoyment at The Restaurant Center."
    },
    {
        'service': restaurant_service,
        'title': "Dress Code",
        'description': "We maintain a smart casual dress code to preserve the elegant ambiance of our establishment. Gentlemen are encouraged to wear collared shirts, and we kindly request no flip-flops or beachwear."
    },
    {
        'service': restaurant_service,
        'title': "Terrace",
        'description': "Our Terrace offers a relaxed and elegant setting for you to enjoy your meals and drinks while soaking in the beautiful surroundings. "
    },
    {
        'service': breakfast_service,
        'title': "Hours",
        'description': "Breakfast - 7.00 AM to 12.30 AM"
    },
    {
        'service': breakfast_service,
        'title': "Hours",
        'description': "Lunch - not available "
    },
    {
        'service': breakfast_service,
        'title': "Hours",
        'description': "Supper - not available "
    },
    {
        'service': breakfast_service,
        'title': "Hours",
        'description': "Dinner -  not available "
    },
    {
        'service': restaurant_service,
        'title': "Hours",
        'description': "Breakfast - 7.00 AM to 12.30 AM"
    },
    {
        'service': restaurant_service,
        'title': "Hours",
        'description': "Lunch - 1.00 PM to 2.30 PM"
    },
    {
        'service': restaurant_service,
        'title': "Hours",
        'description': "Supper - 6.00 PM to 7.00 PM"
    },
    {
        'service': restaurant_service,
        'title': "Hours",
        'description': "Dinner - 8.30 PM to 10.00 PM"
    },
    {
        'service': gym_service,
        'title': "Hours",
        'description': "5.00 AM to 11.30 pm"
    },
    {
        'service': pool_service,
        'title': "Hours",
        'description': "7.00 AM to 10.30 pm"
    },
]

def run_service_details():
    seeder = Seed.seeder()
    for entry in service_detail_entries:
        seeder.add_entity(ServiceDetail, 1, {
            'service': entry['service'],
            'title': entry['title'],
            'description': entry['description'],
        })
    pks = seeder.execute()
    print(pks)
