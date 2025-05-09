# users/views.py
from rest_framework import permissions, generics
from .models import CustomUser
from .serializers import UserProfileSerializer
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ClaimSunPointView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        current_hour = timezone.now().hour
        
        # Allow claiming only between 8AM and 9AM
        if 8 <= current_hour < 9:
            claimed, bonus = user.claim_sun_point()
            if claimed:
                return Response({
                    'message': f'Sun Point claimed! {f"+{bonus} bonus" if bonus else ""}',
                    'sun_points': user.sun_points,
                    'streak_days': user.streak_days,
                    'bonus': bonus
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'You already claimed your Sun Point today.',
                'sun_points': user.sun_points,
                'streak_days': user.streak_days,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Sun Points can only be claimed between 8:00 AM and 9:00 AM.',
            'sun_points': user.sun_points,
            'streak_days': user.streak_days,
        }, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=400)

    if CustomUser.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists.'}, status=400)

    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'detail': e.messages[0]}, status=400)

    user = CustomUser.objects.create_user(username=username, password=password)
    return Response({'detail': 'User created successfully.'}, status=201)

from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({'username': request.user.username})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sun_point_status(request):
    user = request.user
    today = timezone.now().date()
    last_claim = user.last_sun_point_claim
    streak = user.streak_days

    already_claimed = last_claim == today

    # Predict next bonus (without modifying data)
    if last_claim and (today - last_claim).days == 1:
        predicted_streak = streak + 1
    elif not last_claim:
        predicted_streak = 1
    else:
        predicted_streak = 1

    bonus = 0
    if predicted_streak >= 7:
        bonus = 2
    elif predicted_streak >= 3:
        bonus = 1

    return Response({
        'sun_points': user.sun_points,
        'already_claimed': already_claimed,
        'streak_days': streak,
        'potential_bonus': bonus,
        'can_claim_now': 8 <= timezone.now().hour < 9,
    })