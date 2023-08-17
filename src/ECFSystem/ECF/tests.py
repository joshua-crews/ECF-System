from django.contrib.auth import get_user_model
from django.test import TestCase


class UsersManagersTests(TestCase):
    def test_create_user(self):
        new_user = get_user_model()
        user = new_user.objects.create_user(username="foo", email="normal@user.com", password="bar")
        self.assertEqual(user.username, "foo")
        self.assertEqual(user.email, "normal@user.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        with self.assertRaises(TypeError):
            new_user.objects.create_user()
        with self.assertRaises(TypeError):
            new_user.objects.create_user(email="")
        with self.assertRaises(TypeError):
            new_user.objects.create_user(email="", password="bar")
        with self.assertRaises(TypeError):
            new_user.objects.create_user(username="")
        with self.assertRaises(ValueError):
            new_user.objects.create_user(username="", email="")
        with self.assertRaises(ValueError):
            new_user.objects.create_user(username="", email="", password="bar")

    def test_create_superuser(self):
        new_user = get_user_model()
        admin_user = new_user.objects.create_superuser(username="bar", email="super@user.com", password="bar")
        self.assertEqual(admin_user.username, "bar")
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
