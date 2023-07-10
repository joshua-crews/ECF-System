from django.contrib import admin
from django.urls import path
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', get_schema_view(title='API Schema', description='REST API endpoints'), name='api'),
    path('docs/', TemplateView.as_view(template_name='docs.html', extra_context={'schema_url':'api'}), name='swagger-ui'),
]
