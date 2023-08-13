from rest_framework import serializers
from .models import *


class RegistrationSerializer(serializers.ModelSerializer):
    """Generates a JSON like object of the User model for value manipulation only. This does not have a send value
    and cannot be used for anything other than new userdata creation."""

    class Meta:
        model = User
        fields = ['username', 'email', 'registration_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self) -> User:
        user: User = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            registration_number=self.validated_data['registration_number']
        )
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user


class FormSerializer(serializers.ModelSerializer):
    """Validates and saves a form object to the database along with the sub models for each requested module affected
    and the private healthcare information if needed."""

    class Meta:
        model = ExtenuatingForm
        fields = ['id', 'student', 'keep_medical_private', 'registered_UHS', 'healthcare_professional',
                  'date_seen_start', 'date_seen_end', 'serious_illness', 'deterioration', 'bereavement',
                  'family_circumstances', 'other_factors', 'frequent_absence', 'details']

    def save(self) -> ExtenuatingForm:
        """Writes a valid ExtenuatingForm object to the database."""
        form = ExtenuatingForm(
            student=self.validated_data['student'],
            keep_medical_private=self.validated_data['keep_medical_private'],
            registered_UHS=self.validated_data['registered_UHS'],
            healthcare_professional=self.validated_data['healthcare_professional'],
            date_seen_start=self.validated_data['date_seen_start'],
            date_seen_end=self.validated_data['date_seen_end'],
            serious_illness=self.validated_data['serious_illness'],
            deterioration=self.validated_data['deterioration'],
            bereavement=self.validated_data['bereavement'],
            family_circumstances=self.validated_data['family_circumstances'],
            other_factors=self.validated_data['other_factors'],
            frequent_absence=self.validated_data['frequent_absence'],
            details=self.validated_data['details']
        )
        form.save()
        return form
