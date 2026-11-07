from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import MenuItem

router = APIRouter(prefix="/api/v1/menu", tags=["Menu"])

# Authoritative 16-dish catalog seeded into the database MenuItem table
INITIAL_MENU_SEED = [
    {
        "code": "pk-1",
        "name": "Royal Mutton Dum Biryani",
        "native_name": "شاہی مٹن بریانی",
        "category": "Pakistani Royal Cuisine",
        "description": "Aged Basmati rice layered with tender goat meat, saffron, kewra water, and caramelized onions, sealed with dough and dum-cooked.",
        "price": 36.0,
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        "is_signature": True,
        "pairing_note": "Chef's Special",
    },
    {
        "code": "pk-2",
        "name": "Peshawari Lamb Karahi",
        "native_name": "پشاوری مٹن کڑاہی",
        "category": "Pakistani Royal Cuisine",
        "description": "Freshly cut lamb cooked in a heavy iron wok with organic vine tomatoes, green chilies, ginger julienne, and black pepper.",
        "price": 42.0,
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        "is_signature": True,
        "pairing_note": "Signature",
    },
    {
        "code": "pk-3",
        "name": "Mughlai Charcoal Seekh Kebabs",
        "native_name": "سیخ کباب",
        "category": "Pakistani Royal Cuisine",
        "description": "Hand-minced prime beef infused with green cardamom, fresh herbs, and ghee, grilled over open glowing coals.",
        "price": 28.0,
        "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Charcoal Grill",
    },
    {
        "code": "pk-4",
        "name": "Shahi Nalli Nihari",
        "native_name": "شاہی نلی نہاری",
        "category": "Pakistani Royal Cuisine",
        "description": "Slow-simmered shank stew infused with 32 artisanal spices, rich marrow bone gravy, served with piping hot Roghani Naan.",
        "price": 38.0,
        "image_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Heritage",
    },
    {
        "code": "in-1",
        "name": "Mughlai Butter Chicken",
        "native_name": "مکھنی مرغ",
        "category": "Indian Imperial Feasts",
        "description": "Tandoor-roasted chicken tikka simmered in a velvety San Marzano tomato butter sauce, laced with dried fenugreek leaves.",
        "price": 32.0,
        "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Classic Favorite",
    },
    {
        "code": "in-2",
        "name": "Dal Makhani Azafrán",
        "native_name": "دال مکھنی",
        "category": "Indian Imperial Feasts",
        "description": "Black lentils and kidney beans slow-cooked overnight for 24 hours on clay tandoor, finished with French churned butter.",
        "price": 24.0,
        "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Vegetarian Gold",
    },
    {
        "code": "in-3",
        "name": "Paneer Tikka Kesari",
        "native_name": "پنیر ٹکہ",
        "category": "Indian Imperial Feasts",
        "description": "Artisanal cottage cheese marinated in hung curd, yellow saffron, mustard oil, and bell peppers, seared in tandoor oven.",
        "price": 26.0,
        "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Tandoori Special",
    },
    {
        "code": "cn-1",
        "name": "Imperial Peking Roast Duck",
        "native_name": "北京烤鸭",
        "category": "Chinese & Asian Mastery",
        "description": "Crispy skin roasted duck carved table-side, served with hand-rolled steamed pancakes, cucumber, scallions, and hoisin reduction.",
        "price": 58.0,
        "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        "is_signature": True,
        "pairing_note": "Imperial Feast",
    },
    {
        "code": "cn-2",
        "name": "Truffle Crystal Dim Sum",
        "native_name": "松露水晶饺",
        "category": "Chinese & Asian Mastery",
        "description": "Steamed translucent dumplings filled with wild forest mushrooms, tiger prawns, and shaved black winter truffle.",
        "price": 34.0,
        "image_url": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Dim Sum Delicacy",
    },
    {
        "code": "cn-3",
        "name": "Sichuan Sizzling Tenderloin",
        "native_name": "铁板四川牛柳",
        "category": "Chinese & Asian Mastery",
        "description": "Prime Angus beef tenderloin wok-tossed with red lantern chilies, Sichuan peppercorns, garlic shoots, and sesame oil.",
        "price": 44.0,
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Spicy Sensation",
    },
    {
        "code": "th-1",
        "name": "Royal Tom Yum Goong",
        "native_name": "ต้มยำกุ้ง",
        "category": "Thai Exotic Delights",
        "description": "Hot & sour galangal broth with giant river prawns, wild kaffir lime leaves, lemongrass, and straw mushrooms.",
        "price": 29.0,
        "image_url": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Aromatic Soup",
    },
    {
        "code": "th-2",
        "name": "Emerald Thai Green Curry",
        "native_name": "แกงเขียวหวาน",
        "category": "Thai Exotic Delights",
        "description": "Organic chicken breast cooked in fresh green chili paste, coconut milk, Thai eggplant, and sweet basil leaves.",
        "price": 36.0,
        "image_url": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Curry Perfection",
    },
    {
        "code": "sf-1",
        "name": "Butter-Poached Lobster Thermidor",
        "native_name": "Homard Thermidor",
        "category": "Ocean & Seafood Treasures",
        "description": "Fresh Maine lobster meat flambéed with Cognac, baked in its shell with Gruyère cheese, cream, and Dijon mustard.",
        "price": 68.0,
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
        "is_signature": True,
        "pairing_note": "Luxurious Catch",
    },
    {
        "code": "sf-2",
        "name": "Pan-Seared Chilean Seabass",
        "native_name": "Loup de Mer",
        "category": "Ocean & Seafood Treasures",
        "description": "Wild Chilean Seabass with herb crust, swimming in lemon-saffron reduction, served with microgreens.",
        "price": 49.0,
        "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "Wild Catch",
    },
    {
        "code": "ds-1",
        "name": "Gold Leaf Shahi Tukda",
        "native_name": "شاہی ٹکڑا",
        "category": "Grand Desserts & Elixirs",
        "description": "Saffron brioche soaked in cardamom rabri, topped with pistachios, silver leaf, and 24-karat edible gold flake.",
        "price": 20.0,
        "image_url": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
        "is_signature": True,
        "pairing_note": "Royal Sweet",
    },
    {
        "code": "ds-2",
        "name": "Tahitian Vanilla Crème Brûlée",
        "native_name": "Crème Brûlée",
        "category": "Grand Desserts & Elixirs",
        "description": "Rich vanilla bean custard with a shattered caramelized sugar crust, served with fresh raspberries.",
        "price": 16.0,
        "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
        "is_signature": False,
        "pairing_note": "French Classic",
    },
]


def seed_menu_items(db: Session) -> None:
    """Ensure all 16 authoritative menu dishes exist in the database."""
    existing_codes = {row.code for row in db.query(MenuItem.code).all()}
    added = False
    for dish in INITIAL_MENU_SEED:
        if dish["code"] not in existing_codes:
            db.add(MenuItem(**dish))
            added = True
    if added:
        db.commit()


@router.get("/")
def get_menu(db: Session = Depends(get_db)):
    seed_menu_items(db)
    items = db.query(MenuItem).order_by(MenuItem.id.asc()).all()
    serialized = [
        {
            "id": item.code,
            "name": item.name,
            "nativeName": item.native_name,
            "category": item.category,
            "description": item.description,
            "price": f"€{int(item.price) if float(item.price).is_integer() else f'{item.price:.2f}'}",
            "priceNumber": float(item.price),
            "image": item.image_url,
            "tag": item.pairing_note or "Chef's Selection",
            "isSignature": bool(item.is_signature),
        }
        for item in items
    ]
    return {
        "success": True,
        "count": len(serialized),
        "menu": serialized,
    }
