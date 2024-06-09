from django_seed import Seed
from .models import *



#region manager
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





#region facility
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



#region payment plan
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




#region service
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



#region service detail
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


#region testimonials
#!testimonials

testimonial_entries = [
{
        'name': 'Melissa Brown',
        'role': 'Utilisateur',
        'feedback': 'The service at this hotel was exceptional. The staff were attentive and made us feel right at home. Highly recommend for a luxurious stay.',
        'rating': 5,
        'image': 'testimonials/image-4.jpg',
        'location': 'Los Angeles, California'
    },
    {
        'name': 'Adriana Alexon',
        'role': 'Utilisateur',
        'feedback': 'From the beautifully decorated rooms to the gourmet meals, everything was perfect. The attention to detail was impressive.',
        'rating': 5,
        'image': 'testimonials/image-2.jpg',
        'location': 'Brussels, Belgium'
    },
    {
        'name': 'Farjana Taleb',
        'role': 'Utilisateur',
        'feedback': "The hotel's amenities were top-notch. We especially loved the spa and the fitness center. A perfect place to relax and unwind.",
        'rating': 5,
        'image': 'testimonials/image-1.jpg',
        'location': 'Rome, Italy'
    },
    {
        'name': 'Mohamed Ali',
        'role': 'Utilisateur',
        'feedback': 'An unforgettable experience! The views from our room were breathtaking and the hospitality was second to none.',
        'rating': 5,
        'image': 'testimonials/img1.jpg',
        'location': 'Milan, Italy'
    },    
    {
        'name': "Carlos Garcia",
        'role': "Utilisateur",
        'feedback': "The restaurant served the most delicious meals. The variety and quality of the food were outstanding. Can't wait to come back!",
        'rating': "4",
        'image': 'testimonials/img2.jpg',
        'location': "Paris, France"
    },
    {
        'name': "Liam O'Connor",
        'role': "Utilisateur",
        'feedback': "A wonderful place to stay with family. The kids loved the pool and the playground, and we enjoyed the peaceful atmosphere.",
        'rating': "5",
        'image': 'testimonials/img3.jpg',
        'location': "Abidjan, Ivory Coast"
    },
    {
        'name': "Sophia Rossi",
        'role': "Utilisateur",
        'feedback': "the location was perfect. The staff went above and beyond to ensure we had a pleasant stay.",
        'rating': "4",
        'image': 'testimonials/image-3.jpg',
        'location': "Rotterdam, Netherlands"
    },

]



def run_testimonial():
    seeder = Seed.seeder()
    for entry in testimonial_entries:
        seeder.add_entity(Testimonial, 1, {
            'name': entry['name'],
            'role': entry['role'],
            'feedback': entry['feedback'],
            'rating': entry['rating'],
            'image': entry['image'],
            'location': entry['location'],
        })
    pks = seeder.execute()
    print(pks)




#region blog
#! blog


def create_categories():
    categories_data = ["Travel", "Health", "Technology", "Lifestyle", "Luxury Hotels", "Restaurants", "SPA Center", "Health Club", "Industrial", "Foods", "Fashion", "Business"]
    categories = []
    
    for name in categories_data:
        category, created = Category.objects.get_or_create(name=name)
        categories.append(category)
    
    return categories

def create_tags():
    tags_data = ["Summer", "Luxury", "Budget", "Family", "Adventure", "Relaxation", "Beach", "Mountain", "Party", "Extreme", "Wellness", "Innovation", "Trends","Paris", "Healthy", "Vacation", "Savings"]
    tags = []
    
    for name in tags_data:
        tag, created = Tag.objects.get_or_create(name=name)
        tags.append(tag)
    
    return tags

