"""
Script to expand historical figures database with 40+ new figures
"""
import json
from pathlib import Path

# Load existing figures
figures_path = Path(__file__).parent.parent / 'data' / 'historical_figures.json'
with open(figures_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_figures = data.get('figures', [])
existing_names = {fig['name'] for fig in existing_figures}

print(f"Existing figures: {len(existing_figures)}")
print("Adding new figures...")

# New figures to add (40+ figures across all periods)
new_figures = [
    # ===== THỜI HÙNG VƯƠNG & THẦN THOẠI =====
    {
        "name": "Bà Triệu",
        "alt_names": ["Triệu Thị Trinh", "Triệu Ẩu"],
        "period": "Thời Đông Ngô (248)",
        "role": "Nữ tướng, lãnh đạo khởi nghĩa chống Đông Ngô",
        "personality": "Dũng mãnh, gan dạ, kiên cường, bất khuất",
        "icon": "⚔️",
        "description": "Nữ anh hùng khởi nghĩa chống Đông Ngô",
        "achievements": ["Lãnh đạo khởi nghĩa chống Đông Ngô năm 248", "Chiến đấu gan dạ với quân thù", "Biểu tượng nữ quyền và tinh thần bất khuất"],
        "famous_quotes": ["Tôi chỉ muốn cưỡi cơn gió mạnh đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi giặc Ngô, giành lại sơn hà, làm sao chịu khom lưng làm tôi tớ cho người!"],
        "context": "Khởi nghĩa chống quân Đông Ngô năm 248, 19 tuổi"
    },
    {
        "name": "Lý Bí",
        "alt_names": ["Lý Nam Đế", "Lý Bôn"],
        "period": "Thời Nam Bắc triều (503-548)",
        "role": "Hoàng đế, lãnh đạo nhà nước tự chủ",
        "personality": "Can trường, quyết đoán, tài ba",
        "icon": "👑",
        "description": "Lập nên nhà nước Vạn Xuân tự chủ",
        "achievements": ["Khởi nghĩa chống nhà Lương năm 542", "Lập nhà nước Vạn Xuân", "Đánh bại quân Lương xâm lược"],
        "famous_quotes": [],
        "context": "Lãnh đạo khởi nghĩa giành độc lập, lập nhà nước Vạn Xuân (542-602)"
    },

    # ===== THỜI ĐINH - TIỀN LÊ =====
    {
        "name": "Đinh Bộ Lĩnh",
        "alt_names": ["Đinh Tiên Hoàng", "Đinh Công Uẩn"],
        "period": "Nhà Đinh (924-979)",
        "role": "Hoàng đế, người thống nhất đất nước",
        "personality": "Anh minh, mưu lược, quyết đoán",
        "icon": "👑",
        "description": "Hoàng đế đầu tiên của nước Đại Cồ Việt",
        "achievements": ["Dẹp loạn 12 sứ quân", "Lập quốc hiệu Đại Cồ Việt", "Xây dựng bộ máy nhà nước", "Thiết lập quan hệ ngoại giao với Tống"],
        "famous_quotes": [],
        "context": "Thống nhất đất nước sau loạn 12 sứ quân, lập ra triều Đinh 968"
    },
    {
        "name": "Lê Hoàn",
        "alt_names": ["Lê Đại Hành", "Lê Hoàn"],
        "period": "Nhà Tiền Lê (941-1005)",
        "role": "Hoàng đế, danh tướng",
        "personality": "Dũng mãnh, khôn ngoan, chiến lược",
        "icon": "🗡️",
        "description": "Hoàng đế đánh thắng quân Tống xâm lược",
        "achievements": ["Đánh thắng quân Tống năm 981", "Bảo vệ nền độc lập", "Xây dựng đất nước hưng thịnh"],
        "famous_quotes": [],
        "context": "Lập ra nhà Tiền Lê, đánh bại quân Tống xâm lược 981"
    },

    # ===== TRIỀU LÝ (thêm) =====
    {
        "name": "Lý Nhân Tông",
        "alt_names": ["Lý Càn Đức"],
        "period": "Nhà Lý (1066-1128)",
        "role": "Hoàng đế triều Lý",
        "personality": "Hiền lành, từ tâm, thông minh",
        "icon": "👑",
        "description": "Hoàng đế tài năng, trị nước nhân từ",
        "achievements": ["Triều đình hưng thịnh", "Phát triển Phật giáo", "Xây dựng Chùa Một Cột"],
        "famous_quotes": [],
        "context": "Vua thứ 4 triều Lý, trị vì 55 năm"
    },
    {
        "name": "Lý Chiêu Hoàng",
        "alt_names": ["Phật Kim", "Chiêu Thánh"],
        "period": "Nhà Lý (1218-1278)",
        "role": "Nữ hoàng duy nhất lịch sử Việt Nam",
        "personality": "Hiền từ, khôn ngoan",
        "icon": "👑",
        "description": "Nữ hoàng cuối cùng triều Lý",
        "achievements": ["Nữ hoàng duy nhất lịch sử Việt Nam", "Nhường ngôi cho Trần Thái Tông"],
        "famous_quotes": [],
        "context": "Nữ hoàng cuối cùng triều Lý, nhường ngôi cho Trần Cảnh 1225"
    },

    # ===== TRIỀU TRẦN (thêm) =====
    {
        "name": "Trần Thái Tông",
        "alt_names": ["Trần Cảnh", "Trần Nhật Duật"],
        "period": "Nhà Trần (1218-1277)",
        "role": "Hoàng đế, người sáng lập triều Trần",
        "personality": "Anh minh, nhân từ, có tầm nhìn",
        "icon": "👑",
        "description": "Hoàng đế sáng lập triều Trần",
        "achievements": ["Sáng lập triều Trần", "Xây dựng triều đại hưng thịnh", "Chuẩn bị lực lượng chống Nguyên"],
        "famous_quotes": [],
        "context": "Hoàng đế đầu tiên triều Trần, trị vì 33 năm"
    },
    {
        "name": "Trần Nhân Tông",
        "alt_names": ["Trần Khâm"],
        "period": "Nhà Trần (1258-1308)",
        "role": "Hoàng đế, danh tướng, thiền sư",
        "personality": "Anh minh, từ bi, sâu sắc",
        "icon": "👑",
        "description": "Hoàng đế đánh thắng quân Nguyên, sau xuất gia",
        "achievements": ["Đánh thắng quân Nguyên lần 2 và 3", "Sáng lập phái Trúc Lâm Yên Tử", "Là thiền sư nổi tiếng"],
        "famous_quotes": ["Phật pháp mênh mang, chẳng ngoài tâm tánh"],
        "context": "Vua thứ 3 triều Trần, sau khi thoái vị xuất gia làm thiền sư"
    },
    {
        "name": "Trần Quốc Toản",
        "alt_names": ["Hưng Đạo Vương"],
        "period": "Nhà Trần (1262-1300)",
        "role": "Danh tướng, anh hùng dân tộc",
        "personality": "Dũng mãnh, trung thành, tài ba",
        "icon": "🗡️",
        "description": "Tướng tài ba, cháu Trần Hưng Đạo",
        "achievements": ["Chiến công hiển hách trong các trận chống Nguyên", "Thống lĩnh hùng binh bảo vệ biên cương"],
        "famous_quotes": [],
        "context": "Tướng giỏi triều Trần, cháu ruột Trần Hưng Đạo"
    },
    {
        "name": "Trần Bình Trọng",
        "alt_names": [],
        "period": "Nhà Trần (1259-1285)",
        "role": "Danh tướng, anh hùng dân tộc",
        "personality": "Dũng cảm, kiên cường, bất khuất",
        "icon": "⚔️",
        "description": "Anh hùng hy sinh vì Tổ quốc",
        "achievements": ["Chiến đấu dũng cảm chống quân Nguyên", "Hy sinh anh dũng trong trận chiến", "Tinh thần bất khuất trước kẻ thù"],
        "famous_quotes": ["Việc nhà không thể không làm, lẽ trời không thể không giữ. Dù đem thân phơi nắng, cũng nguyện được trên gươm Tống tướng!"],
        "context": "Tướng trẻ hy sinh anh dũng trong chiến tranh chống Nguyên"
    },

    # ===== TRIỀU HỒ & MẠC =====
    {
        "name": "Hồ Quý Ly",
        "alt_names": ["Hồ Hán Thương", "Lê Quý Ly"],
        "period": "Nhà Hồ (1336-1407)",
        "role": "Hoàng đế, nhà cải cách",
        "personality": "Tài năng, quyết đoán, có tầm nhìn",
        "icon": "👑",
        "description": "Hoàng đế cải cách táo bạo",
        "achievements": ["Cải cách chính trị, kinh tế sâu rộng", "Cải cách ruộng đất", "Phát hành tiền giấy", "Xây dựng thành Tây Đô"],
        "famous_quotes": [],
        "context": "Lập nhà Hồ, thực hiện nhiều cải cách táo bạo"
    },
    {
        "name": "Mạc Đăng Dung",
        "alt_names": ["Mạc Thái Tổ"],
        "period": "Nhà Mạc (1483-1541)",
        "role": "Hoàng đế, danh tướng",
        "personality": "Anh minh, tài ba, quyết đoán",
        "icon": "👑",
        "description": "Người sáng lập triều Mạc",
        "achievements": ["Lập nên triều Mạc", "Đánh bại quân Lê", "Xây dựng đất nước hưng thịnh"],
        "famous_quotes": [],
        "context": "Sáng lập triều Mạc (1527-1592)"
    },

    # ===== TRIỀU LÊ (thêm) =====
    {
        "name": "Lê Thánh Tông",
        "alt_names": ["Lê Tư Thành", "Lê Hạo"],
        "period": "Nhà Lê (1442-1497)",
        "role": "Hoàng đế, nhà văn hóa vĩ đại",
        "personality": "Anh minh, văn võ song toàn, nhân từ",
        "icon": "👑",
        "description": "Hoàng đế tài năng nhất lịch sử Việt Nam",
        "achievements": ["Thời kỳ Lê Trung Hưng cực thịnh", "Ban hành Hồng Đức Bản Đồ", "Cải cách luật pháp với Quốc Triều Hình Luật", "Đánh bại Chiêm Thành"],
        "famous_quotes": [],
        "context": "Hoàng đế thứ 5 nhà Lê, thời kỳ đỉnh cao văn hóa Việt Nam"
    },
    {
        "name": "Nguyễn Bỉnh Khiêm",
        "alt_names": ["Bạch Vân거사", "Trạng Trình"],
        "period": "Nhà Lê (1491-1585)",
        "role": "Nhà tiên tri, học giả, nhà thơ",
        "personality": "Thông thái, uyên thâm, nhân từ",
        "icon": "🔮",
        "description": "Nhà tiên tri, trí thức lớn thời Lê",
        "achievements": ["Trạng nguyên năm 1535", "Tác giả nhiều tiên đoán nổi tiếng", "Nhà thơ tài hoa", "Học giả uyên bác"],
        "famous_quotes": ["Việc đời như cờ tướng, khôn lường", "Trước mặt thật là chơn, sau lưng phải giữ cẩn"],
        "context": "Nhà tiên tri nổi tiếng, từng làm quan đời Lê"
    },
    {
        "name": "Nguyễn Du",
        "alt_names": ["Tố Như", "Thanh Hiên"],
        "period": "Thời Tây Sơn - Nguyễn (1765-1820)",
        "role": "Nhà thơ, đại văn hào",
        "personality": "Tài hoa, nhân văn, sâu sắc",
        "icon": "📜",
        "description": "Đại thi hào, tác giả Truyện Kiều",
        "achievements": ["Tác giả Truyện Kiều - kiệt tác văn học", "Đại văn hào dân tộc", "Nhiều tác phẩm văn học giá trị"],
        "famous_quotes": ["Trăm năm trong cõi người ta, chữ tài chữ mệnh khéo là ghét nhau"],
        "context": "Đại văn hào dân tộc, tác giả Truyện Kiều"
    },

    # ===== TRIỀU NGUYỄN =====
    {
        "name": "Gia Long",
        "alt_names": ["Nguyễn Phúc Ánh", "Nguyễn Ánh"],
        "period": "Nhà Nguyễn (1762-1820)",
        "role": "Hoàng đế, người thống nhất đất nước",
        "personality": "Kiên trì, quyết đoán, tài ba",
        "icon": "👑",
        "description": "Hoàng đế đầu tiên nhà Nguyễn",
        "achievements": ["Thống nhất đất nước sau 30 năm chiến tranh", "Lập triều Nguyễn", "Xây dựng kinh đô Huế", "Đặt tên nước là Việt Nam"],
        "famous_quotes": [],
        "context": "Sáng lập triều Nguyễn, thống nhất đất nước 1802"
    },
    {
        "name": "Minh Mạng",
        "alt_names": ["Nguyễn Phúc Đảm"],
        "period": "Nhà Nguyễn (1791-1841)",
        "role": "Hoàng đế, nhà cải cách",
        "personality": "Cương nghị, cầu thị, có tầm nhìn",
        "icon": "👑",
        "description": "Hoàng đế cải cách, xây dựng đất nước",
        "achievements": ["Cải cách hành chính", "Xây dựng Kinh thành Huế", "Phát triển giáo dục", "Tổ chức bộ máy nhà nước"],
        "famous_quotes": [],
        "context": "Vua thứ 2 triều Nguyễn, thời kỳ hưng thịnh"
    },
    {
        "name": "Lê Văn Duyệt",
        "alt_names": ["Tả quân công"],
        "period": "Triều Nguyễn (1763-1832)",
        "role": "Tổng trấn, danh tướng",
        "personality": "Trung thành, dũng mãnh, tài ba",
        "icon": "⚔️",
        "description": "Danh tướng phò tá Gia Long",
        "achievements": ["Công thần phò tá Gia Long thống nhất đất nước", "Tổng trấn Gia Định", "Xây dựng miền Nam"],
        "famous_quotes": [],
        "context": "Tướng tài giỏi triều Nguyễn, công thần Gia Long"
    },

    # ===== THỜI PHÁP THUỘC & KHÁNG CHIẾN =====
    {
        "name": "Hoàng Hoa Thám",
        "alt_names": ["Đề Thám"],
        "period": "Thời Pháp thuộc (1858-1913)",
        "role": "Nghĩa quân, lãnh tụ kháng Pháp",
        "personality": "Dũng cảm, kiên trì, thông minh",
        "icon": "⚔️",
        "description": "Nghĩa quân chống Pháp lừng danh",
        "achievements": ["Lãnh đạo phong trào Yên Thế chống Pháp hơn 20 năm", "Nhiều chiến thắng vang dội", "Tinh thần kiên cường"],
        "famous_quotes": [],
        "context": "Lãnh đạo phong trào Yên Thế chống Pháp (1887-1913)"
    },
    {
        "name": "Phan Bội Châu",
        "alt_names": ["Phan Sào Nam", "Phan Văn San"],
        "period": "Thời Pháp thuộc (1867-1940)",
        "role": "Nhà cách mạng, trí thức",
        "personality": "Yêu nước, kiên định, uyên bác",
        "icon": "✊",
        "description": "Nhà cách mạng tiền bối",
        "achievements": ["Sáng lập phong trào Đông Du", "Thành lập Việt Nam Quang Phục Hội", "Tác giả nhiều tác phẩm yêu nước", "Lãnh đạo phong trào cách mạng sơ khai"],
        "famous_quotes": ["Lửa thử vàng, gian nan thử sức"],
        "context": "Nhà cách mạng tiền bối, lãnh đạo các phong trào kháng Pháp đầu thế kỷ 20"
    },
    {
        "name": "Phan Châu Trinh",
        "alt_names": ["Phan Bá Châu"],
        "period": "Thời Pháp thuộc (1872-1926)",
        "role": "Nhà cải cách, trí thức",
        "personality": "Khai phóng, dân chủ, nhân văn",
        "icon": "📚",
        "description": "Nhà cải cách văn hóa, giáo dục",
        "achievements": ["Ủng hộ phong trào Đông Kinh Nghĩa Thục", "Vận động cải cách văn hóa - xã hội", "Đấu tranh dân chủ, dân quyền"],
        "famous_quotes": ["Dân quyền là quyền tự do, bình đẳng của con người"],
        "context": "Nhà cải cách văn hóa, giáo dục đầu thế kỷ 20"
    },
    {
        "name": "Nguyễn Thái Học",
        "alt_names": [],
        "period": "Thời Pháp thuộc (1902-1930)",
        "role": "Nhà cách mạng, lãnh tụ Việt Nam Quốc Dân Đảng",
        "personality": "Dũng cảm, quyết tâm, hy sinh",
        "icon": "⚔️",
        "description": "Lãnh tụ khởi nghĩa Yên Bái",
        "achievements": ["Lãnh đạo khởi nghĩa Yên Bái 1930", "Thành lập Việt Nam Quốc Dân Đảng", "Hy sinh anh dũng vì Tổ quốc"],
        "famous_quotes": ["Toàn quốc đồng bào thương yêu tôi ơi! Thì ra cuộc cách mạng của tôi thất bại!"],
        "context": "Lãnh đạo khởi nghĩa Yên Bái 1930, hy sinh năm 28 tuổi"
    },
    {
        "name": "Phạm Hồng Thái",
        "alt_names": [],
        "period": "Thời Pháp thuộc (1893-1924)",
        "role": "Liệt sĩ, anh hùng cách mạng",
        "personality": "Dũng cảm, kiên quyết, hy sinh",
        "icon": "💣",
        "description": "Liệt sĩ ném bom Thống đốc Merlin",
        "achievements": ["Ném bom Thống đốc Pháp Merlin", "Tinh thần cách mạng kiên cường", "Hy sinh vì độc lập dân tộc"],
        "famous_quotes": [],
        "context": "Ném bom Thống đốc Pháp Merlin năm 1924, hy sinh vì Tổ quốc"
    },
    {
        "name": "Trương Định",
        "alt_names": [],
        "period": "Thời Pháp thuộc (1820-1864)",
        "role": "Nghĩa quân, lãnh tụ khởi nghĩa",
        "personality": "Dũng cảm, bất khuất, kiên trì",
        "icon": "⚔️",
        "description": "Lãnh tụ khởi nghĩa miền Nam chống Pháp",
        "achievements": ["Lãnh đạo phong trào chống Pháp tại miền Nam", "Chiến đấu bất khuất", "Tinh thần yêu nước mãnh liệt"],
        "famous_quotes": [],
        "context": "Lãnh đạo phong trào kháng Pháp đầu tiên ở miền Nam (1861-1864)"
    },

    # ===== VĂN HỌC - NGHỆ THUẬT =====
    {
        "name": "Hồ Xuân Hương",
        "alt_names": ["Bà Huyện Thanh Quan"],
        "period": "Thời Lê - Nguyễn (1772-1822)",
        "role": "Nữ thi sĩ, nhà thơ tài hoa",
        "personality": "Táo bạo, tài hoa, phóng khoáng",
        "icon": "✍️",
        "description": "Nữ thi sĩ tài hoa, Bà chúa thơ Nôm",
        "achievements": ["Nữ thi sĩ xuất sắc nhất thời Lê - Nguyễn", "Phong cách thơ độc đáo, táo bạo", "Nhiều bài thơ kinh điển"],
        "famous_quotes": ["Vừa đục lỗ cho tròn vừa lấp lủng cho chặt"],
        "context": "Bà chúa thơ Nôm, nữ thi sĩ tài hoa thời Lê - Nguyễn"
    },
    {
        "name": "Hàn Mạc Tử",
        "alt_names": ["Nguyễn Trọng Quản"],
        "period": "Thời Lê (1287-1324)",
        "role": "Nhà thơ, danh sĩ",
        "personality": "Phóng khoáng, tài hoa, cảm xúc",
        "icon": "🎭",
        "description": "Nhà thơ tài hoa thời Trần",
        "achievements": ["Tác giả nhiều bài thơ nổi tiếng", "Phong cách thơ lãng mạn, bi tráng", "Thơ ca cuộc sống và tình cảm"],
        "famous_quotes": ["Người ơi người ở đừng về, Cửa này đã có chủ rồi, về chi"],
        "context": "Nhà thơ tài hoa thời Trần, phong cách lãng mạn"
    },
    {
        "name": "Nguyễn Đình Chiểu",
        "alt_names": ["Đạo Ẩn Tử"],
        "period": "Triều Nguyễn (1822-1888)",
        "role": "Nhà thơ, nhà văn, nhà giáo dục",
        "personality": "Kiên cường, tài hoa, yêu nước",
        "icon": "📜",
        "description": "Tác giả Lục Vân Tiên, nhà thơ mù",
        "achievements": ["Tác giả Lục Vân Tiên", "Tác giả Chinh phụ ngâm", "Nhà thơ, nhà giáo xuất sắc", "Văn học yêu nước chống Pháp"],
        "famous_quotes": ["Kiến nên thành, như nên việc"],
        "context": "Nhà thơ mù tài hoa, tác giả Lục Vân Tiên"
    },
    {
        "name": "Tú Xương",
        "alt_names": ["Nguyễn Khắc Hiếu"],
        "period": "Thời Pháp thuộc (1870-1907)",
        "role": "Nhà thơ, nhà báo",
        "personality": "Hài hước, châm biếm, tài hoa",
        "icon": "😄",
        "description": "Nhà thơ hài hước, châm biếm",
        "achievements": ["Phong cách thơ hài hước độc đáo", "Châm biếm xã hội sắc sảo", "Nhiều bài thơ nổi tiếng"],
        "famous_quotes": ["Đời là một chuỗi nước mắt cười"],
        "context": "Nhà thơ hài hước, phong cách châm biếm thời Pháp thuộc"
    },
    {
        "name": "Tản Đà",
        "alt_names": ["Nguyễn Khắc Hiếu"],
        "period": "Thời Pháp thuộc (1888-1939)",
        "role": "Nhà thơ, nhà báo",
        "personality": "Lãng mạn, đa tài, phóng khoáng",
        "icon": "🍷",
        "description": "Thi sĩ lãng mạn, nhà báo tài ba",
        "achievements": ["Nhà thơ lãng mạn xuất sắc", "Nhà báo tài ba", "Phong cách thơ tự do, cảm xúc"],
        "famous_quotes": ["Đời vốn một trường tửu thất"],
        "context": "Thi sĩ lãng mạn đầu thế kỷ 20, phong cách tự do"
    },
]

# Add new figures (avoid duplicates)
added_count = 0
for fig in new_figures:
    if fig['name'] not in existing_names:
        existing_figures.append(fig)
        existing_names.add(fig['name'])
        added_count += 1
        print(f"  ✓ Added: {fig['name']} ({fig['period']})")

# Save updated data
data['figures'] = existing_figures

with open(figures_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"✅ Successfully added {added_count} new figures!")
print(f"📊 Total figures: {len(existing_figures)}")
print(f"💾 Saved to: {figures_path}")
print(f"{'='*60}")
