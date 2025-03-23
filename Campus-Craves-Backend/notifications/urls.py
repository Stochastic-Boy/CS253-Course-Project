from django.urls import path
from .views import NotificationListView, CreateNotificationView, MarkNotificationReadView, DeleteNotificationView, OrderNotificationView

urlpatterns = [
    path('list/', NotificationListView.as_view(), name='notification-list'),  # GET /notifications/list/
    path('create/', CreateNotificationView.as_view(), name='notification-create'),  # POST /notifications/create/
    path('<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='notification-read'),  # PUT /notifications/<id>/read/
    path('<int:notification_id>/delete/', DeleteNotificationView.as_view(), name='notification-delete'),  # DELETE /notifications/<id>/delete/
    path('order/notify/', OrderNotificationView.as_view(), name='order-notify'),  # POST /notifications/order/notify/
]