def create_blogs(admin_user, categories, tags):
    blogs_data = [
        {
            'title': "Exploring the Mountains",
            'content': "Embark on an unforgettable journey through the majestic peaks and serene valleys of the mountains. Discover the beauty of nature's untouched landscapes, from snow-capped summits to lush meadows teeming with wildflowers. Uncover hidden trails, encounter diverse wildlife, and immerse yourself in the tranquility of the wilderness. This guide will provide you with everything you need to know to plan your next mountain adventure, from choosing the right gear to packing the perfect backpack. Whether you're a seasoned mountaineer or a curious beginner, this blog post will inspire you to explore the wonders of the mountains and create memories that will last a lifetime.",
            'image': "blogs/mountaintitle.jpg",
            'status': 'approved',
            'categories': ["Travel"],
            'tags': ["Mountain", "Adventure", "Vacation"],            
            'descriptions': [
                {
                    "image": "blogs/mountain_desc1.jpg"
                },
                {
                    "image": "blogs/mountain_desc2.jpg"
                },
                {
                    "title": "Allure of the Mountains",
                    "content": "Mountains, with their towering peaks and serene valleys, offer an unforgettable journey through nature's untouched landscapes. Discover hidden trails, encounter diverse wildlife, immerse yourself in the tranquility of the wilderness. Embark on your mountain adventure today.", 
                }
            ]
        },
        {
            'title': "Pre Booking Benifits for the Traveller on our Hotel",  
            'content': "Planning your getaway? Book your stay in advance and unlock a world of benefits! Secure the perfect room type, enjoy exclusive discounts, and gain peace of mind knowing your accommodation is guaranteed. Plus, explore early booking perks like free breakfast or spa credits.  Book your stay today and get ready to experience all that Royella has to offer.",
            'image': "blogs/prebooking.jpg",
            'status': 'approved',
            'categories': ["Travel"],
            'tags': ["budget", "Summer", "Vacation"],
            'descriptions': [
                {
                    "image": "blogs/book_desc1.jpg"
                },
                {
                    "image": "blogs/book_desc2.jpg"
                },
                {
                    "title": "Why Pre-Book? Unwind and Enjoy More", 
                    "content": "ake the stress out of travel and pre-book your stay at [Hotel Name]. Secure the best rates, enjoy flexible cancellation options (if offered), and get priority access to your desired room type. Pre-booking lets you focus on what matters most - creating lasting vacation memories.", 
                }
            ]
        },
        {
            'title': "Healthy Eating Tips",
            'content': "Embark on a journey to a healthier and happier you with these simple and effective healthy eating tips. Discover how to make informed food choices, create a balanced diet, and nourish your body with the essential nutrients it needs to thrive. Learn how to navigate food labels, understand portion sizes, and incorporate delicious and nutritious meals into your lifestyle. With these tips, you'll be well on your way to achieving your wellness goals and feeling your best.",
            'image': "blogs/healthy.jpg",
            'status': 'approved',
            'categories': ["Health"],
            'tags': ["Healthy", "Budget"],  
            'descriptions': [
                {
                    "title": "Fuel Your Body and Mind: Essential Tips for Healthy Eating", 
                    "content": "Nourish your body and mind with these essential healthy eating tips. Learn how to make informed food choices that support your overall well-being. Discover simple strategies for creating a balanced diet rich in essential nutrients. Explore delicious and nutritious recipes that will tantalize your taste buds and fuel your body for optimal health.", 
                },
                {
                    "image": "blogs/healthy_desc1.jpg"
                },
                {
                    "image": "blogs/healthy_desc2.jpg"
                }
            ]
        },
        {
            'title': "Luxury Hotels in Paris",
            'content': "Paris is a city known for its elegance, romance, and rich history. It is also home to some of the most luxurious hotels in the world. These hotels offer guests an unparalleled level of comfort, service, and amenities. If you are looking for a truly unforgettable experience in Paris, then you should consider staying in one of these luxury hotels.",
            'image': "blogs/hotelsparis.jpg",
            'status': 'approved',
            'categories': ["Luxury Hotels"],
            'tags': ["Luxury", "Paris"],
            'descriptions': [
                {
                    "title": "Paris in Opulence: Unveiling Luxury Stays", 
                    "content": "Paris, the City of Lights, shimmers even brighter when experienced from a luxury hotel. Imagine waking up to iconic landmarks like the Eiffel Tower or Seine River just outside your window. Picture indulging in Michelin-starred cuisine and pampering yourself in opulent spas.  Luxury hotels offer more than just a place to stay – they're gateways to unforgettable experiences.", 
                },
                {
                    "image": "blogs/paris_desc1.jpg"
                },
                {
                    "image": "blogs/paris_desc2.jpg"
                }
            ]
        },
        {
            'title': "Family Vacation Spots",
            'content': "Craft unforgettable memories with your loved ones as you explore exciting family vacation spots. From sun-kissed beaches to enchanting mountain getaways, discover destinations that cater to every age and interest. Immerse yourselves in nature's wonders, explore vibrant cultures, and create bonds that will last a lifetime.",
            'image': "blogs/familyvacation.jpg",
            'status': 'approved',
            'categories': ["Travel"],
            'tags': ["Family", "Vacation"],
            'descriptions': [
                {
                    "title": "Family Adventures: A Tapestry of Memories", 
                    "content": "Embark on a journey of togetherness, where laughter echoes through sun-kissed beaches and shared experiences weave a tapestry of cherished memories. Explore bustling cities teeming with life, or venture into the wilderness where nature's wonders await. Let the excitement of family vacations ignite your spirit, strengthening bonds that will last a lifetime.", 
                },
                {
                    "image": "blogs/family_desc1.jpg"
                },
                {
                    "image": "blogs/family_desc2.jpg"
                }
            ]
        },
        {
            'title': "Budget Travel Tips",
            'content': "Traveling the world doesn't have to be an expensive endeavor. With a bit of planning and creativity, you can embark on unforgettable adventures without breaking the bank. Embrace the joy of budget travel by following these savvy tips and discover the world without emptying your wallet.",
            'image': "blogs/budgettravel.jpg",
            'status': 'approved',
            'categories': ["Travel"],
            'tags': ["Budget", "Savings"],
            'descriptions': [
                {
                    "title": "Saving Money", 
                    "content": "Create a budget that allocates your income towards essential expenses, savings goals, and a bit of fun. Budgeting apps can simplify this process.  Be realistic and track your progress to ensure you're staying on track. Even small adjustments to your spending can make a big difference over time.", 
                },
                {
                    "image": "blogs/budget_desc1.jpg"
                },
                {
                    "image": "blogs/budget_desc2.jpg"
                }
            ]
        },
        {
            'title': "Relaxing Spa Retreats",
            'content': "Step into a world of wellness, where soothing aromas and gentle sounds create an atmosphere of pure bliss. Indulge in a variety of pampering treatments, from rejuvenating massages to revitalizing facials. Let the expert hands of skilled therapists melt away your stress and tension, leaving you feeling refreshed and renewed.",
            'image': "blogs/sparetreats.jpg",
            'status': 'approved',
            'categories':[ "SPA Center"],
            'tags': ["Relaxation", "Wellness"],
            'descriptions': [
                {
                    "title": "Rediscover Balance and Inner Harmony",
                    "content": "As you immerse yourself in the tranquility of a spa retreat, you'll find yourself rediscovering balance and inner harmony. The gentle rhythm of nature, the soothing ambiance, and the focus on self-care will guide you towards a state of deep relaxation. Allow yourself to let go of worries and concerns, and embrace the serenity that surrounds you.",
                },
                {
                    "image": "blogs/spa_desc1.jpg"
                },
                {
                    "image": "blogs/spa_desc2.jpg"
                }
            ]
        }
    ]
    
    for blog_data in blogs_data:
        blog = Blog.objects.create(
            title=blog_data['title'],
            content=blog_data['content'],
            image=blog_data['image'],
            author=admin_user,
            status=blog_data['status']
        )
        blog_categories = Category.objects.filter(name__in=blog_data['categories'])
        blog.category.set(blog_categories)

        blog_tags = Tag.objects.filter(name__in=blog_data['tags'])
        blog.tags.set(blog_tags)
        
        for desc_data in blog_data['descriptions']:
            BlogDescription.objects.create(
                blog=blog,
                title=desc_data.get('title', ''),
                content=desc_data.get('content', ''),
                image=desc_data.get('image', None)
            )

