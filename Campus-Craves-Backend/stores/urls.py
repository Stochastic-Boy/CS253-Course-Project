from django.urls import path
from .views import StoreCreateView, StoreListView, StoreDetailView

urlpatterns = [
    path('', StoreListView.as_view(), name='store-list'),  # GET /stores/
    path('create/', StoreCreateView.as_view(), name='store-create'),  # POST /stores/create/
    path('<int:store_id>/', StoreDetailView.as_view(), name='store-detail'),  # GET, PUT, DELETE /stores/<id>/
]

