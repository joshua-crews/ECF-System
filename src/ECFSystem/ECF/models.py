import uuid

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser

from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not username:
            raise ValueError("User must have a username.")
        if not email:
            raise ValueError("User must have an email address.")

        user = self.model(username=username, email=self.normalize_email(email))

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username=username,
                                email=self.normalize_email(email),
                                password=password,
                                )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    """Our provided user class with all necessary info and inheritance from django abstract user"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(verbose_name="username", max_length=240, unique=True)
    email = models.EmailField(verbose_name="email", max_length=120, unique=True)
    registration_number = models.IntegerField(verbose_name="registration number", unique=True)
    lawful_citizen = models.BooleanField(verbose_name="lawful citizen", default=True)
    date_of_birth = models.DateTimeField(verbose_name="date of birth", blank=True, null=True)

    # The following fields are required for every custom User model
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_business = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return True


class ExtenuatingForm(models.Model):
    """A form created by a user and handles referencing stages of review."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id')
    keep_medical_private = models.BooleanField(verbose_name="keep medical private", default=True)
    registered_UHS = models.BooleanField(verbose_name="registered UHS")
    healthcare_professional = models.CharField(verbose_name="healthcare professional", null=True, blank=True)
    date_seen_start = models.DateTimeField(verbose_name="date impacted start", null=True, blank=True)
    date_seen_end = models.DateTimeField(verbose_name="date impacted end", null=True, blank=True)

    serious_illness = models.BooleanField(verbose_name="serious illness", default=False)
    deterioration = models.BooleanField(verbose_name="deterioration", default=False)
    bereavement = models.BooleanField(verbose_name="bereavement", default=False)
    family_circumstances = models.BooleanField(verbose_name="family circumstances", default=False)
    other_factors = models.BooleanField(verbose_name="other factors", default=False)
    frequent_absence = models.BooleanField(verbose_name="frequent absence", default=False)

    details = models.TextField(verbose_name="details")
