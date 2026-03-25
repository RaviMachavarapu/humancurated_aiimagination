import os
import re
from fastapi import APIRouter, HTTPException

router = APIRouter()

CATEGORY_MAP = {
    "empty-to-staged": "empty room to Staged",
    "staged-to-staged": "traditionaly staged to virtually staged",
    "renovation": "renovated room_area",
}


def find_pairs(folder_path: str) -> list:
    if not os.path.exists(folder_path):
        return []

    files = os.listdir(folder_path)
    pairs = {}

    for f in files:
        name_lower = f.lower()
        is_after = "after" in name_lower
        is_before = "before" in name_lower

        if not is_before and not is_after:
            continue

        # Extract room name by removing before/after and extension
        base = name_lower
        for word in ["after", "before", "(after)", "(before)"]:
            base = base.replace(word, "")
        base = os.path.splitext(base)[0]
        base = re.sub(r'[^a-z\s]', '', base).strip()
        base = re.sub(r'\s+', ' ', base)

        if base not in pairs:
            pairs[base] = {"room": base.title(), "before": None, "after": None}

        if is_before:
            pairs[base]["before"] = f
        else:
            pairs[base]["after"] = f

    return [p for p in pairs.values() if p["before"] and p["after"]]


@router.get("/{category}")
def get_portfolio(category: str):
    folder_name = CATEGORY_MAP.get(category)
    if not folder_name:
        raise HTTPException(status_code=404, detail="Category not found")

    portfolio_path = os.getenv("PORTFOLIO_PATH", "")
    if not portfolio_path or not os.path.exists(portfolio_path):
        # On Vercel or when no portfolio path is set, return empty
        return {"category": category, "title": folder_name, "pairs": []}

    folder_path = os.path.join(portfolio_path, folder_name)
    if not os.path.exists(folder_path):
        return {"category": category, "title": folder_name, "pairs": []}

    pairs = find_pairs(folder_path)

    for pair in pairs:
        encoded_folder = folder_name.replace(" ", "%20")
        pair["before_url"] = f"/portfolio-images/{encoded_folder}/{pair['before'].replace(' ', '%20')}"
        pair["after_url"] = f"/portfolio-images/{encoded_folder}/{pair['after'].replace(' ', '%20')}"

    return {
        "category": category,
        "title": folder_name,
        "pairs": pairs,
    }
