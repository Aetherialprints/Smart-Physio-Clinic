from django.core.management.base import BaseCommand
from exercises.models import PathologyCategory, Exercise


class Command(BaseCommand):
    help = 'Seed exercise library with default physiotherapy exercises'

    def handle(self, *args, **options):
        data = {
            'Low Back Pain': {
                'description': 'Exercises for lumbar pain and spinal issues',
                'exercises': [
                    {'name': 'Knee-to-Chest Stretch', 'description': 'Lie on your back, pull one knee toward your chest and hold for 20-30 seconds.', 'repetitions': '3 sets of 10', 'duration': '30 seconds hold', 'difficulty': 'easy'},
                    {'name': 'Pelvic Tilt', 'description': 'Lie on your back with knees bent. Flatten your lower back against the floor.', 'repetitions': '3 sets of 15', 'duration': '5 seconds hold', 'difficulty': 'easy'},
                    {'name': 'Cat-Cow Stretch', 'description': 'On all fours, alternate between arching and rounding your back slowly.', 'repetitions': '2 sets of 10', 'duration': '1 minute', 'difficulty': 'easy'},
                    {'name': 'Bird Dog', 'description': 'On all fours, extend opposite arm and leg simultaneously. Hold for 5 seconds.', 'repetitions': '3 sets of 10 each side', 'duration': '5 seconds hold', 'difficulty': 'medium'},
                    {'name': 'Bridge Exercise', 'description': 'Lie on back, knees bent. Lift hips to create straight line from shoulders to knees.', 'repetitions': '3 sets of 15', 'duration': '5 seconds hold', 'difficulty': 'medium'},
                ]
            },
            'Neck Pain': {
                'description': 'Exercises for cervical pain and stiffness',
                'exercises': [
                    {'name': 'Chin Tuck', 'description': 'Pull chin straight back creating a double chin. Hold for 5 seconds.', 'repetitions': '3 sets of 10', 'duration': '5 seconds hold', 'difficulty': 'easy'},
                    {'name': 'Neck Rotation', 'description': 'Slowly rotate head from side to side, holding each position.', 'repetitions': '3 sets of 10', 'duration': '10 seconds each side', 'difficulty': 'easy'},
                    {'name': 'Upper Trapezius Stretch', 'description': 'Tilt head to one side, gently assist with hand. Hold 20-30 seconds.', 'repetitions': '3 each side', 'duration': '30 seconds hold', 'difficulty': 'easy'},
                ]
            },
            'Knee Rehabilitation': {
                'description': 'Exercises for knee recovery and strengthening',
                'exercises': [
                    {'name': 'Quad Sets', 'description': 'Tighten thigh muscles while leg is straight. Hold for 5-10 seconds.', 'repetitions': '3 sets of 10', 'duration': '10 seconds hold', 'difficulty': 'easy'},
                    {'name': 'Straight Leg Raise', 'description': 'Lie on back, lift straight leg to height of opposite knee.', 'repetitions': '3 sets of 10', 'duration': '5 seconds hold', 'difficulty': 'easy'},
                    {'name': 'Seated Knee Extension', 'description': 'Sit on chair, slowly straighten knee, hold, lower slowly.', 'repetitions': '3 sets of 15', 'duration': '3 seconds hold', 'difficulty': 'medium'},
                ]
            },
            'Ankle Sprain': {
                'description': 'Balance and proprioception for ankle recovery',
                'exercises': [
                    {'name': 'Single Leg Balance', 'description': 'Stand on one leg, maintain balance. Progress by closing eyes.', 'repetitions': '3 sets each leg', 'duration': '30 seconds', 'difficulty': 'easy'},
                    {'name': 'Alphabet Writing', 'description': 'Write the alphabet in the air with your foot.', 'repetitions': '2 times each foot', 'duration': '5 minutes', 'difficulty': 'easy'},
                    {'name': 'Calf Raises', 'description': 'Rise up on toes, hold, lower slowly. Progress to single leg.', 'repetitions': '3 sets of 20', 'duration': '3 seconds hold', 'difficulty': 'easy'},
                ]
            },
            'Shoulder Rehabilitation': {
                'description': 'Exercises for shoulder pain and mobility',
                'exercises': [
                    {'name': 'Pendulum Exercises', 'description': 'Lean forward, let arm hang and swing in small circles.', 'repetitions': '2 sets', 'duration': '1 minute each direction', 'difficulty': 'easy'},
                    {'name': 'Wall Climbs', 'description': 'Walk fingers up the wall as high as possible.', 'repetitions': '3 sets of 10', 'duration': '5 seconds hold', 'difficulty': 'easy'},
                ]
            },
        }

        count = 0
        for cat_name, cat_data in data.items():
            cat, _ = PathologyCategory.objects.get_or_create(name=cat_name, defaults={'description': cat_data['description']})
            for ex_data in cat_data['exercises']:
                ex, created = Exercise.objects.get_or_create(
                    name=ex_data['name'],
                    defaults={
                        'description': ex_data['description'],
                        'repetitions': ex_data['repetitions'],
                        'duration': ex_data['duration'],
                        'difficulty': ex_data['difficulty'],
                    }
                )
                if created:
                    ex.pathology_categories.add(cat)
                    count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {count} exercises across {len(data)} categories'))
