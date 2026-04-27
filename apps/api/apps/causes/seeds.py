from .models import Cause


def seed():
    causes = [
        {
            "title": "Club Deportivo Barrial",
            "category": "Deporte",
            "summary": "Apoyo a clubes deportivos de barrio para equipamiento e infraestructura.",
            "is_featured": True,
        },
        {
            "title": "Becas Escolares",
            "category": "Educación",
            "summary": "Becas para estudiantes de escuelas públicas con buen rendimiento.",
            "is_featured": True,
        },
        {
            "title": "Salud Comunitaria",
            "category": "Salud",
            "summary": "Campañas de prevención y atención primaria en centros barriales.",
            "is_featured": False,
        },
        {
            "title": "Reforestación Urbana",
            "category": "Ambiente",
            "summary": "Plantación de árboles nativos en espacios públicos de la ciudad.",
            "is_featured": True,
        },
    ]
    for data in causes:
        Cause.objects.get_or_create(
            title=data["title"],
            defaults=data,
        )
