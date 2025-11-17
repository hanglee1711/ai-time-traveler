"""
Utility functions for the application
"""
from pathlib import Path
import os


def get_character_avatar(character_name: str) -> str:
    """
    Get avatar path for a character based on their name

    Args:
        character_name: Name of the historical figure

    Returns:
        Path to avatar image, or None if not found
    """
    # Mapping from character name to image filename (without diacritics, lowercase, no spaces)
    name_to_file = {
        # Có ảnh sẵn (19 nhân vật)
        "Bà Triệu": "batrieu.jpg",
        "Đinh Bộ Lĩnh": "dinhbolinh.jpg",
        "Hai Bà Trưng": "haibatrung.jpg",
        "Hàn Mạc Tử": "hanmactu.jpg",
        "Hồ Chí Minh": "hochiminh.jpg",
        "Hồ Quý Ly": "hoquyly.jpg",
        "Lê Hoàn": "lehoan.jpg",
        "Lê Lợi": "leloi.jpg",
        "Lý Bí": "lybi.jpg",
        "Lý Công Uẩn": "lyconguan.jpg",
        "Lý Nhân Tông": "lynhantong.jpg",
        "Lý Thường Kiệt": "lythuongkiet.jpg",
        "Nguyễn Du": "nguyendu.jpg",
        "Nguyễn Trãi": "nguyentrai.jpg",
        "Trần Bình Trọng": "tranbinhtrong.jpg",
        "Trần Hưng Đạo": "tranhungdao.jpg",
        "Trương Định": "truongdinh.jpg",
        "Tú Xương": "tuxuong.jpg",
        "Võ Nguyên Giáp": "vonguyengiap.webp",

        # Chưa có ảnh - sẽ fallback to placeholder
        "Ngô Quyền": "ngoqoyen.jpg",
        "Quang Trung": "quangtrung.jpg",
        "Lý Chiêu Hoàng": "lychieuhoan.jpg",
        "Trần Thái Tông": "tranthaitong.jpg",
        "Trần Nhân Tông": "trannhantong.jpg",
        "Trần Quốc Toản": "tranquoctoan.jpg",
        "Mạc Đăng Dung": "macdangdung.jpg",
        "Lê Thánh Tông": "lethanhtong.jpg",
        "Nguyễn Bỉnh Khiêm": "nguyenbinhkhiem.jpg",
        "Gia Long": "gialong.jpg",
        "Minh Mạng": "minhmang.jpg",
        "Lê Văn Duyệt": "levanduyet.jpg",
        "Hoàng Hoa Thám": "hoanghoatham.jpg",
        "Phan Bội Châu": "phanboichau.jpg",
        "Phan Châu Trinh": "phanchautrinh.jpg",
        "Nguyễn Thái Học": "nguyenthaihoc.jpg",
        "Phạm Hồng Thái": "phamhongthai.jpg",
        "Hồ Xuân Hương": "hoxuanhuong.jpg",
        "Nguyễn Đình Chiểu": "nguyendinhchieu.jpg",
        "Tản Đà": "tanda.jpg",
    }

    # Get filename from mapping
    filename = name_to_file.get(character_name)
    if not filename:
        return None

    # Check if file exists
    avatar_path = Path(__file__).parent.parent / "portraits" / filename

    if avatar_path.exists():
        # Return relative path from project root for Streamlit
        return str(Path("portraits") / filename)
    else:
        # File doesn't exist yet - return None to use fallback
        return None


def get_character_initials(character_name: str) -> str:
    """
    Get initials from character name for fallback avatar

    Args:
        character_name: Name of the character

    Returns:
        2-3 character initials
    """
    words = character_name.split()
    if len(words) >= 2:
        return f"{words[0][0]}{words[-1][0]}".upper()
    return character_name[:2].upper()
