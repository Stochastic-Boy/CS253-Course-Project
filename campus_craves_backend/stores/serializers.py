from rest_framework import serializers
from .models import Store

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'description', 'location', 'status', 'seller_id']

    def validate(self, data):
            seller = data.get("seller")

            if not seller and self.instance:
                seller = self.instance.seller

            if seller and Store.objects.filter(seller=seller).exists():
                raise serializers.ValidationError("You can only create one store.")

            return data
