from django.contrib import admin
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

urlpatterns: list = [
    path('admin/', admin.site.urls),
    path('api/', include('ECF.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
