from rest_framework import serializers
from .models import *


class RegistrationSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the User model for value manipulation only. This does not have a send value
    and cannot be used for anything other than new userdata creation."""
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self) -> User:
        user: User = User(username=self.validated_data['username'], email=self.validated_data['email'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user
