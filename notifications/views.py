from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class UnreadNotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user, is_read=False)
        return Response(NotificationSerializer(notifications, many=True).data)


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Marked as read'})
        except Notification.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class MarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All marked as read'})