def create_comments(admin_user):
    blogs = Blog.objects.all()
    comments_data = [
        {"content": "Great post!", "author": admin_user, "blog": blogs[0]},
        {"content": "Very informative.", "author": admin_user, "blog": blogs[1]},
        {"content": "I loved this place!", "author": admin_user, "blog": blogs[3]},
        {"content": "I disagree with some points.", "author": admin_user, "blog": blogs[2]},
        {"content": "Would love to visit here.", "author": admin_user, "blog": blogs[4]},
        {"content": "Good tips!", "author": admin_user, "blog": blogs[5]},
        {"content": "Thanks for sharing.", "author": admin_user, "blog": blogs[6]},
        {"content": "Amazing destination!", "author": admin_user, "blog": blogs[0]},
        {"content": "Great post!", "author": admin_user, "blog": blogs[1]},
        {"content": "Very informative.", "author": admin_user, "blog": blogs[2]},
        {"content": "I loved this place!", "author": admin_user, "blog": blogs[3]},
        {"content": "I disagree with some points.", "author": admin_user, "blog": blogs[4]},
        {"content": "Would love to visit here.", "author": admin_user, "blog": blogs[5]},
        {"content": "Good tips!", "author": admin_user, "blog": blogs[6]},
        {"content": "Thanks for sharing.", "author": admin_user, "blog": blogs[6]},
        {"content": "Amazing destination!", "author": admin_user, "blog": blogs[3]},
    ]
    
    for comment_data in comments_data:
        Comment.objects.create(
            content=comment_data["content"],
            author=comment_data["author"],
            blog=comment_data["blog"]
        )

