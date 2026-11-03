from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/menu", tags=["Menu"])

MENU_ITEMS_CATALOG = [
    {
        "id": "pk-1",
        "name": "Royal Mutton Dum Biryani",
        "nativeName": "شاہی مٹن بریانی",
        "category": "Pakistani Royal",
        "description": "Aged Basmati rice layered with tender goat meat, saffron, kewra water, sealed with dough.",
        "price": "€36",
        "priceNumber": 36,
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        "tag": "Chef's Special"
    },
    {
        "id": "pk-2",
        "name": "Peshawari Lamb Karahi",
        "nativeName": "پشاوری مٹن کڑاہی",
        "category": "Pakistani Royal",
        "description": "Freshly cut lamb cooked in iron wok with organic tomatoes, green chilies, ginger julienne.",
        "price": "€42",
        "priceNumber": 42,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        "tag": "Signature"
    },
    {
        "id": "sf-1",
        "name": "Maine Lobster Thermidor",
        "nativeName": "Homard Thermidor",
        "category": "Seafood",
        "description": "Maine lobster flambéed with Cognac, baked in shell with Gruyère, cream, and Dijon emulsion.",
        "price": "€68",
        "priceNumber": 68,
        "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
        "tag": "Luxurious Catch"
    },
    {
        "id": "cn-1",
        "name": "Imperial Peking Roast Duck",
        "nativeName": "北京烤鸭",
        "category": "Chinese Imperial",
        "description": "Crispy skin roasted duck carved table-side, served with pancakes, cucumber, hoisin glaze.",
        "price": "€58",
        "priceNumber": 58,
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        "tag": "Imperial Feast"
    }
]

@router.get("/")
def get_menu():
    return {
        "success": True,
        "count": len(MENU_ITEMS_CATALOG),
        "menu": MENU_ITEMS_CATALOG
    }
