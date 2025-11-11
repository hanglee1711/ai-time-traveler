# Create new index.html
html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Việt Sử Ký - Cổng Thời Gian Lịch Sử Việt Nam</title>
   <link rel="stylesheet" href="css/main.css">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f0c29;">
    <!-- HERO SECTION -->
    <section style="min-height: 100vh; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
        <div style="position: relative; z-index: 10; text-align: center; color: #fff; padding: 2rem; max-width: 900px;">
            <h1 style="font-size: 4rem; font-weight: 700; background: linear-gradient(135deg, #d4af37, #ffd700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem;">
                🎭 VIỆT KÝ SỬ
            </h1>
            <p style="font-size: 1.5rem; color: #00d9ff; margin-bottom: 2rem;">
                Cổng Thời Gian Lịch Sử Việt Nam
            </p>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #f5f5dc; margin-bottom: 3rem;">
                Bước qua cổng thời gian, gặp gỡ các anh hùng dân tộc, khám phá những sự kiện lịch sử trọng đại.
                <br>Từ thời Hùng Vương đến hiện đại - hơn 2000 năm lịch sử Việt Nam đang chờ bạn khám phá!
            </p>
            <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                <a href="chatbot.html" style="padding: 1.2rem 2.5rem; font-size: 1.1rem; font-weight: 600; border-radius: 50px; background: linear-gradient(135deg, #d4af37, #ffd700); color: #000; text-decoration: none; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);">
                    💬 Trò chuyện với Lịch sử
                </a>
                <a href="#timeline" style="padding: 1.2rem 2.5rem; font-size: 1.1rem; font-weight: 600; border-radius: 50px; background: rgba(0, 217, 255, 0.1); color: #00d9ff; border: 2px solid #00d9ff; text-decoration: none;">
                    🕰️ Khám phá Timeline
                </a>
            </div>
        </div>
    </section>

    <!-- ERA TIMELINE -->
    <section id="timeline" style="padding: 5rem 2rem; background: linear-gradient(180deg, #24243e, #1a1a2e);">
        <h2 style="text-align: center; font-size: 3rem; color: #d4af37; margin-bottom: 3rem;">🕰️ Các Triều Đại</h2>
        <div style="max-width: 1400px; margin: 0 auto; overflow-x: auto; padding: 2rem 0;">
            <div id="era-timeline" style="display: flex; gap: 2rem; padding: 1rem; min-width: min-content;"></div>
        </div>
    </section>

    <!-- FEATURED FIGURES -->
    <section style="padding: 5rem 2rem; background: linear-gradient(180deg, #1a1a2e, #16213e);">
        <h2 style="text-align: center; font-size: 3rem; color: #d4af37; margin-bottom: 3rem;">👑 Nhân Vật Nổi Bật</h2>
        <div id="figures-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1400px; margin: 0 auto;"></div>
    </section>

    <!-- QUICK ACTIONS -->
    <section style="padding: 5rem 2rem; background: linear-gradient(180deg, #16213e, #0f0c29);">
        <h2 style="text-align: center; font-size: 3rem; color: #d4af37; margin-bottom: 3rem;">🚀 Bắt Đầu Hành Trình</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
            <a href="chatbot.html" style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 3rem 2rem; text-align: center; text-decoration: none; display: block;">
                <div style="font-size: 4rem;">💬</div>
                <h3 style="font-size: 1.5rem; color: #d4af37; margin: 1.5rem 0 1rem;">Trò Chuyện AI</h3>
                <p style="color: #ccc;">Nhập vai và trò chuyện với bất kỳ nhân vật lịch sử nào!</p>
            </a>
            <a href="timeline.html" style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 3rem 2rem; text-align: center; text-decoration: none; display: block;">
                <div style="font-size: 4rem;">🕰️</div>
                <h3 style="font-size: 1.5rem; color: #d4af37; margin: 1.5rem 0 1rem;">Du Hành Thời Gian</h3>
                <p style="color: #ccc;">Nhập năm bất kỳ và khám phá sự kiện lịch sử!</p>
            </a>
            <a href="game.html" style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 3rem 2rem; text-align: center; text-decoration: none; display: block;">
                <div style="font-size: 4rem;">🎮</div>
                <h3 style="font-size: 1.5rem; color: #d4af37; margin: 1.5rem 0 1rem;">Thi Trắc Nghiệm</h3>
                <p style="color: #ccc;">Thách thức kiến thức lịch sử của bạn!</p>
            </a>
        </div>
    </section>

    <script>
        const eras = [
            {icon: '🏺', name: 'Văn Lang - Âu Lạc', period: '2879 TCN - 179 TCN', description: 'Thời kỳ huyền thoại với 18 đời Hùng Vương.'},
            {icon: '⚔️', name: 'Bắc Thuộc', period: '179 TCN - 938', description: '1000 năm đấu tranh bảo vệ bản sắc dân tộc.'},
            {icon: '🏯', name: 'Triều Lý', period: '1009 - 1225', description: 'Thời kỳ thịnh trị, dời đô về Thăng Long.'},
            {icon: '🛡️', name: 'Triều Trần', period: '1225 - 1400', description: 'Ba lần đánh bại quân Mông-Nguyên.'},
            {icon: '🗡️', name: 'Triều Lê', period: '1428 - 1788', description: 'Khởi nghĩa Lam Sơn, thời kỳ hoàng kim.'},
            {icon: '⚡', name: 'Tây Sơn', period: '1778 - 1802', description: 'Quang Trung đại phá quân Thanh.'},
            {icon: '👑', name: 'Triều Nguyễn', period: '1802 - 1945', description: 'Thống nhất đất nước từ Bắc đến Nam.'},
            {icon: '🚩', name: 'Kháng Chiến', period: '1945 - 1975', description: 'Giành độc lập, thống nhất đất nước.'}
        ];

        const el = document.getElementById('era-timeline');
        eras.forEach(era => {
            const d = document.createElement('div');
            d.style.cssText = 'min-width: 300px; background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 2rem; cursor: pointer;';
            d.innerHTML = `<div style="font-size: 3rem;">${era.icon}</div><div style="font-size: 1.5rem; color: #d4af37; margin: 1rem 0 0.5rem;">${era.name}</div><div style="color: #00d9ff; margin-bottom: 1rem;">${era.period}</div><div style="color: #ccc; font-size: 0.9rem;">${era.description}</div>`;
            d.onclick = () => window.location = 'timeline.html';
            el.appendChild(d);
        });

        fetch('http://localhost:5000/api/figures').then(r => r.json()).then(data => {
            const g = document.getElementById('figures-grid');
            (data.figures || []).slice(0, 6).forEach(f => {
                const c = document.createElement('div');
                c.style.cssText = 'background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(0, 217, 255, 0.3); border-radius: 20px; padding: 2rem; text-align: center; cursor: pointer;';
                c.innerHTML = `<div style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem; border: 3px solid #d4af37; overflow: hidden; background: linear-gradient(135deg, #d4af37, #c5a028);"><div style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%;">${f.icon || '👤'}</div></div><div style="font-size: 1.3rem; color: #d4af37; margin-bottom: 0.5rem;">${f.name}</div><div style="color: #00d9ff; margin-bottom: 0.5rem;">${f.period}</div><div style="color: #ccc; font-size: 0.85rem;">${f.description}</div>`;
                c.onclick = () => window.location = `chatbot.html?figure=${encodeURIComponent(f.name)}`;
                g.appendChild(c);
            });
        });
    </script>
</body>
</html>
"""

with open('C:/MINDX/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ Created new index.html!")
