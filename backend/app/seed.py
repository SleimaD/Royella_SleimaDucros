from django_seed import Seed
from .models import *


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