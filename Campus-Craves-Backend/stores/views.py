from rest_framework import generics, permissions
from .models import Store
from .serializers import StoreSerializer
from rest_framework.permissions import IsAuthenticated


# Create a Store (Seller Only)
class StoreCreateView(generics.CreateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

# List All Stores
class StoreListView(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.AllowAny]

# Retrieve, Update, Delete a Store (Seller Only)
class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Store.objects.filter(seller=self.request.user)


class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]  # ✅ Ensure only logged-in users can access

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Store.objects.none()  # ✅ Prevent error for unauthenticated users
        return Store.objects.filter(seller=self.request.user)



class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Prevent Swagger from causing authentication errors
        if getattr(self, 'swagger_fake_view', False):
            return Store.objects.none()
        return Store.objects.filter(seller=self.request.user)
