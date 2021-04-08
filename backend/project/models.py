from django.db import models
from django.utils import timezone

import json

class Project(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(null=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'Project'