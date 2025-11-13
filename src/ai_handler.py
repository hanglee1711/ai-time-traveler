"""
AI Handler Module - Supports multiple AI providers
"""
import os
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

# Helper function to get environment variables from both sources
def get_env(key: str, default: str = None) -> str:
    """
    Get environment variable from Streamlit secrets or os.environ
    Supports both local (.env) and Streamlit Cloud deployment
    """
    # First try os.environ (works for Flask/Render and local)
    env_value = os.getenv(key, default)
    if env_value:
        return env_value

    # Then try Streamlit secrets (only for Streamlit deployment)
    try:
        import streamlit as st
        if hasattr(st, 'secrets') and key in st.secrets:
            return st.secrets[key]
    except:
        pass

    return default


class AIHandler:
    """Handle interactions with different AI providers"""

    def __init__(self, provider: str = "openai"):
        """
        Initialize AI Handler

        Args:
            provider: AI provider to use (openai, gemini, or llama)
        """
        self.provider = provider.lower()
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize the appropriate AI client based on provider"""
        if self.provider == "openai":
            self._init_openai()
        elif self.provider == "gemini":
            self._init_gemini()
        elif self.provider == "llama":
            self._init_llama()
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            from openai import OpenAI
            api_key = get_env("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
            self.client = OpenAI(api_key=api_key)
            self.model = get_env("OPENAI_MODEL", "gpt-4")
        except ImportError:
            raise ImportError("OpenAI package not installed. Run: pip install openai")

    def _init_gemini(self):
        """Initialize Google Gemini client - WITH RELAXED SAFETY SETTINGS"""
        try:
            import google.generativeai as genai
            api_key = get_env("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)

            # Use gemini-2.5-flash
            self.model_name = get_env("GEMINI_MODEL", "gemini-2.5-flash")

            # RELAXED SAFETY SETTINGS - Allow educational historical content
            # This prevents blocking of Vietnamese history topics like wars, rebellions, etc.
            self.safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]

            self.client = genai.GenerativeModel(
                model_name=self.model_name,
                safety_settings=self.safety_settings
            )
        except ImportError:
            raise ImportError("Google Generative AI package not installed. Run: pip install google-generativeai")

    def _init_llama(self):
        """Initialize Llama client (via API)"""
        self.api_url = get_env("LLAMA_API_URL")
        self.api_key = get_env("LLAMA_API_KEY")
        if not self.api_url:
            raise ValueError("LLAMA_API_URL not found in environment variables")

    def _generate_fallback_response(self, system_prompt: str, user_message: str, figure_data: dict = None) -> str:
        """
        ENHANCED Fallback: Always responds with meaningful content using REAL data
        Covers 20+ question patterns with specific information from database
        """
        import re
        import json
        from pathlib import Path

        # Extract figure name from system prompt
        figure_match = re.search(r'về (.+?),', system_prompt)
        figure_name = figure_match.group(1) if figure_match else "nhân vật lịch sử"

        # Load figure data if not provided
        if not figure_data:
            try:
                base_dir = Path(__file__).parent.parent
                figures_path = base_dir / 'data' / 'historical_figures.json'
                with open(figures_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    figures_list = data.get('figures', [])
                    for fig in figures_list:
                        if fig.get('name') == figure_name:
                            figure_data = fig
                            break
            except Exception as e:
                print(f"[ERROR] Failed to load figure data: {e}")
                figure_data = None

        user_lower = user_message.lower()

        # === SPECIFIC EVENTS - Check for specific historical events FIRST ===
        # COMPREHENSIVE EVENT MAPPING for all major figures

        # Ngô Quyền - Trận Bạch Đằng 938
        if figure_name == "Ngô Quyền" and any(word in user_lower for word in ["bạch đằng", "bach dang", "trận", "chiến thắng", "938"]):
            return """Trận Bạch Đằng năm 938 là chiến công lớn nhất đời ta! Khi quân Nam Hán do Lưu Hoằng Tháo kéo sang xâm lược, ta đã sử dụng chiến thuật cọc ngầm xuất sắc trên sông Bạch Đằng. Ta cho đóng hàng nghìn cọc sắt nhọn dưới lòng sông, chờ thủy triều lên để địch vào sâu, rồi đánh úp khi nước rút. Chiến thắng vang dội này chấm dứt 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập cho dân tộc ta!"""

        # Hai Bà Trưng - Khởi nghĩa năm 40
        elif figure_name == "Hai Bà Trưng" and any(word in user_lower for word in ["khởi nghĩa", "nổi dậy", "đánh nhau", "trung quốc", "hán", "40"]):
            return """Năm 40, chúng tôi đã lãnh đạo cuộc khởi nghĩa lớn chống ách đô hộ của nhà Hán. Khi Tô Định làm hại chồng chị Trắc, chúng tôi không thể chịu đựng được nữa! Chúng tôi đã tập hợp 80,000 quân, giải phóng 65 thành trì, tự xưng là Trưng Nữ Vương và cai trị đất nước trong 3 năm. Dù sau đó thất bại, tinh thần chúng tôi đã truyền cảm hứng cho các thế hệ sau về ý chí bất khuất của phụ nữ Việt Nam!"""

        # Trần Hưng Đạo - Chiến thắng Mông Cổ
        elif figure_name == "Trần Hưng Đạo" and any(word in user_lower for word in ["mông cổ", "nguyên", "bạch đằng", "1288", "chiến thuật", "cọc ngầm", "trận"]):
            return """Ba lần đánh Mông Cổ (1258, 1285, 1288) là những chiến công vẻ vang nhất đời ta! Đặc biệt trận Bạch Đằng năm 1288, ta đã tái hiện chiến thuật cọc ngầm của tiền bối Ngô Quyền. Quân Nguyên-Mông 500,000 người tưởng mình bất khả chiến bại, nhưng ta đã dùng trí tuệ - đánh úp bằng cọc ngầm, phục binh, và tinh thần quyết tử cho tổ quốc. "Giặc đến nhà, không đánh thì phải chăng?" - đó là lời ta hô hào toàn quân!"""

        # Lê Lợi - Khởi nghĩa Lam Sơn
        elif figure_name == "Lê Lợi" and any(word in user_lower for word in ["lam sơn", "khởi nghĩa", "minh", "trung quốc", "10 năm", "chiến tranh"]):
            return """Khởi nghĩa Lam Sơn (1418-1428) là 10 năm gian khổ nhất cuộc đời ta! Từ vùng núi Thanh Hóa với chỉ vài trăm người, ta và quân sư Nguyễn Trãi đã kiên trì đánh du kích, tập hợp lực lượng. Dù nhiều lần suýt bị tiêu diệt, ta không bao giờ từ bỏ. Cuối cùng, ta đã đánh thắng 200,000 quân Minh tại Chi Lăng năm 1427, giành lại độc lập cho đất nước và lập nên triều Lê!"""

        # Quang Trung (Nguyễn Huệ) - Ngọc Hồi Đống Đa
        elif figure_name == "Quang Trung" and any(word in user_lower for word in ["ngọc hồi", "đống đa", "thanh", "trung quốc", "tết", "1789"]):
            return """Trận Ngọc Hồi - Đống Đa (Tết 1789) là chiến công làm rung chuyển cả Đông Á! Khi quân Thanh 290,000 người tràn vào Thăng Long ngồi ăn Tết, ta đã hành quân thần tốc từ Phú Xuân ra Bắc chỉ trong 7 ngày. Đêm 30 Tết, ta phát động tổng tấn công - 100,000 quân Tây Sơn như hổ xuống núi, đánh tan quân Thanh chỉ trong 5 ngày. Đây là chiến thắng vĩ đại nhất trong lịch sử chống Bắc xâm!"""

        # Hồ Chí Minh - Tuyên ngôn độc lập, Cách mạng
        elif figure_name == "Hồ Chí Minh" and any(word in user_lower for word in ["tuyên ngôn", "độc lập", "cách mạng", "1945", "ba đình", "2/9"]):
            return """Ngày 2/9/1945 tại Quảng trường Ba Đình là khoảnh khắc lịch sử! Tôi đã đọc Tuyên ngôn Độc lập trước 500,000 đồng bào: "Nước Việt Nam có quyền hưởng tự do và độc lập..." - khẳng định chủ quyền dân tộc sau gần 100 năm Pháp thuộc. Đó là kết quả của cả đời tôi cống hiến cho cách mạng, từ khi rời bến cảng Nhà Rồng năm 1911 tìm đường cứu nước!"""

        # Võ Nguyên Giáp - Điện Biên Phủ
        elif figure_name == "Võ Nguyên Giáp" and any(word in user_lower for word in ["điện biên phủ", "dien bien phu", "pháp", "1954", "chiến dịch", "thắng lợi"]):
            return """Chiến dịch Điện Biên Phủ (1954) là "Điện Biên" lừng lẫy trong lịch sử quân sự thế giới! Tôi đã chỉ huy 50,000 quân vây ải địch kiên cố nhất của Pháp. Chúng tôi khiêng pháo lên núi, đào hào chiến đấu, bao vây từng ngày. 56 ngày đêm giao tranh ác liệt, cuối cùng cờ Tổ quốc tung bay trên boong-ke De Castries. Chiến thắng này chấm dứt 80 năm thực dân Pháp, mở đường cho hòa bình Đông Dương!"""

        # Lý Thường Kiệt - Đánh Tống
        elif figure_name == "Lý Thường Kiệt" and any(word in user_lower for word in ["tống", "như mộng", "thần đạo", "chiến tranh", "thành", "1075", "1076"]):
            return """Cuộc chiến chống Tống (1075-1077) là chiến công lớn đời ta! Năm 1075, ta đã chủ động tiến đánh vào đất Tống, chiếm Ung Châu và Khâm Châu. Khi quân Tống phản công, ta viết bài thơ "Nam quốc sơn hà" - tuyên bố chủ quyền lãnh thổ nước ta. Ta đã dùng chiến thuật đánh úp, mai phục, giữ vững biên cương phía Bắc cho triều Lý!"""

        # Nguyễn Trãi - Bình Ngô Đại Cáo
        elif figure_name == "Nguyễn Trãi" and any(word in user_lower for word in ["bình ngô", "đại cáo", "văn", "thơ", "quân sư", "lam sơn"]):
            return """Ta là quân sư của Lê Lợi trong khởi nghĩa Lam Sơn. Nhưng công việc lớn nhất của ta là viết "Bình Ngô Đại Cáo" - văn bản tuyên bố độc lập năm 1428, khẳng định: "Việc nhân nghĩa đã định đoạt, quân hung bạo phải thua." Ta muốn chứng minh rằng trí tuệ và văn chương cũng quan trọng như chiến tranh trong việc xây dựng đất nước!"""

        # Bà Triệu - Nữ tướng chống Đông Ngô
        elif figure_name == "Bà Triệu" and any(word in user_lower for word in ["khởi nghĩa", "ngô", "đông ngô", "nữ tướng", "248"]):
            return """Năm 248, ta chỉ 19 tuổi đã lãnh đạo khởi nghĩa chống Đông Ngô! Ta nói với anh trai: "Tôi muốn cưỡi gió, giẫm sóng lớn, chém cá kình trong biển Đông, đánh đuổi quân Ngô, giải phóng bách tính, há chịu khom lưng làm tì thiếp người ta sao?" Dù sau 6 tháng thất bại, tinh thần kiên cường của ta vẫn sống mãi trong lòng người Việt!"""

        # Đinh Bộ Lĩnh - Thống nhất đất nước
        elif figure_name == "Đinh Bộ Lĩnh" and any(word in user_lower for word in ["thống nhất", "12 sứ quân", "loạn", "đại cồ việt", "968"]):
            return """Sau khi Ngô Quyền mất, nước ta rơi vào loạn 12 Sứ quân (938-968). Ta đã từng bước đánh dẹp các sứ quân, thống nhất đất nước năm 968, lập nên nhà Đinh với quốc hiệu "Đại Cồ Việt". Ta còn thiết lập hệ thống quân đội chặt chẽ với 10 đạo quân để bảo vệ biên cương!"""

        # Lý Công Uẩn - Dời đô Thăng Long
        elif figure_name == "Lý Công Uẩn" and any(word in user_lower for word in ["dời đô", "thăng long", "hà nội", "chiếu dời đô", "1010"]):
            return """Năm 1010, ta đã quyết định dời đô từ Hoa Lư về Đại La (nay là Hà Nội) và đặt tên là Thăng Long. Ta viết "Chiếu dời đô": "Thành này đất rộng người đông, sông núi vững vàng, thật là đất Rồng bay Phượng múa..." Đây là quyết sách quan trọng nhất đời ta, mở ra thời kỳ thịnh trị của nhà Lý!"""

        # === GREETING & INTRODUCTION ===
        # Check greeting with specific patterns to avoid false matches
        elif user_lower.startswith(("xin chào", "chào ", "hello", "hi ", "chúc ", "kính ")):
            if figure_data and figure_data.get('description'):
                return f"Xin chào! Ta là {figure_name} - {figure_data['description']}. Rất vui được gặp ngươi!"
            return f"Xin chào! Ta là {figure_name}. Rất vui được gặp ngươi. Ngươi muốn tìm hiểu điều gì về ta?"

        elif any(word in user_lower for word in ["là ai", " ai ", "giới thiệu", "bạn là"]):
            if figure_data:
                role = figure_data.get('role', 'nhân vật lịch sử')
                period = figure_data.get('period', 'lịch sử Việt Nam')
                return f"Ta là {figure_name}, {role} thời {period}. Cuộc đời ta gắn liền với những thời khắc quan trọng của dân tộc. Ngươi muốn biết điều gì?"
            return f"Ta là {figure_name}, một nhân vật trong lịch sử Việt Nam. Cuộc đời ta gắn liền với những thời khắc quan trọng của dân tộc. Ngươi muốn biết về giai đoạn nào?"

        # === BIOGRAPHY & LIFE ===
        elif any(word in user_lower for word in ["chuyện đời", "cuộc đời", "tiểu sử", "câu chuyện", "kể", "sinh ra", "lớn lên", "tuổi thơ"]):
            if figure_data:
                # Try biography first
                if figure_data.get('biography'):
                    return figure_data['biography'][:300] + "... Ngươi muốn biết thêm về giai đoạn nào?"
                # If no biography, use context or description + achievements
                elif figure_data.get('context'):
                    context = figure_data.get('context', '')
                    role = figure_data.get('role', '')
                    period = figure_data.get('period', '')
                    return f"Ta là {role} thời {period}. {context} Ngươi muốn tìm hiểu gì về ta?"
                elif figure_data.get('achievements'):
                    achievements = figure_data.get('achievements', [])
                    role = figure_data.get('role', 'nhân vật lịch sử')
                    period = figure_data.get('period', '')
                    return f"Ta là {role} thời {period}. Cuộc đời ta gắn liền với: {', '.join(achievements[:3])}. Đây là những di sản ta để lại cho thế hệ sau!"
            return f"Cuộc đời ta là một hành trình đầy thử thách và ý nghĩa. Từ những ngày đầu cho đến những quyết định quan trọng, mỗi giai đoạn đều để lại dấu ấn sâu đậm. Ngươi muốn nghe về phần nào trong cuộc đời ta?"

        # === PHILOSOPHY & BELIEFS ===
        elif any(word in user_lower for word in ["triết lý", "suy nghĩ", "quan điểm", "niềm tin", "giá trị", "lý tưởng", "mục tiêu"]):
            return f"Triết lý sống của ta là luôn đặt lợi ích chung lên trên hết. Ta tin vào sức mạnh của ý chí, lòng kiên trì và tinh thần đoàn kết. Mỗi quyết định ta đưa ra đều xuất phát từ trái tim và lý trí."

        # === MILITARY & STRATEGY ===
        elif any(word in user_lower for word in ["chiến thuật", "quân sự", "chiến tranh", "chiến lược", "võ thuật", "binh pháp", "chiến đấu"]):
            if figure_data and figure_data.get('achievements'):
                achievements = figure_data['achievements']
                military_achievements = [a for a in achievements if any(w in a.lower() for w in ['chiến', 'thắng', 'quân', 'trận'])]
                if military_achievements:
                    return f"Về quân sự, ta tự hào với: {', '.join(military_achievements[:2])}. Chiến thắng đến từ trí tuệ và sự chuẩn bị kỹ lưỡng!"
            return f"Trong lĩnh vực quân sự, ta học hỏi từ nhiều nguồn và áp dụng linh hoạt. Chiến thắng không chỉ đến từ sức mạnh mà còn từ trí tuệ, sự chuẩn bị kỹ lưỡng và tinh thần của toàn quân."

        # === ACHIEVEMENTS & CONTRIBUTIONS ===
        elif any(word in user_lower for word in ["sự kiện", "thành tựu", "đóng góp", "công lao", "thành công", "di sản", "để lại", "ảnh hưởng"]):
            if figure_data and figure_data.get('achievements'):
                achievements = figure_data['achievements'][:2]  # First 2 achievements
                return f"Những thành tựu của ta bao gồm: {', '.join(achievements)}. Ta hy vọng những đóng góp này sẽ có giá trị cho thế hệ sau!"
            return f"Những đóng góp của ta là kết quả của sự nỗ lực không ngừng và lòng tận tụy. Ta hy vọng những gì mình làm sẽ để lại giá trị tích cực cho thế hệ sau và cho đất nước."

        # === FAMILY & PERSONAL LIFE ===
        elif any(word in user_lower for word in ["gia đình", "vợ", "chồng", "con", "cha", "mẹ", "anh em", "người thân"]):
            return f"Gia đình luôn là nguồn động lực quan trọng với ta. Những người thân yêu là lý do để ta tiếp tục phấn đấu và vượt qua mọi khó khăn trong cuộc đời."

        # === HISTORICAL PERIOD & CONTEXT ===
        elif any(word in user_lower for word in ["thời đại", "thời kỳ", "bối cảnh", "hoàn cảnh", "lúc đó", "năm", "thời"]):
            return f"Thời đại mà ta sống là giai đoạn đầy biến động trong lịch sử. Hoàn cảnh thúc đẩy ta và nhiều người cùng thời phải đưa ra những quyết định quan trọng cho vận mệnh chung."

        # === LESSONS & WISDOM ===
        elif any(word in user_lower for word in ["bài học", "lời khuyên", "kinh nghiệm", "rút ra", "học hỏi", "dạy"]):
            return f"Từ những trải nghiệm của mình, ta nhận ra rằng: kiên trì, dũng cảm và lòng nhân ái là những giá trị không bao giờ lỗi thời. Hy vọng thế hệ sau sẽ học hỏi và phát huy những điều tốt đẹp này."

        # === CHALLENGES & DIFFICULTIES ===
        elif any(word in user_lower for word in ["khó khăn", "thử thách", "vượt qua", "đối mặt", "khổ", "gian khó"]):
            return f"Cuộc đời ai cũng có những thử thách riêng. Ta đã trải qua nhiều khó khăn, nhưng chính những điều đó tôi luyện ý chí và làm ta trưởng thành hơn."

        # === RELATIONSHIPS & COLLEAGUES ===
        elif any(word in user_lower for word in ["bạn bè", "đồng minh", "cộng sự", "người", "quan hệ", "gặp"]):
            return f"Trong cuộc đời, ta may mắn được gặp nhiều người tài đức. Những mối quan hệ đó không chỉ là sự hỗ trợ mà còn là nguồn cảm hứng để ta tiếp tục con đường mình đã chọn."

        # === LEGACY & MEMORY ===
        elif any(word in user_lower for word in ["di sản", "nhớ", "ghi nhớ", "sau này", "mai sau", "tương lai"]):
            return f"Ta hy vọng những gì mình làm sẽ được ghi nhớ không vì danh vọng, mà vì giá trị mà nó mang lại cho cộng đồng và đất nước. Đó mới là di sản thực sự."

        # === INSPIRATION & MOTIVATION ===
        elif any(word in user_lower for word in ["cảm hứng", "động lực", "truyền cảm", "khích lệ", "tại sao", "vì sao"]):
            return f"Động lực lớn nhất của ta là tình yêu quê hương và trách nhiệm với dân tộc. Mỗi khi gặp khó khăn, ta nghĩ đến những người đang tin tưởng và mình lại có thêm sức mạnh."

        # === LITERATURE & ARTS (văn học, nghệ thuật) ===
        elif any(word in user_lower for word in ["văn học", "thơ", "văn", "viết", "tác phẩm", "sáng tác", "kiều", "nghệ thuật"]):
            if figure_data and figure_data.get('achievements'):
                achievements = figure_data['achievements']
                literary = [a for a in achievements if any(w in a.lower() for w in ['văn', 'thơ', 'tác phẩm', 'kiều', 'sách', 'viết'])]
                if literary:
                    return f"Về văn chương, ta tự hào với: {', '.join(literary[:2])}. Văn học là cách ta ghi lại tâm tư và truyền tải giá trị cho thế hệ sau!"
            return f"Văn học và nghệ thuật là phương tiện để ta thể hiện tư tưởng và cảm xúc. Qua những tác phẩm, ta muốn để lại di sản tinh thần cho dân tộc."

        # === EDUCATION & LEARNING ===
        elif any(word in user_lower for word in ["học", "giáo dục", "dạy", "trường", "tri thức", "kiến thức"]):
            return f"Học hỏi và giáo dục là nền tảng của một dân tộc. Ta luôn tin rằng tri thức là sức mạnh, và giáo dục tốt sẽ tạo nên những con người tốt cho đất nước."

        # === POLITICS & GOVERNANCE ===
        elif any(word in user_lower for word in ["chính trị", "cai trị", "quản lý", "nhà nước", "triều đình", "vua", "quan"]):
            if figure_data:
                role = figure_data.get('role', '')
                if any(w in role.lower() for w in ['vua', 'hoàng', 'vương', 'tông']):
                    return f"Là {role}, ta hiểu rằng cai trị đất nước là trách nhiệm nặng nề. Ta luôn cố gắng làm sao để dân được no ấm, nước được thái bình."
            return f"Trong chính trị, ta tin vào sự công bằng và đặt lợi ích nhân dân lên hàng đầu. Một nhà lãnh đạo tốt phải biết lắng nghe và hành động vì dân."

        # === DEATH & END OF LIFE ===
        elif any(word in user_lower for word in ["chết", "mất", "qua đời", "cuối đời", "lúc chết", "trước khi chết"]):
            return f"Cái chết là điều tất yếu của mọi người. Quan trọng không phải là sống bao lâu, mà là sống như thế nào - có để lại điều gì có ý nghĩa cho thế hệ sau hay không."

        # === PERSONAL QUALITIES & CHARACTER ===
        elif any(word in user_lower for word in ["tính cách", "con người", "thế nào", "như thế nào", "ra sao"]):
            if figure_data:
                personality = figure_data.get('personality', 'kiên cường và trung thành')
                return f"Người ta nói ta là người {personality}. Ta cố gắng sống đúng với những giá trị mà ta tin tưởng và luôn hết lòng vì đất nước."
            return f"Ta là một người bình thường với những ưu điểm và khuyết điểm. Nhưng ta luôn cố gắng làm điều đúng đắn và sống có ý nghĩa."

        # === RELIGION & SPIRITUALITY ===
        elif any(word in user_lower for word in ["tôn giáo", "đạo", "phật", "thiền", "tu hành", "tâm linh"]):
            return f"Tâm linh là phần quan trọng giúp ta tìm thấy bình an và sự cân bằng trong cuộc sống. Ta tôn trọng các giá trị tâm linh và đạo đức của dân tộc."

        # === FAVORITES & PREFERENCES ===
        elif any(word in user_lower for word in ["thích", "yêu", "ưa", "thú", "sở thích", "đam mê"]):
            if figure_data and figure_data.get('achievements'):
                achievements = figure_data['achievements'][0] if figure_data['achievements'] else ''
                return f"Ta đam mê với công việc của mình. Đặc biệt, ta tự hào với thành tựu: {achievements}. Đó là niềm vui và ý nghĩa cuộc đời ta!"
            return f"Ta thích những việc mang lại giá trị cho đất nước và nhân dân. Mỗi ngày được cống hiến là một niềm hạnh phúc với ta."

        # === COMPARISON & OPINION ===
        elif any(word in user_lower for word in ["so với", "khác với", "giống với", "hơn so với", "nghĩ về", "ý kiến về", "nhận xét"]):
            return f"Mỗi người, mỗi thời đại đều có hoàn cảnh và cách làm riêng. Ta tôn trọng những người đi trước và học hỏi từ họ, đồng thời cố gắng làm tốt vai trò của mình."

        # === REGRETS & MISTAKES ===
        elif any(word in user_lower for word in ["hối hận", "tiếc", "sai lầm", "lỗi", "ân hận"]):
            return f"Ai cũng có những quyết định không hoàn hảo. Quan trọng là ta học được gì từ những sai lầm và cố gắng làm tốt hơn trong tương lai."

        # === ADVICE TO YOUTH ===
        elif any(word in user_lower for word in ["thế hệ trẻ", "giới trẻ", "thanh niên", "lời khuyên cho"]):
            return f"Ta khuyên thế hệ trẻ hãy: học tập không ngừng, giữ gìn truyền thống dân tộc, đồng thời cởi mở với tiến bộ. Hãy sống có ý nghĩa và cống hiến cho xã hội."

        # === DEFAULT: SMART RESPONSE based on context ===
        else:
            # Try to extract context from the question and give meaningful response
            if figure_data:
                # Use figure's role and context to give relevant answer
                role = figure_data.get('role', 'nhân vật lịch sử')
                period = figure_data.get('period', '')
                context = figure_data.get('context', '')

                # Provide contextual response
                if context:
                    return f"Ngươi hỏi điều thú vị! Là {role} thời {period}, ta có thể nói rằng: {context[:200]}. Ngươi muốn biết thêm về khía cạnh nào?"
                elif figure_data.get('achievements'):
                    achievements = ', '.join(figure_data['achievements'][:2])
                    return f"Câu hỏi hay đấy! Là {role}, ta đã có những đóng góp như: {achievements}. Ngươi có muốn tìm hiểu sâu hơn về điều nào không?"

            # Ultimate fallback - encourage to ask more specific questions
            return f"Đây là một câu hỏi hay! Là {figure_name}, ta sẵn sàng chia sẻ với ngươi. Ngươi có thể hỏi ta về: cuộc đời, triết lý sống, những sự kiện lịch sử, thành tựu, bài học rút ra, hoặc bất cứ điều gì cụ thể hơn. Ta đang lắng nghe!"

    def generate_response(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.8,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate response from AI

        Args:
            system_prompt: System prompt to set context
            user_message: User's message
            temperature: Creativity level (0-1)
            max_tokens: Maximum response length

        Returns:
            AI response string
        """
        if self.provider == "openai":
            return self._generate_openai(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "gemini":
            return self._generate_gemini(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "llama":
            return self._generate_llama(system_prompt, user_message, temperature, max_tokens)

    def _generate_openai(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Lỗi khi gọi OpenAI API: {str(e)}"

    def _generate_gemini(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using Google Gemini - WITH SAFETY HANDLING"""
        try:
            # Combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # OPTIMIZED: Add generation config for faster response
            generation_config = {
                'temperature': temperature,
                'max_output_tokens': max_tokens,
                'top_p': 0.95,
                'top_k': 40,
            }

            # API call with optimized config AND safety settings
            response = self.client.generate_content(
                full_prompt,
                generation_config=generation_config,
                safety_settings=self.safety_settings
            )

            # IMPORTANT: Check finish_reason before accessing text
            # finish_reason: 1=STOP (normal), 2=SAFETY (blocked), 3=RECITATION, 4=MAX_TOKENS
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]

                # Check if response was blocked by safety filters
                if hasattr(candidate, 'finish_reason'):
                    finish_reason = candidate.finish_reason

                    if finish_reason == 2:  # SAFETY
                        print(f"[SAFETY] Content blocked by Gemini safety filters - USING FALLBACK")
                        # FALLBACK: Generate simple response without AI
                        return self._generate_fallback_response(system_prompt, user_message)

                    elif finish_reason == 3:  # RECITATION
                        print(f"[RECITATION] Content blocked by recitation check")
                        return "Xin lỗi, câu trả lời có thể vi phạm bản quyền. Hãy thử hỏi theo cách khác nhé!"

                    elif finish_reason == 4:  # MAX_TOKENS
                        print(f"[MAX_TOKENS] Response truncated")
                        # Still try to get partial text
                        if hasattr(candidate.content, 'parts') and candidate.content.parts:
                            return candidate.content.parts[0].text
                        return "Câu trả lời quá dài. Hãy thử hỏi chi tiết hơn nhé!"

            # Normal case: get text from response
            if hasattr(response, 'text'):
                return response.text

            # Fallback: try to extract from parts
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate.content, 'parts') and candidate.content.parts:
                    return candidate.content.parts[0].text

            # If we get here, something went wrong - use fallback
            print(f"[ERROR] No valid response from Gemini - USING FALLBACK")
            return self._generate_fallback_response(system_prompt, user_message)

        except AttributeError as e:
            # Handle the specific "response.text requires valid Part" error - use fallback
            print(f"[ERROR] Gemini response structure error: {str(e)} - USING FALLBACK")
            return self._generate_fallback_response(system_prompt, user_message)

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini API: {str(e)}")

            # Use fallback for all errors except quota
            if "quota" in error_msg or "limit" in error_msg:
                return "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                # For all other errors (including safety), use fallback
                print(f"[ERROR] Using fallback due to Gemini error")
                return self._generate_fallback_response(system_prompt, user_message)

    def _generate_llama(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """Generate response using Llama (via API)"""
        import requests
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            data = {
                "model": "llama-3",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": temperature,
                "max_tokens": max_tokens
            }

            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()

            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Lỗi khi gọi Llama API: {str(e)}"

    def generate_response_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.8,
        max_tokens: int = 1000
    ):
        """
        Generate streaming response from AI (yields chunks)

        Args:
            system_prompt: System prompt to set context
            user_message: User's message
            temperature: Creativity level (0-1)
            max_tokens: Maximum response length

        Yields:
            Text chunks as they arrive
        """
        if self.provider == "gemini":
            yield from self._generate_gemini_stream(system_prompt, user_message, temperature, max_tokens)
        elif self.provider == "openai":
            yield from self._generate_openai_stream(system_prompt, user_message, temperature, max_tokens)
        else:
            # Fallback: for non-streaming providers, yield the complete response
            response = self.generate_response(system_prompt, user_message, temperature, max_tokens)
            yield response

    def _generate_gemini_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ):
        """Generate streaming response using Google Gemini - WITH SAFETY HANDLING"""
        try:
            # Combine prompt and question
            full_prompt = f"""{system_prompt}

{user_message}"""

            # Generation config for streaming
            generation_config = {
                'temperature': temperature,
                'max_output_tokens': max_tokens,
                'top_p': 0.95,
                'top_k': 40,
            }

            # Call Gemini API with streaming enabled AND safety settings
            response = self.client.generate_content(
                full_prompt,
                generation_config=generation_config,
                safety_settings=self.safety_settings,
                stream=True
            )

            # Yield each chunk as it arrives
            has_content = False
            for chunk in response:
                # Check if chunk has valid text
                if hasattr(chunk, 'text') and chunk.text:
                    has_content = True
                    yield chunk.text
                # Check for safety blocks in streaming
                elif hasattr(chunk, 'candidates') and chunk.candidates:
                    candidate = chunk.candidates[0]
                    if hasattr(candidate, 'finish_reason') and candidate.finish_reason == 2:
                        print(f"[SAFETY] Streaming blocked - USING FALLBACK")
                        # Use fallback response instead of error message
                        yield self._generate_fallback_response(system_prompt, user_message)
                        return

            # If no content was yielded, it might have been blocked - use fallback
            if not has_content:
                print(f"[NO_CONTENT] No content received - USING FALLBACK")
                yield self._generate_fallback_response(system_prompt, user_message)

        except AttributeError as e:
            print(f"[ERROR] Gemini streaming response structure error: {str(e)} - USING FALLBACK")
            yield self._generate_fallback_response(system_prompt, user_message)

        except Exception as e:
            error_msg = str(e).lower()
            print(f"[ERROR] Gemini Streaming API: {str(e)}")

            # Use fallback for safety/blocked errors
            if "blocked" in error_msg or "safety" in error_msg or "finish_reason" in error_msg:
                print(f"[SAFETY_ERROR] Using fallback due to safety block")
                yield self._generate_fallback_response(system_prompt, user_message)
            elif "quota" in error_msg or "limit" in error_msg:
                yield "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút."
            else:
                # For other errors, still use fallback
                print(f"[GENERAL_ERROR] Using fallback due to error")
                yield self._generate_fallback_response(system_prompt, user_message)

    def _generate_openai_stream(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float,
        max_tokens: int
    ):
        """Generate streaming response using OpenAI"""
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            yield f"Lỗi khi gọi OpenAI API: {str(e)}"


def get_ai_handler(provider: Optional[str] = None) -> AIHandler:
    """
    Get AI handler instance

    Args:
        provider: AI provider name. If None, reads from environment

    Returns:
        AIHandler instance
    """
    if provider is None:
        provider = get_env("AI_PROVIDER", "openai")

    return AIHandler(provider=provider)
