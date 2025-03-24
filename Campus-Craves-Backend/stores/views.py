from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Store
from .serializers import StoreSerializer
from .controller import create_store, get_all_stores, get_store_by_id, update_store, delete_store

class StoreCreateView(generics.CreateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        data = self.request.data
        create_store(
            seller=self.request.user,
            name=data.get('name'),
            description=data.get('description'),
            location=data.get('location'),
            status=data.get('status', 'open')
        )

class StoreListView(generics.ListAPIView):
    queryset = get_all_stores()
    serializer_class = StoreSerializer

class StoreDetailView(APIView):
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