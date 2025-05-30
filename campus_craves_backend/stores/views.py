from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Store
from django.core.exceptions import PermissionDenied
from .serializers import StoreSerializer
from .controller import create_store, get_all_stores, get_store_by_id, update_store, delete_store

class StoreCreateView(generics.CreateAPIView):
    """ Allows sellers to create a store """
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        seller = self.request.user

        if getattr(seller, "role", None) != "seller":  
            raise PermissionDenied("Only sellers can create a store.")

        if Store.objects.filter(seller=seller).exists():
            raise serializers.ValidationError("You can only have one store.")

        create_store(
            seller=seller,
            name=self.request.data.get('name'),
            description=self.request.data.get('description'),
            location=self.request.data.get('location'),
            status=self.request.data.get('status', 'open')
        )

class StoreListView(generics.ListAPIView):
    """ Lists all available stores """
    queryset = get_all_stores()
    serializer_class = StoreSerializer

class StoreDetailView(APIView):
    """ Handles retrieving, updating, and deleting a store """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, store_id):   
        store = get_store_by_id(store_id)
        if store:
            return Response(StoreSerializer(store).data)
        return Response({"error": "Store not found"}, status=404)

    def put(self, request, store_id):
        store = get_store_by_id(store_id)
        if store and store.seller == request.user:
            data = request.data
            update_store(
                store,
                name=data.get('name'),
                description=data.get('description'),
                location=data.get('location'),
                status=data.get('status')
            )
            return Response({"message": "Store updated"})
        return Response({"error": "Unauthorized or not found"}, status=403)

    def delete(self, request, store_id):
        store = get_store_by_id(store_id)
        if store and store.seller == request.user:
            delete_store(store)
            return Response({"message": "Store deleted"})
        return Response({"error": "Unauthorized or not found"}, status=403)