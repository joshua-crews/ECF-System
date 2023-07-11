from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

from src.ECFSystemBackend.Extenuating.views import *

urlpatterns: list = [
    path('admin/', admin.site.urls),
    path('api/', include('Extenuating.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
