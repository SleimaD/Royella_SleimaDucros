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
    