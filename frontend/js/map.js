// ========================================
// MAP.JS - Interactive Historical Map
// VIỆT KÝ SỬ
// ========================================

// Historical Landmarks Data
const historicalLandmarks = [
    // ===== ANCIENT PERIOD (Before 938) =====
    {
        name: "Đền Hùng - Phú Thọ",
        lat: 21.3833,
        lon: 105.2167,
        type: "capital",
        period: "ancient",
        icon: "🏛️",
        year: -2879,
        description: "Nơi thờ các vua Hùng - tổ tiên dân tộc Việt Nam. Nơi khởi nguồn của nền văn hiến Việt.",
        relatedEvents: "Vua Hùng Vương dựng nước (2879 TCN), Lễ hội Đền Hùng 10/3 âm lịch",
        keyFigures: ["Hùng Vương"]
    },
    {
        name: "Cổ Loa - Hà Nội",
        lat: 21.1167,
        lon: 105.8833,
        type: "capital",
        period: "ancient",
        icon: "🏛️",
        year: -257,
        description: "Kinh đô đầu tiên của nước Âu Lạc do An Dương Vương xây dựng (257 TCN). Thành quách đồ sộ với ba vòng thành lũy.",
        relatedEvents: "An Dương Vương dựng nước Âu Lạc (257 TCN)",
        keyFigures: ["An Dương Vương", "Mỵ Châu", "Trọng Thủy"]
    },
    {
        name: "Lũng Khê - Mê Linh",
        lat: 21.1833,
        lon: 105.7333,
        type: "landmark",
        period: "ancient",
        icon: "📍",
        description: "Quê hương Hai Bà Trưng - nơi khởi binh chống Bắc thuộc năm 40. Biểu tượng tinh thần bất khuất của phụ nữ Việt.",
        relatedEvents: "Khởi nghĩa Hai Bà Trưng (40-43)",
        keyFigures: ["Trưng Trắc", "Trưng Nhị"]
    },
    {
        name: "Sông Nhị Hà - Thanh Hóa",
        lat: 19.8000,
        lon: 105.7833,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Nơi Hai Bà Trưng tự vẫn sau khi thất bại trước quân Mã Viện năm 43. Dòng sông lịch sử ghi dấu sự hy sinh anh dũng.",
        relatedEvents: "Hai Bà Trưng tự vẫn (43)",
        keyFigures: ["Trưng Trắc", "Trưng Nhị", "Mã Viện"]
    },
    {
        name: "Luy Lâu - Bắc Ninh",
        lat: 21.1667,
        lon: 106.1000,
        type: "monument",
        period: "ancient",
        icon: "🏰",
        description: "Trung tâm hành chính và văn hóa thời Bắc thuộc. Nơi phát triển Phật giáo đầu tiên tại Việt Nam.",
        relatedEvents: "Thời Bắc thuộc (111 TCN - 939)",
        keyFigures: ["Sĩ Nhiếp"]
    },
    {
        name: "Núi Đọi - Thanh Hóa",
        lat: 19.5833,
        lon: 105.4667,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Căn cứ của Lý Bôn khi khởi nghĩa chống nhà Lương năm 542. Nơi lập nước Vạn Xuân - nhà nước độc lập đầu tiên.",
        relatedEvents: "Khởi nghĩa Lý Bôn (542-547)",
        keyFigures: ["Lý Bôn", "Triệu Quang Phục"]
    },
    {
        name: "Bình Định - Bình Định",
        lat: 13.7667,
        lon: 109.2167,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Căn cứ của Mai Hắc Đế - người kế tục sự nghiệp Lý Bôn chống Bắc thuộc.",
        relatedEvents: "Mai Hắc Đế kháng chiến (548-550)",
        keyFigures: ["Mai Hắc Đế"]
    },
    {
        name: "Bạch Hạc - Hà Nội",
        lat: 21.0500,
        lon: 105.8000,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Nơi Phùng Hưng khởi nghĩa chống nhà Đường năm 791, tự xưng là Bố Cái Đại Vương.",
        relatedEvents: "Khởi nghĩa Phùng Hưng (791-798)",
        keyFigures: ["Phùng Hưng"]
    },
    {
        name: "Sông Bạch Đằng - Quảng Ninh",
        lat: 20.9667,
        lon: 106.8167,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Địa điểm ba trận Bạch Đằng lịch sử (938, 981, 1288). Ngô Quyền dùng cọc ngầm đánh thắng quân Nam Hán.",
        relatedEvents: "Ngô Quyền đánh thắng quân Nam Hán (938)",
        keyFigures: ["Ngô Quyền"]
    },
    {
        name: "Đại La - Hà Nội",
        lat: 21.0200,
        lon: 105.8500,
        type: "capital",
        period: "ancient",
        icon: "🏛️",
        description: "Kinh đô thời Nam Hán cai trị. Trước khi Ngô Quyền giành độc lập năm 938.",
        relatedEvents: "Thời Bắc thuộc (938)",
        keyFigures: []
    },
    {
        name: "Kim Liên - Thanh Hóa",
        lat: 19.7500,
        lon: 105.5833,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Nơi quân dân chống lại sự cai trị của nhà Đường. Phong trào giải phóng thế kỷ 8.",
        relatedEvents: "Kháng chiến chống Đường (700-800)",
        keyFigures: ["Mai Thúc Loan"]
    },
    {
        name: "Võ Ninh - Nam Định",
        lat: 20.4167,
        lon: 106.1667,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Căn cứ của Mai Thúc Loan - vua đen khởi nghĩa chống Đường năm 722.",
        relatedEvents: "Khởi nghĩa Mai Thúc Loan (722)",
        keyFigures: ["Mai Thúc Loan", "Mai Hắc Đế"]
    },
    {
        name: "Dinh Mộ - Hà Nội",
        lat: 21.0400,
        lon: 105.8200,
        type: "monument",
        period: "ancient",
        icon: "🏰",
        description: "Quần thể đền thờ các danh nhân thời Bắc thuộc và độc lập.",
        relatedEvents: "Thời Bắc thuộc",
        keyFigures: []
    },
    {
        name: "Sông Cái - Ninh Bình",
        lat: 20.2000,
        lon: 105.9500,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Trận thủy chiến chống quân Lương năm 545. Triệu Quang Phục chiến thắng.",
        relatedEvents: "Triệu Quang Phục kháng Lương (545-547)",
        keyFigures: ["Triệu Quang Phục"]
    },
    {
        name: "Khu Lâm - Nam Định",
        lat: 20.3500,
        lon: 106.1000,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Nơi quân Lý Bôn đóng quân khi kháng chiến chống Lương thế kỷ 6.",
        relatedEvents: "Lý Bôn chống Lương (542-547)",
        keyFigures: ["Lý Bôn"]
    },
    {
        name: "Tống Bình - Quảng Ninh",
        lat: 21.0000,
        lon: 107.0000,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Vùng biên giới chống xâm lược thời Bắc thuộc. Phòng tuyến quan trọng.",
        relatedEvents: "Phòng thủ biên giới",
        keyFigures: []
    },
    {
        name: "Long Biên - Hà Nội",
        lat: 21.0450,
        lon: 105.8600,
        type: "landmark",
        period: "ancient",
        icon: "📍",
        description: "Tên gọi cổ của Thăng Long - Hà Nội. Trung tâm hành chính thời Đường cai trị.",
        relatedEvents: "Thời Bắc thuộc Đường (618-907)",
        keyFigures: ["Cao Biền"]
    },
    {
        name: "Ải Chi Lăng - Lạng Sơn",
        lat: 21.8333,
        lon: 106.7500,
        type: "battlefield",
        period: "ancient",
        icon: "⚔️",
        description: "Cửa ải chiến lược từ thời cổ đại. Nơi nhiều trận đánh lịch sử diễn ra.",
        relatedEvents: "Các triều đại bảo vệ biên giới",
        keyFigures: []
    },

    // ===== MEDIEVAL PERIOD (938-1858) =====
    {
        name: "Thăng Long (Hà Nội)",
        lat: 21.0285,
        lon: 105.8542,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Kinh đô của Đại Việt từ năm 1010, do vua Lý Thái Tổ dời đô từ Hoa Lư. Trung tâm chính trị - văn hóa hơn 1000 năm.",
        relatedEvents: "Lý Công Uẩn dời đô ra Thăng Long (1010)",
        keyFigures: ["Lý Công Uẩn", "Lý Thường Kiệt", "Trần Thủ Độ"]
    },
    {
        name: "Hoa Lư - Ninh Bình",
        lat: 20.2547,
        lon: 105.9367,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Kinh đô đầu tiên của nhà nước độc lập Đại Cồ Việt (968-1010). Nơi Đinh Tiên Hoàng và Lê Đại Hành trị vì.",
        relatedEvents: "Đinh Bộ Lĩnh xưng đế lập nước Đại Cồ Việt (968)",
        keyFigures: ["Đinh Tiên Hoàng", "Lê Đại Hành"]
    },
    {
        name: "Cửa Ải Nam - Lạng Sơn",
        lat: 21.8500,
        lon: 106.7667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi Lý Thường Kiệt khai quật chiến hào, đánh thắng quân Tống năm 1075-1077. Chiến thắng vang dội thời Lý.",
        relatedEvents: "Lý Thường Kiệt đánh thắng quân Tống (1077)",
        keyFigures: ["Lý Thường Kiệt"]
    },
    {
        name: "Núi Chí Linh - Hải Dương",
        lat: 20.9333,
        lon: 106.4000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Địa điểm trận địa quan trọng trong cuộc kháng chiến chống Nguyên Mông. Quân Trần đã mai phục đánh tan quân giặc.",
        relatedEvents: "Trận Chí Linh - Trần Hưng Đạo đánh bại Nguyên (1285)",
        keyFigures: ["Trần Hưng Đạo", "Trần Quang Khải"]
    },
    {
        name: "Tây Kết - Thanh Hóa",
        lat: 20.1667,
        lon: 105.5000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến lịch sử giữa Lê Lợi và quân Minh. Nơi Lê Lợi ban Bình Ngô đại cáo sau khi đánh thắng.",
        relatedEvents: "Lê Lợi khởi nghĩa Lam Sơn (1418-1427)",
        keyFigures: ["Lê Lợi", "Nguyễn Trãi"]
    },
    {
        name: "Lam Kinh - Thanh Hóa",
        lat: 19.6500,
        lon: 105.3833,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Quê hương Lê Lợi - nơi khởi nghĩa Lam Sơn (1418). Di tích lịch sử quan trọng thời Lê sơ.",
        relatedEvents: "Khởi nghĩa Lam Sơn (1418-1427)",
        keyFigures: ["Lê Lợi", "Nguyễn Trãi"]
    },
    {
        name: "Sông Bạch Đằng - Lần 2",
        lat: 20.9700,
        lon: 106.8200,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận Bạch Đằng lần 2 năm 981. Lê Hoàn đánh bại quân Tống xâm lược.",
        relatedEvents: "Lê Hoàn đánh thắng quân Tống (981)",
        keyFigures: ["Lê Hoàn"]
    },
    {
        name: "Sông Bạch Đằng - Lần 3",
        lat: 20.9650,
        lon: 106.8150,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận Bạch Đằng lần 3 năm 1288. Trần Hưng Đạo đại phá quân Nguyên Mông, kết thúc ba lần xâm lược.",
        relatedEvents: "Trận Bạch Đằng đại thắng (1288)",
        keyFigures: ["Trần Hưng Đạo", "Trần Quốc Tuấn"]
    },
    {
        name: "Núi Tô Vạn - Hà Nội",
        lat: 21.0167,
        lon: 105.8667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến năm 1285 giữa quân Trần và Nguyên Mông. Trần Nhật Duật hy sinh anh dũng.",
        relatedEvents: "Chiến dịch chống Nguyên lần 2 (1285)",
        keyFigures: ["Trần Nhật Duật", "Trần Hưng Đạo"]
    },
    {
        name: "Đông Bộ Đầu - Hải Dương",
        lat: 20.8833,
        lon: 106.3500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Căn cứ quân Trần trong kháng chiến chống Nguyên. Nơi tập kết và huấn luyện quân đội.",
        relatedEvents: "Kháng chiến chống Nguyên (1258-1288)",
        keyFigures: ["Trần Quốc Tuấn"]
    },
    {
        name: "Vạn Kiếp - Bắc Ninh",
        lat: 21.1333,
        lon: 106.0833,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến quan trọng năm 1285. Quân Trần mai phục đánh tan quân Nguyên.",
        relatedEvents: "Chiến thắng Vạn Kiếp (1285)",
        keyFigures: ["Trần Hưng Đạo"]
    },
    {
        name: "Chùa Một Cột - Hà Nội",
        lat: 21.0356,
        lon: 105.8336,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Ngôi chùa độc đáo được xây dựng năm 1049 dưới triều Lý Thái Tông. Biểu tượng kiến trúc Việt Nam.",
        relatedEvents: "Vua Lý Thái Tông xây dựng (1049)",
        keyFigures: ["Lý Thái Tông"]
    },
    {
        name: "Văn Miếu Quốc Tử Giám - Hà Nội",
        lat: 21.0278,
        lon: 105.8358,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Trường đại học đầu tiên của Việt Nam (1070). Nơi thờ Khổng Tử và các bậc hiền tài.",
        relatedEvents: "Lý Thánh Tông xây dựng (1070)",
        keyFigures: ["Lý Thánh Tông", "Chu Văn An"]
    },
    {
        name: "Tam Điệp - Ninh Bình",
        lat: 20.1833,
        lon: 105.9000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi quân Lê Lợi đánh thắng quân Minh năm 1426. Trận thắng quan trọng trong khởi nghĩa Lam Sơn.",
        relatedEvents: "Chiến thắng Tam Điệp (1426)",
        keyFigures: ["Lê Lợi", "Lê Lai"]
    },
    {
        name: "Xương Giang - Bắc Giang",
        lat: 21.2667,
        lon: 106.1833,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận đại thắng quân Minh năm 1427. Kết thúc khởi nghĩa Lam Sơn với thắng lợi hoàn toàn.",
        relatedEvents: "Chiến thắng Xương Giang (1427)",
        keyFigures: ["Lê Lợi"]
    },
    {
        name: "Chí Linh - Hải Dương",
        lat: 21.1333,
        lon: 106.4000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Thắng lợi vang dội của Trần Hưng Đạo chống quân Nguyên năm 1285.",
        relatedEvents: "Trận Chí Linh (1285)",
        keyFigures: ["Trần Hưng Đạo"]
    },
    {
        name: "Tây Đô - Thanh Hóa",
        lat: 19.8167,
        lon: 105.7667,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Kinh đô phía Tây thời Hồ Quý Ly (1397-1407). Thành quách đá vôi kiên cố.",
        relatedEvents: "Nhà Hồ thiết lập Tây Đô (1397)",
        keyFigures: ["Hồ Quý Ly"]
    },
    {
        name: "Giao Châu - Bắc Giang",
        lat: 21.2833,
        lon: 106.1833,
        type: "landmark",
        period: "medieval",
        icon: "📍",
        description: "Vùng đất quan trọng thời Lý - Trần. Nơi phát triển nông nghiệp và thủ công nghiệp.",
        relatedEvents: "Phát triển kinh tế thời Lý - Trần",
        keyFigures: []
    },
    {
        name: "Bình Lệ Nguyên - Hải Dương",
        lat: 20.9500,
        lon: 106.3800,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến năm 1077 giữa Lý Thường Kiệt và quân Tống. Thắng lợi vang dội.",
        relatedEvents: "Chiến thắng Như Nguyệt (1077)",
        keyFigures: ["Lý Thường Kiệt"]
    },
    {
        name: "Đại Hành - Hưng Yên",
        lat: 20.8500,
        lon: 106.0667,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Kinh đô tạm thời thời Tiền Lê (980-1009) trước khi dời đô ra Thăng Long.",
        relatedEvents: "Nhà Tiền Lê (980-1009)",
        keyFigures: ["Lê Đại Hành"]
    },
    {
        name: "Thiên Trường - Ninh Bình",
        lat: 20.3000,
        lon: 105.9500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi Đinh Tiên Hoàng đánh dẹp 12 sứ quân, thống nhất đất nước năm 968.",
        relatedEvents: "Đinh Bộ Lĩnh thống nhất (968)",
        keyFigures: ["Đinh Tiên Hoàng"]
    },
    {
        name: "Côn Sơn - Hải Dương",
        lat: 20.9833,
        lon: 106.4667,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Núi linh thiêng với chùa Côn Sơn - Kiếp Bạc. Nơi Trần Hưng Đạo tu hành.",
        relatedEvents: "Trần Hưng Đạo tu hành tại đây",
        keyFigures: ["Trần Hưng Đạo"]
    },
    {
        name: "Phủ Giày - Hà Nội",
        lat: 21.0100,
        lon: 105.8400,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Khu vực hoàng cung triều Lý - Trần. Trung tâm quyền lực thời phong kiến.",
        relatedEvents: "Triều Lý - Trần (1010-1400)",
        keyFigures: []
    },
    {
        name: "Đại Việt Quốc - Hà Nội",
        lat: 21.0280,
        lon: 105.8540,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Tên nước Đại Việt được Lý Thánh Tông đặt năm 1054. Biểu tượng độc lập tự chủ.",
        relatedEvents: "Đổi tên nước thành Đại Việt (1054)",
        keyFigures: ["Lý Thánh Tông"]
    },
    {
        name: "Hàm Tử - Hưng Yên",
        lat: 20.8667,
        lon: 106.0667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến chống quân Tống năm 1076. Lý Thường Kiệt thắng lợi.",
        relatedEvents: "Kháng chiến chống Tống (1075-1077)",
        keyFigures: ["Lý Thường Kiệt"]
    },
    {
        name: "Yên Mô - Ninh Bình",
        lat: 20.3167,
        lon: 105.9667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi quân Trần mai phục đánh quân Nguyên trong chiến dịch 1285.",
        relatedEvents: "Kháng chiến chống Nguyên (1285)",
        keyFigures: ["Trần Hưng Đạo"]
    },
    {
        name: "Đa Phúc - Hà Nội",
        lat: 21.0667,
        lon: 105.9000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận địa chống quân Nguyên năm 1285. Quân Trần chiến thắng.",
        relatedEvents: "Chiến dịch chống Nguyên lần 2 (1285)",
        keyFigures: []
    },
    {
        name: "Tức Mặc - Nam Định",
        lat: 20.4500,
        lon: 106.1500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi quân Trần đánh bại quân Nguyên trong chiến dịch 1288.",
        relatedEvents: "Kháng chiến chống Nguyên (1288)",
        keyFigures: ["Trần Quang Khải"]
    },
    {
        name: "Đông Kinh - Hà Nội",
        lat: 21.0285,
        lon: 105.8542,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Tên gọi Thăng Long thời Lê - Trịnh (1430-1789). Trung tâm Bắc Hà.",
        relatedEvents: "Thời Lê Trung Hưng (1533-1789)",
        keyFigures: ["Lê Lợi"]
    },
    {
        name: "Phú Xuân - Huế",
        lat: 16.4637,
        lon: 107.5909,
        type: "capital",
        period: "medieval",
        icon: "🏛️",
        description: "Kinh đô chúa Nguyễn (1636-1775). Tiền thân của kinh đô Huế.",
        relatedEvents: "Chúa Nguyễn đặt đô (1636)",
        keyFigures: ["Nguyễn Hoàng"]
    },
    {
        name: "Tây Sơn - Bình Định",
        lat: 13.9500,
        lon: 109.0833,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi khởi nghĩa Tây Sơn bắt đầu năm 1771. Phong trào nông dân vĩ đại.",
        relatedEvents: "Khởi nghĩa Tây Sơn (1771-1802)",
        keyFigures: ["Nguyễn Nhạc", "Nguyễn Huệ", "Nguyễn Lữ"]
    },
    {
        name: "Rạch Gầm - Tiền Giang",
        lat: 10.2833,
        lon: 106.3500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận thủy chiến năm 1785. Quân Tây Sơn đại thắng quân Xiêm.",
        relatedEvents: "Chiến thắng Rạch Gầm - Xoài Mút (1785)",
        keyFigures: ["Nguyễn Huệ"]
    },
    {
        name: "Xoài Mút - Tiền Giang",
        lat: 10.3000,
        lon: 106.3667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận thủy chiến tiếp theo sau Rạch Gầm. Tiêu diệt hoàn toàn quân Xiêm.",
        relatedEvents: "Chiến thắng Rạch Gầm - Xoài Mút (1785)",
        keyFigures: ["Nguyễn Huệ"]
    },
    {
        name: "Hải Vân Quan - Đà Nẵng",
        lat: 16.1967,
        lon: 108.1250,
        type: "landmark",
        period: "medieval",
        icon: "📍",
        description: "Cửa ải chia cắt Bắc Nam. Ranh giới giữa chúa Trịnh và chúa Nguyễn.",
        relatedEvents: "Phân tranh Trịnh - Nguyễn (1627-1672)",
        keyFigures: []
    },
    {
        name: "Đại Nội Huế",
        lat: 16.4673,
        lon: 107.5782,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Hoàng cung triều Nguyễn xây từ 1804. Kiến trúc cung đình hoành tráng.",
        relatedEvents: "Xây dựng Hoàng thành Huế (1804-1833)",
        keyFigures: ["Gia Long", "Minh Mạng"]
    },
    {
        name: "Chi Lăng - Lạng Sơn",
        lat: 21.8500,
        lon: 106.7500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Lê Lợi mai phục đánh quân Minh năm 1427. Thắng lợi quyết định.",
        relatedEvents: "Chiến thắng Chi Lăng (1427)",
        keyFigures: ["Lê Lợi", "Lê Lai"]
    },
    {
        name: "Đa Bang - Hưng Yên",
        lat: 20.8833,
        lon: 106.0500,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Quân Lê Lợi đánh tan quân Minh năm 1426. Trận thắng quan trọng.",
        relatedEvents: "Khởi nghĩa Lam Sơn (1426)",
        keyFigures: ["Lê Lợi"]
    },
    {
        name: "Thanh Oai - Hà Nội",
        lat: 20.8667,
        lon: 105.7833,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Trận chiến chống quân Minh trong khởi nghĩa Lam Sơn.",
        relatedEvents: "Khởi nghĩa Lam Sơn (1418-1427)",
        keyFigures: ["Lê Lợi"]
    },
    {
        name: "Gia Lâm - Hà Nội",
        lat: 21.0333,
        lon: 105.9667,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Quân Lê Lợi giải phóng năm 1426. Bước tiến quan trọng vào Thăng Long.",
        relatedEvents: "Giải phóng Thăng Long (1427)",
        keyFigures: ["Lê Lợi"]
    },
    {
        name: "Khuê Thượng - Bắc Giang",
        lat: 21.2500,
        lon: 106.2000,
        type: "battlefield",
        period: "medieval",
        icon: "⚔️",
        description: "Nơi Trần Hưng Đạo tập hợp quân đội chống Nguyên năm 1285.",
        relatedEvents: "Chiến dịch chống Nguyên (1285)",
        keyFigures: ["Trần Hưng Đạo"]
    },
    {
        name: "Thăng Long Hoàng Thành",
        lat: 21.0287,
        lon: 105.8350,
        type: "monument",
        period: "medieval",
        icon: "🏰",
        description: "Di sản thế giới UNESCO. Trung tâm quyền lực 13 thế kỷ liên tục.",
        relatedEvents: "Hoàng thành các triều đại (1010-1945)",
        keyFigures: []
    },

    // ===== MODERN PERIOD (1858-1945) =====
    {
        name: "Phố Hiến - Hưng Yên",
        lat: 20.8667,
        lon: 106.0500,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Thương cảng sầm uất thời Lê - Trịnh. Nơi giao thương văn hóa quốc tế quan trọng.",
        relatedEvents: "Thương cảng phát triển thời Lê Trung흥",
        keyFigures: []
    },
    {
        name: "Ngọc Hồi - Đống Đa - Hà Nội",
        lat: 21.0028,
        lon: 105.8269,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Nơi diễn ra trận Ngọc Hồi - Đống Đa (1789). Quang Trung đại phá 29 vạn quân Thanh trong 5 ngày Tết.",
        relatedEvents: "Chiến thắng Ngọc Hồi - Đống Đa (1789)",
        keyFigures: ["Quang Trung"]
    },
    {
        name: "Huế - Thừa Thiên Huế",
        lat: 16.4637,
        lon: 107.5909,
        type: "capital",
        period: "modern",
        icon: "🏛️",
        description: "Kinh đô của triều Nguyễn (1802-1945). Di sản văn hóa thế giới với Đại Nội, Hoàng thành.",
        relatedEvents: "Nguyễn Ánh thống nhất đất nước (1802)",
        keyFigures: ["Gia Long", "Minh Mạng", "Tự Đức"]
    },
    {
        name: "Pháo Đài Cửa Biển - Đà Nẵng",
        lat: 16.0544,
        lon: 108.2272,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Nơi thực dân Pháp tấn công vào năm 1858, mở đầu cuộc xâm lược Việt Nam.",
        relatedEvents: "Pháp tấn công Đà Nẵng (1858)",
        keyFigures: []
    },
    {
        name: "Cầu Giấy - Hà Nội",
        lat: 21.0333,
        lon: 105.7833,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Trận đánh giữa quân dân Việt Nam và quân Pháp năm 1873. Nơi Đại tá Pháp Francis Garnier tử trận.",
        relatedEvents: "Kháng chiến chống Pháp (1858-1884)",
        keyFigures: ["Nguyễn Tri Phương", "Hoàng Diệu"]
    },
    {
        name: "Thành Kinh Thành Huế",
        lat: 16.4679,
        lon: 107.5760,
        type: "capital",
        period: "modern",
        icon: "🏛️",
        description: "Hoàng thành triều Nguyễn, xây dựng từ 1804. Trung tâm quyền lực cuối cùng của chế độ phong kiến Việt Nam.",
        relatedEvents: "Hoàng thành Huế (1804-1945)",
        keyFigures: ["Gia Long", "Tự Đức"]
    },
    {
        name: "Yên Thế - Bắc Giang",
        lat: 21.5167,
        lon: 106.5500,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Căn cứ của Hoàng Hoa Thám chống Pháp suốt 27 năm (1884-1913). Biểu tượng tinh thần bất khuất.",
        relatedEvents: "Khởi nghĩa Yên Thế (1884-1913)",
        keyFigures: ["Hoàng Hoa Thám", "Đề Thám"]
    },
    {
        name: "Vũng Tàu",
        lat: 10.3460,
        lon: 107.0843,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Nơi Pháp xâm chiếm năm 1859. Cảng biển quan trọng thời thuộc địa.",
        relatedEvents: "Pháp chiếm Vũng Tàu (1859)",
        keyFigures: []
    },
    {
        name: "Hải Dương - Thành Phố",
        lat: 20.9373,
        lon: 106.3250,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Nơi nghĩa quân Cần Vương đánh quân Pháp cuối thế kỷ 19.",
        relatedEvents: "Phong trào Cần Vương (1885-1896)",
        keyFigures: ["Phan Đình Phùng", "Nguyễn Thiện Thuật"]
    },
    {
        name: "Hương Khê - Hà Tĩnh",
        lat: 18.2167,
        lon: 105.8167,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Căn cứ của Phan Đình Phùng trong phong trào Cần Vương. Nơi kháng chiến oanh liệt chống Pháp.",
        relatedEvents: "Phan Đình Phùng kháng Pháp (1885-1896)",
        keyFigures: ["Phan Đình Phùng"]
    },
    {
        name: "Cao Bằng",
        lat: 22.6667,
        lon: 106.2667,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Vùng biên giới quan trọng. Nơi nhiều phong trào yêu nước diễn ra đầu thế kỷ 20.",
        relatedEvents: "Phong trào yêu nước đầu thế kỷ 20",
        keyFigures: []
    },
    {
        name: "Nhà Tù Côn Đảo",
        lat: 8.6833,
        lon: 106.6000,
        type: "monument",
        period: "modern",
        icon: "🏰",
        description: "Nhà tù khét tiếng thời Pháp thuộc. Nơi giam giữ và tra tấn các chiến sĩ cách mạng.",
        relatedEvents: "Nhà tù Côn Đảo (1862-1975)",
        keyFigures: ["Võ Thị Sáu", "Trần Phú"]
    },
    {
        name: "Tràng An - Hạ Long",
        lat: 20.9000,
        lon: 106.9833,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Vùng ven biển nơi quân dân kháng chiến chống thực dân Pháp.",
        relatedEvents: "Kháng chiến chống Pháp (1945-1954)",
        keyFigures: []
    },
    {
        name: "Bắc Giang Thành",
        lat: 21.2733,
        lon: 106.1950,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Thành trì quan trọng trong các cuộc khởi nghĩa chống Pháp cuối thế kỷ 19.",
        relatedEvents: "Phong trào Cần Vương",
        keyFigures: []
    },
    {
        name: "Gia Định (Sài Gòn)",
        lat: 10.7769,
        lon: 106.7009,
        type: "capital",
        period: "modern",
        icon: "🏛️",
        description: "Trung tâm Nam Bộ. Pháp chiếm đóng năm 1859 và biến thành trung tâm thuộc địa.",
        relatedEvents: "Pháp chiếm Gia Định (1859)",
        keyFigures: []
    },
    {
        name: "Pác Bó - Cao Bằng",
        lat: 22.7833,
        lon: 106.3500,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Nơi Hồ Chí Minh trở về nước năm 1941 sau 30 năm đi tìm đường cứu nước.",
        relatedEvents: "Bác Hồ về nước (1941)",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Nghệ Tĩnh - Nghệ An",
        lat: 19.0000,
        lon: 105.6000,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Phong trào Nghệ Tĩnh Xô Viết 1930-1931. Phong trào cách mạng lớn nhất thời Pháp thuộc.",
        relatedEvents: "Phong trào Nghệ Tĩnh Xô Viết (1930-1931)",
        keyFigures: []
    },
    {
        name: "Hòa Bình - Hòa Bình",
        lat: 20.8167,
        lon: 105.3333,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Vùng căn cứ kháng chiến chống Pháp. Chiến dịch Hòa Bình 1951-1952.",
        relatedEvents: "Chiến dịch Hòa Bình (1951-1952)",
        keyFigures: ["Võ Nguyên Giáp"]
    },
    {
        name: "Sơn La",
        lat: 21.3250,
        lon: 103.9167,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Căn cứ kháng chiến quan trọng. Nhà tù Sơn La giam giữ các chiến sĩ yêu nước.",
        relatedEvents: "Kháng chiến chống Pháp",
        keyFigures: ["Tô Hiệu"]
    },
    {
        name: "Mỹ Tho - Tiền Giang",
        lat: 10.3500,
        lon: 106.3667,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Trung tâm miền Tây Nam Bộ. Nơi phát triển phong trào yêu nước đầu thế kỷ 20.",
        relatedEvents: "Phong trào Đông Du, Duy Tân",
        keyFigures: []
    },
    {
        name: "Bến Tre",
        lat: 10.2333,
        lon: 106.3750,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Đất nước dừa - vùng cách mạng kiên cường. Nơi nhiều phong trào yêu nước.",
        relatedEvents: "Phong trào cách mạng Nam Bộ",
        keyFigures: []
    },
    {
        name: "Trà Vinh",
        lat: 9.9333,
        lon: 106.3333,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Vùng đất ba dân tộc. Cách mạng đồng bào Khmer - Kinh - Hoa cùng phấn đấu.",
        relatedEvents: "Cách mạng Nam Bộ",
        keyFigures: []
    },
    {
        name: "Lạng Sơn Thành",
        lat: 21.8500,
        lon: 106.7667,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Thành trì biên giới. Quân dân kháng chiến chống Pháp và Trung Quốc.",
        relatedEvents: "Kháng chiến chống Pháp (1945-1954)",
        keyFigures: []
    },
    {
        name: "Móng Cái - Quảng Ninh",
        lat: 21.5167,
        lon: 107.9667,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Cửa khẩu biên giới Việt - Trung. Nơi giao thương và kháng chiến.",
        relatedEvents: "Biên giới phía Bắc",
        keyFigures: []
    },
    {
        name: "Lai Châu",
        lat: 22.3833,
        lon: 103.4667,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Căn cứ địa Tây Bắc. Quân dân các dân tộc kháng chiến chống Pháp.",
        relatedEvents: "Kháng chiến Tây Bắc",
        keyFigures: []
    },
    {
        name: "Nam Định Thành",
        lat: 20.4167,
        lon: 106.1667,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Thành phố công nghiệp đầu tiên Việt Nam. Phong trào công nhân mạnh mẽ.",
        relatedEvents: "Phong trào công nhân (1920-1945)",
        keyFigures: []
    },
    {
        name: "Hải Phòng",
        lat: 20.8650,
        lon: 106.6833,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Cảng biển lớn nhất miền Bắc. Khởi đầu kháng chiến chống Pháp 19/12/1946.",
        relatedEvents: "Toàn quốc kháng chiến (19/12/1946)",
        keyFigures: []
    },
    {
        name: "Hà Giang",
        lat: 22.8333,
        lon: 104.9833,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Vùng cao biên giới. Căn cứ địa cách mạng vùng cao thời kháng Pháp.",
        relatedEvents: "Căn cứ Việt Bắc",
        keyFigures: []
    },
    {
        name: "Tuyên Quang",
        lat: 21.8167,
        lon: 105.2167,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Căn cứ Trung ương Đảng và Chính phủ kháng chiến. ATK Tuyên Quang - Thái Nguyên - Bắc Kạn.",
        relatedEvents: "Căn cứ Việt Bắc (1945-1954)",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Thái Nguyên",
        lat: 21.5667,
        lon: 105.8333,
        type: "battlefield",
        period: "modern",
        icon: "⚔️",
        description: "Khởi nghĩa Thái Nguyên 1917 - bước đột phá phong trào yêu nước. ATK Việt Bắc.",
        relatedEvents: "Khởi nghĩa Thái Nguyên (1917)",
        keyFigures: ["Hoàng Hoa Thám"]
    },
    {
        name: "Bắc Kạn",
        lat: 22.1500,
        lon: 105.8333,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "ATK Việt Bắc - nơi Đại hội Đảng toàn quốc lần II họp năm 1951.",
        relatedEvents: "Đại hội Đảng lần II (1951)",
        keyFigures: []
    },
    {
        name: "Chợ Mới - An Giang",
        lat: 10.4500,
        lon: 105.4833,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Vùng biên giới Tây Nam. Căn cứ cách mạng Nam Bộ giai đoạn 1930-1945.",
        relatedEvents: "Phong trào cách mạng Nam Bộ",
        keyFigures: []
    },
    {
        name: "Rạch Giá - Kiên Giang",
        lat: 10.0167,
        lon: 105.0833,
        type: "landmark",
        period: "modern",
        icon: "📍",
        description: "Cảng biển Tây Nam. Nơi phát triển phong trào cách mạng đầu thế kỷ 20.",
        relatedEvents: "Phong trào Nam Bộ",
        keyFigures: []
    },

    // ===== CONTEMPORARY PERIOD (1945-Present) =====
    {
        name: "Làng Sen - Kim Liên - Nghệ An",
        lat: 18.9833,
        lon: 105.6167,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Quê hương Chủ tịch Hồ Chí Minh. Di tích lịch sử quan trọng của dân tộc.",
        relatedEvents: "Sinh nhật Bác Hồ (19/5/1890)",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Nhà Sàn Bác Hồ - Hà Nội",
        lat: 21.0369,
        lon: 105.8341,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Nơi Chủ tịch Hồ Chí Minh sinh sống và làm việc (1958-1969). Biểu tượng giản dị, gần gũi của Bác.",
        relatedEvents: "Bác Hồ sống và làm việc tại đây",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Quảng Trường Ba Đình - Hà Nội",
        lat: 21.0369,
        lon: 105.8341,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Nơi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945. Nơi thiêng liêng của dân tộc.",
        relatedEvents: "Tuyên ngôn Độc lập (2/9/1945)",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Điện Biên Phủ",
        lat: 21.3833,
        lon: 103.0167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến trường lịch sử - chiến thắng 'Điện Biên Phủ trên không' và chiến thắng Điện Biên Phủ 1954. Lừng lẫy năm châu, chấn động địa cầu.",
        relatedEvents: "Chiến thắng Điện Biên Phủ (7/5/1954)",
        keyFigures: ["Võ Nguyên Giáp", "Hồ Chí Minh"]
    },
    {
        name: "Thành cổ Quảng Trị",
        lat: 16.8167,
        lon: 107.1000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Biểu tượng của sự hy sinh anh dũng trong kháng chiến chống Mỹ. 81 ngày đêm chiến đấu quyết liệt năm 1972.",
        relatedEvents: "Chiến dịch Quảng Trị (1972)",
        keyFigures: []
    },
    {
        name: "Dinh Độc Lập (Thống Nhất) - Sài Gòn",
        lat: 10.7769,
        lon: 106.6955,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Nơi kết thúc chiến tranh Việt Nam ngày 30/4/1975. Biểu tượng của hòa bình và thống nhất đất nước.",
        relatedEvents: "Giải phóng miền Nam, thống nhất đất nước (30/4/1975)",
        keyFigures: []
    },
    {
        name: "Cầu Long Biên - Hà Nội",
        lat: 21.0447,
        lon: 105.8597,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Cây cầu lịch sử bắc qua sông Hồng (1899-1902). Chứng nhân nhiều thời kỳ lịch sử Việt Nam.",
        relatedEvents: "Kháng chiến chống Pháp, chống Mỹ",
        keyFigures: []
    },
    {
        name: "Bảo tàng Hồ Chí Minh - Hà Nội",
        lat: 21.0369,
        lon: 105.8341,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Bảo tàng tưởng nhớ cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh. Kiến trúc độc đáo, hiện đại.",
        relatedEvents: "Kỷ niệm 100 năm ngày sinh Bác Hồ (1990)",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Vũng Rô - Phú Yên",
        lat: 13.0833,
        lon: 109.3500,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Nơi đánh chìm tàu vận tải vũ khí Mỹ năm 1965. Thắng lợi quan trọng trên biển.",
        relatedEvents: "Trận Vũng Rô (1965)",
        keyFigures: []
    },
    {
        name: "Khe Sanh - Quảng Trị",
        lat: 16.6167,
        lon: 106.7167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Căn cứ quân sự chiến lược. Chiến dịch Khe Sanh năm 1968 - một trong những trận đánh khốc liệt nhất.",
        relatedEvents: "Chiến dịch Khe Sanh (1968)",
        keyFigures: []
    },
    {
        name: "Đường Hồ Chí Minh",
        lat: 16.0000,
        lon: 106.5000,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Tuyến đường huyết mạch vận chuyển quân và vật tư chi viện cho chiến trường miền Nam.",
        relatedEvents: "Đường Trường Sơn - Đường Hồ Chí Minh (1959-1975)",
        keyFigures: ["Võ Nguyên Giáp", "Đồng Sĩ Nguyên"]
    },
    {
        name: "Vinh Mốc - Quảng Trị",
        lat: 17.1333,
        lon: 107.2000,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Hệ thống địa đạo huyền thoại. Dân làng sống dưới lòng đất suốt 6 năm kháng chiến.",
        relatedEvents: "Địa đạo Vinh Mốc (1966-1972)",
        keyFigures: []
    },
    {
        name: "Hàm Rồng - Thanh Hóa",
        lat: 19.8000,
        lon: 105.7833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Cầu Hàm Rồng - mục tiêu oanh tạc của Mỹ. Dân quân bắn rơi nhiều máy bay địch.",
        relatedEvents: "Phòng không Hàm Rồng (1965-1972)",
        keyFigures: []
    },
    {
        name: "Cao Nguyên Đá - Đồng Bắc",
        lat: 22.8000,
        lon: 105.8833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến trường biên giới năm 1979. Quân dân anh dũng bảo vệ vùng biên giới phía Bắc.",
        relatedEvents: "Chiến tranh biên giới (1979)",
        keyFigures: []
    },
    {
        name: "Đồi A1 - Điện Biên",
        lat: 21.3667,
        lon: 103.0000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Đồi chiến lược then chốt trong chiến dịch Điện Biên Phủ. Chiếm được A1 là chiến thắng.",
        relatedEvents: "Chiến thắng Điện Biên Phủ (1954)",
        keyFigures: ["Võ Nguyên Giáp"]
    },
    {
        name: "Him Lam - Điện Biên",
        lat: 21.4000,
        lon: 103.0333,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Căn cứ then chốt tại Điện Biên. Nơi triển khai pháo binh và chỉ huy chiến dịch.",
        relatedEvents: "Điện Biên Phủ (1954)",
        keyFigures: []
    },
    {
        name: "Sài Gòn - TP Hồ Chí Minh",
        lat: 10.7769,
        lon: 106.7009,
        type: "capital",
        period: "contemporary",
        icon: "🏛️",
        description: "Trung tâm miền Nam. Hoàn toàn giải phóng ngày 30/4/1975, mở ra kỷ nguyên thống nhất.",
        relatedEvents: "Giải phóng Sài Gòn (30/4/1975)",
        keyFigures: []
    },
    {
        name: "Đường 9 - Khe Sanh",
        lat: 16.6000,
        lon: 106.7500,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Tuyến đường chiến lược nối Lào - Việt Nam. Trục giao thông quan trọng trong kháng chiến.",
        relatedEvents: "Chiến dịch Đường 9 - Khe Sanh (1971)",
        keyFigures: []
    },
    {
        name: "Củ Chi - TP Hồ Chí Minh",
        lat: 10.9700,
        lon: 106.4950,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Hệ thống địa đạo nổi tiếng dài 250km. Bảo tàng sống về chiến tranh du kích.",
        relatedEvents: "Địa đạo Củ Chi (1948-1975)",
        keyFigures: []
    },
    {
        name: "Trường Sơn - Trường Sơn",
        lat: 16.5000,
        lon: 107.0000,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Dãy núi huyền thoại chạy dọc Việt Nam. Tuyến đường Trường Sơn mang tên dãy núi này.",
        relatedEvents: "Đường Trường Sơn (1959-1975)",
        keyFigures: []
    },
    {
        name: "Vĩnh Linh - Quảng Trị",
        lat: 17.0500,
        lon: 107.0667,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng đất thép - chịu oanh tạc dữ dội nhất. Biểu tượng ý chí bất khuất của nhân dân.",
        relatedEvents: "Vĩnh Linh - Vùng đất thép (1965-1972)",
        keyFigures: []
    },
    {
        name: "Plei Me - Gia Lai",
        lat: 14.1167,
        lon: 107.8333,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trận địa Tây Nguyên năm 1965. Mở đầu cho các chiến dịch lớn tại Tây Nguyên.",
        relatedEvents: "Chiến dịch Plei Me (1965)",
        keyFigures: []
    },
    {
        name: "Đắk Tô - Kon Tum",
        lat: 14.6667,
        lon: 107.8333,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến trường khốc liệt năm 1972. Quân và dân Tây Nguyên anh dũng chiến đấu.",
        relatedEvents: "Trận Đắk Tô (1972)",
        keyFigures: []
    },
    {
        name: "Buôn Ma Thuột - Đắk Lắk",
        lat: 12.6667,
        lon: 108.0500,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến dịch mở màn Tổng tiến công năm 1975. Chiến thắng quyết định dẫn đến giải phóng miền Nam.",
        relatedEvents: "Chiến dịch Buôn Ma Thuột (1975)",
        keyFigures: []
    },
    {
        name: "Xuân Lộc - Đồng Nai",
        lat: 10.9167,
        lon: 107.4167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trận chiến cuối cùng trước khi tiến vào Sài Gòn. Cửa ngõ vào thủ đô miền Nam.",
        relatedEvents: "Trận Xuân Lộc (1975)",
        keyFigures: []
    },
    {
        name: "Hướng Hóa - Quảng Trị",
        lat: 16.8000,
        lon: 106.7167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng căn cứ địa cách mạng quan trọng. Hậu phương vững chắc trong kháng chiến.",
        relatedEvents: "Căn cứ Hướng Hóa (1965-1975)",
        keyFigures: []
    },
    {
        name: "Tân Sơn Nhất - TP HCM",
        lat: 10.8188,
        lon: 106.6519,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Sân bay quân sự lớn nhất miền Nam. Giải phóng ngày 30/4/1975.",
        relatedEvents: "Giải phóng Tân Sơn Nhất (1975)",
        keyFigures: []
    },
    {
        name: "Cửa Việt - Quảng Trị",
        lat: 16.9667,
        lon: 107.1000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Cửa biển chiến lược. Nơi đổ bộ và vận chuyển quân trong chiến tranh.",
        relatedEvents: "Chiến trường Quảng Trị (1972)",
        keyFigures: []
    },
    {
        name: "Cần Thơ",
        lat: 10.0333,
        lon: 105.7833,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Trung tâm đồng bằng sông Cửu Long. Hoàn toàn giải phóng tháng 4/1975.",
        relatedEvents: "Giải phóng miền Nam (1975)",
        keyFigures: []
    },
    {
        name: "Cà Mau",
        lat: 9.1833,
        lon: 105.1500,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Mũi đất cực Nam Tổ quốc. Vùng căn cứ cách mạng kiên cường.",
        relatedEvents: "Kháng chiến miền Nam",
        keyFigures: []
    },
    {
        name: "Biên Hòa - Đồng Nai",
        lat: 10.9500,
        lon: 106.8167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Căn cứ không quân lớn của Mỹ. Giải phóng trong chiến dịch Hồ Chí Minh.",
        relatedEvents: "Giải phóng Biên Hòa (1975)",
        keyFigures: []
    },
    {
        name: "Thừa Thiên Huế",
        lat: 16.4637,
        lon: 107.5909,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến trường Tết Mậu Thân 1968. Giải phóng hoàn toàn tháng 3/1975.",
        relatedEvents: "Tổng tiến công Tết Mậu Thân (1968)",
        keyFigures: []
    },
    {
        name: "An Lộc - Bình Phước",
        lat: 11.7500,
        lon: 106.6833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trận địa năm 1972. Quân giải phóng bao vây và tấn công liên tục.",
        relatedEvents: "Chiến dịch An Lộc (1972)",
        keyFigures: []
    },
    {
        name: "Kon Tum Thành",
        lat: 14.3500,
        lon: 108.0000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Chiến trường Tây Nguyên 1972. Quân và dân Kon Tum chiến đấu anh dũng.",
        relatedEvents: "Chiến dịch Tây Nguyên (1972)",
        keyFigures: []
    },
    {
        name: "Mỹ Lai - Quảng Ngãi",
        lat: 15.1667,
        lon: 108.8667,
        type: "monument",
        period: "contemporary",
        icon: "🏰",
        description: "Nơi xảy ra thảm sát Mỹ Lai 16/3/1968. Tội ác chiến tranh kinh hoàng.",
        relatedEvents: "Thảm sát Mỹ Lai (1968)",
        keyFigures: []
    },
    {
        name: "Vùng 4 - Cà Mau",
        lat: 9.1833,
        lon: 105.1500,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Căn cứ cách mạng kiên cường nhất Nam Bộ. Vùng giải phóng từ đầu kháng chiến.",
        relatedEvents: "Căn cứ địa Nam Bộ",
        keyFigures: []
    },
    {
        name: "Đồng Tháp Mười",
        lat: 10.5833,
        lon: 105.6000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng đất ngập nước - căn cứ du kích. Chiến trường khó khăn nhất miền Nam.",
        relatedEvents: "Chiến tranh du kích miền Nam",
        keyFigures: []
    },
    {
        name: "U Minh - Cà Mau",
        lat: 9.3500,
        lon: 105.0833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Rừng U Minh - căn cứ địa kiên cường. Không quân Mỹ không thể phá hủy.",
        relatedEvents: "Căn cứ U Minh",
        keyFigures: []
    },
    {
        name: "Vũng Áng - Hà Tĩnh",
        lat: 18.3167,
        lon: 106.0833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Nơi đánh chìm tàu chiến Mỹ năm 1972. Chiến công hải quân anh dũng.",
        relatedEvents: "Hải chiến Vũng Áng (1972)",
        keyFigures: []
    },
    {
        name: "Cửa Lò - Nghệ An",
        lat: 18.8167,
        lon: 105.7167,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Biển Cửa Lò - nơi Bác Hồ thường đến nghỉ dưỡng. Bãi biển lịch sử.",
        relatedEvents: "Bác Hồ nghỉ dưỡng",
        keyFigures: ["Hồ Chí Minh"]
    },
    {
        name: "Đảo Cồn Cỏ - Quảng Trị",
        lat: 17.1333,
        lon: 107.3333,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Tiền đồn biển Đông. Chiến sĩ hải đảo kiên cường giữ biển trời.",
        relatedEvents: "Bảo vệ chủ quyền biển đảo",
        keyFigures: []
    },
    {
        name: "Trường Sa",
        lat: 8.6500,
        lon: 111.9167,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Quần đảo Trường Sa - chủ quyền thiêng liêng. Chiến sĩ hải quân bảo vệ.",
        relatedEvents: "Bảo vệ Trường Sa",
        keyFigures: []
    },
    {
        name: "Hoàng Sa",
        lat: 16.5000,
        lon: 112.0000,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Quần đảo Hoàng Sa - đất thiêng của Tổ quốc. Trận hải chiến 1974.",
        relatedEvents: "Hải chiến Hoàng Sa (1974)",
        keyFigures: []
    },
    {
        name: "Pleiku - Gia Lai",
        lat: 13.9833,
        lon: 108.0000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Thủ phủ Tây Nguyên. Chiến trường quan trọng trong kháng chiến chống Mỹ.",
        relatedEvents: "Chiến dịch Tây Nguyên",
        keyFigures: []
    },
    {
        name: "Đức Cơ - Gia Lai",
        lat: 13.7500,
        lon: 108.1167,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng căn cứ Tây Nguyên. Căn cứ B3 của quân giải phóng.",
        relatedEvents: "Căn cứ B3 Tây Nguyên",
        keyFigures: []
    },
    {
        name: "Đường 15 - Quảng Nam",
        lat: 15.8833,
        lon: 108.0000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trục đường chiến lược từ Lào vào Việt Nam. Tuyến vận chuyển quan trọng.",
        relatedEvents: "Đường Trường Sơn (1959-1975)",
        keyFigures: []
    },
    {
        name: "Tam Kỳ - Quảng Nam",
        lat: 15.5667,
        lon: 108.4833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng căn cứ miền Trung. Quân dân kháng chiến kiên cường.",
        relatedEvents: "Kháng chiến miền Trung",
        keyFigures: []
    },
    {
        name: "Nha Trang - Khánh Hòa",
        lat: 12.2500,
        lon: 109.1833,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Căn cứ hải quân Mỹ. Hoàn toàn giải phóng tháng 4/1975.",
        relatedEvents: "Giải phóng miền Nam (1975)",
        keyFigures: []
    },
    {
        name: "Cam Ranh - Khánh Hòa",
        lat: 11.9167,
        lon: 109.1667,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Căn cứ quân sự lớn nhất Mỹ tại Việt Nam. Cảng biển chiến lược.",
        relatedEvents: "Căn cứ Cam Ranh",
        keyFigures: []
    },
    {
        name: "Phan Rang - Ninh Thuận",
        lat: 11.5667,
        lon: 108.9833,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Căn cứ không quân Mỹ. Giải phóng trong chiến dịch tổng tiến công 1975.",
        relatedEvents: "Giải phóng Phan Rang (1975)",
        keyFigures: []
    },
    {
        name: "Phan Thiết - Bình Thuận",
        lat: 10.9333,
        lon: 108.1000,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Vùng ven biển Nam Trung Bộ. Giải phóng tháng 4/1975.",
        relatedEvents: "Giải phóng miền Nam (1975)",
        keyFigures: []
    },
    {
        name: "Long Khánh - Đồng Nai",
        lat: 10.9500,
        lon: 107.2333,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trận chiến trên đường tiến công Sài Gòn năm 1975.",
        relatedEvents: "Chiến dịch Hồ Chí Minh (1975)",
        keyFigures: []
    },
    {
        name: "Vũng Tàu - Bà Rịa",
        lat: 10.3500,
        lon: 107.0833,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Căn cứ quân sự ven biển. Hoàn toàn giải phóng ngày 30/4/1975.",
        relatedEvents: "Giải phóng miền Nam (1975)",
        keyFigures: []
    },
    {
        name: "Mỹ Tho - Tiền Giang",
        lat: 10.3500,
        lon: 106.3500,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Trung tâm đồng bằng sông Cửu Long. Căn cứ cách mạng kiên cường.",
        relatedEvents: "Chiến tranh miền Nam",
        keyFigures: []
    },
    {
        name: "Vĩnh Long",
        lat: 10.2500,
        lon: 105.9667,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Vùng đất miệt vườn. Căn cứ du kích đồng bằng sông Cửu Long.",
        relatedEvents: "Chiến tranh du kích",
        keyFigures: []
    },
    {
        name: "An Giang",
        lat: 10.5167,
        lon: 105.1167,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Biên giới Tây Nam. Vùng căn cứ cách mạng gần biên giới Campuchia.",
        relatedEvents: "Kháng chiến biên giới",
        keyFigures: []
    },
    {
        name: "Hà Tiên - Kiên Giang",
        lat: 10.3833,
        lon: 104.4833,
        type: "landmark",
        period: "contemporary",
        icon: "📍",
        description: "Cửa khẩu biên giới Tây Nam. Vùng đất lịch sử giáp Campuchia.",
        relatedEvents: "Biên giới Tây Nam",
        keyFigures: []
    },
    {
        name: "Đồng Hới - Quảng Bình",
        lat: 17.4833,
        lon: 106.6000,
        type: "battlefield",
        period: "contemporary",
        icon: "⚔️",
        description: "Thành phố anh hùng - chịu oanh tạc dữ dội. Vùng đất thép phía Bắc vĩ tuyến 17.",
        relatedEvents: "Oanh tạc miền Bắc (1965-1972)",
        keyFigures: []
    },
    {
        name: "Hà Nội - Thủ Đô",
        lat: 21.0285,
        lon: 105.8542,
        type: "capital",
        period: "contemporary",
        icon: "🏛️",
        description: "Thủ đô anh hùng - trung tâm kháng chiến toàn quốc. Điện Biên Phủ trên không 1972.",
        relatedEvents: "Điện Biên Phủ trên không (1972)",
        keyFigures: ["Hồ Chí Minh", "Võ Nguyên Giáp"]
    }
];

// ========================================
// MAP INITIALIZATION
// ========================================

let map;
let markers = [];

function initMap() {
    // Initialize map centered on Vietnam
    map = L.map('map', {
        center: [16.5, 107.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 18
    });

    // Add Esri WorldImagery with labels - satellite view with rich colors
    const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    });

    // Add labels overlay for place names
    const labelsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 18,
        pane: 'shadowPane'
    });

    baseLayer.addTo(map);
    labelsLayer.addTo(map);

    // Create markers for all landmarks
    createMarkers();

    // Update marker count
    updateMarkerCount();

    // Setup filter listeners
    setupFilters();
}

// ========================================
// MARKER CREATION
// ========================================

function createAnimatedIcon(landmark, index) {
    // Color schemes - Ancient/Mystical game theme (Assassin's Creed / Civ VI style)
    const colorSchemes = {
        battlefield: {
            primary: '#c9302c',
            glow: 'rgba(201, 48, 44, 0.85)',
            shadow: 'rgba(139, 0, 0, 1)'
        },
        capital: {
            primary: '#d4af37',
            glow: 'rgba(212, 175, 55, 0.85)',
            shadow: 'rgba(184, 134, 11, 1)'
        },
        monument: {
            primary: '#5b8fb9',
            glow: 'rgba(91, 143, 185, 0.85)',
            shadow: 'rgba(70, 130, 180, 1)'
        },
        landmark: {
            primary: '#2ecc71',
            glow: 'rgba(46, 204, 113, 0.85)',
            shadow: 'rgba(39, 174, 96, 1)'
        }
    };

    const colors = colorSchemes[landmark.type] || colorSchemes.landmark;
    const animationDelay = (index * 0.1) + 's';

    const iconHtml = `
        <div class="animated-marker-container" style="animation-delay: ${animationDelay}">
            <div class="marker-ripple" style="border-color: ${colors.primary}; border-width: 3px;"></div>
            <div class="marker-pulse" style="background: ${colors.glow}"></div>
            <div class="marker-glow" style="box-shadow: 0 0 30px ${colors.glow}, 0 0 60px ${colors.shadow}, 0 0 90px ${colors.shadow}"></div>
            <div class="marker-icon" style="filter: drop-shadow(0 0 12px ${colors.shadow}) drop-shadow(0 0 6px #fff); background: rgba(0, 0, 0, 0.4); border-radius: 50%; padding: 8px; border: 2px solid rgba(255, 255, 255, 0.3);">
                ${landmark.icon}
            </div>
        </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: `custom-marker marker-${landmark.type}`,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });
}

function createMarkers() {
    historicalLandmarks.forEach((landmark, index) => {
        // Create animated custom icon
        const customIcon = createAnimatedIcon(landmark, index);

        // Create marker
        const marker = L.marker([landmark.lat, landmark.lon], {
            icon: customIcon,
            landmark: landmark // Store landmark data
        });

        // Create enhanced popup content with tabs
        const popupContent = createEnhancedPopup(landmark);

        marker.bindPopup(popupContent, {
            maxWidth: 400,
            className: 'custom-popup enhanced-popup'
        });

        // Add click animation
        marker.on('click', function() {
            // Add active class for animation
            const markerElement = this._icon;
            if (markerElement) {
                markerElement.classList.add('marker-active');
                setTimeout(() => {
                    markerElement.classList.remove('marker-active');
                }, 500);
            }

            // Track map exploration and add XP
            trackMapExploration(landmark);
        });

        // Add hover animation trigger
        marker.on('mouseover', function() {
            const markerElement = this._icon;
            if (markerElement) {
                const container = markerElement.querySelector('.animated-marker-container');
                if (container) {
                    container.style.animationPlayState = 'running';
                }
            }
        });

        // Store data attributes for filtering
        marker.landmarkData = landmark;

        // Add to map and markers array
        marker.addTo(map);
        markers.push(marker);
    });
}

// ========================================
// FILTER FUNCTIONALITY
// ========================================

function setupFilters() {
    // Get all filter sections
    const filterSections = document.querySelectorAll('.filter-section');

    // Period filters (first filter-section)
    if (filterSections[0]) {
        const periodCheckboxes = filterSections[0].querySelectorAll('input[type="checkbox"]');
        periodCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterMarkers);
        });
    }

    // Type filters (second filter-section)
    if (filterSections[1]) {
        const typeCheckboxes = filterSections[1].querySelectorAll('input[type="checkbox"]');
        typeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterMarkers);
        });
    }

    // Reset button
    const resetButton = document.getElementById('reset-filter');
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

function filterMarkers() {
    const filterSections = document.querySelectorAll('.filter-section');

    // Get selected periods from first filter-section
    const selectedPeriods = filterSections[0] ? Array.from(
        filterSections[0].querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value) : [];

    // Get selected types from second filter-section
    const selectedTypes = filterSections[1] ? Array.from(
        filterSections[1].querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value) : [];

    // Filter markers
    let visibleCount = 0;
    markers.forEach(marker => {
        const data = marker.landmarkData;
        const periodMatch = selectedPeriods.includes(data.period);
        const typeMatch = selectedTypes.includes(data.type);

        if (periodMatch && typeMatch) {
            marker.addTo(map);
            visibleCount++;
        } else {
            map.removeLayer(marker);
        }
    });

    updateMarkerCount(visibleCount);
}

function resetFilters() {
    // Check all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });

    // Show all markers
    markers.forEach(marker => marker.addTo(map));
    updateMarkerCount();
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getPeriodLabel(period) {
    const labels = {
        'ancient': 'Thời cổ đại',
        'medieval': 'Thời trung đại',
        'modern': 'Thời cận đại',
        'contemporary': 'Thời hiện đại'
    };
    return labels[period] || period;
}

// ========================================
// ENHANCED POPUP WITH TABS
// ========================================

// Parse events string into structured array
function parseEvents(eventsString) {
    if (!eventsString) return [];

    // Split by comma or semicolon
    const eventsList = eventsString.split(/[,;]/).map(e => e.trim()).filter(e => e);

    return eventsList.map(eventText => {
        // Extract year from parentheses
        const yearMatch = eventText.match(/\((\d+)\s*(TCN)?\)/);
        let year = null;
        let text = eventText;

        if (yearMatch) {
            const yearNum = parseInt(yearMatch[1]);
            const isBCE = yearMatch[2] === 'TCN';
            year = isBCE ? `${yearNum} TCN` : `Năm ${yearNum}`;
            // Remove year from text to avoid duplication
            text = eventText.replace(/\s*\(\d+\s*TCN?\)/, '');
        }

        // Determine icon based on keywords
        let icon = '📜'; // default
        const lowerText = text.toLowerCase();

        if (lowerText.includes('chiến') || lowerText.includes('đánh') || lowerText.includes('trận')) {
            icon = '⚔️';
        } else if (lowerText.includes('khởi nghĩa') || lowerText.includes('kháng chiến')) {
            icon = '🔥';
        } else if (lowerText.includes('dựng nước') || lowerText.includes('thống nhất') || lowerText.includes('độc lập')) {
            icon = '🏛️';
        } else if (lowerText.includes('xây dựng') || lowerText.includes('dời đô')) {
            icon = '🏗️';
        } else if (lowerText.includes('sinh') || lowerText.includes('sinh nhật')) {
            icon = '🎂';
        } else if (lowerText.includes('lễ hội') || lowerText.includes('kỷ niệm')) {
            icon = '🎉';
        } else if (lowerText.includes('giải phóng')) {
            icon = '🎊';
        } else if (lowerText.includes('tuyên ngôn')) {
            icon = '📣';
        }

        return { year, text, icon };
    });
}

function createEnhancedPopup(landmark) {
    const typeLabels = {
        'capital': 'Kinh đô',
        'battlefield': 'Trận địa',
        'monument': 'Di tích',
        'landmark': 'Địa danh'
    };

    return `
        <div class="enhanced-popup-container">
            <div class="popup-header-enhanced">
                <div class="popup-icon-large">${landmark.icon}</div>
                <div class="popup-title-section">
                    <h3 class="popup-title">${landmark.name}</h3>
                    <div class="popup-badges">
                        <span class="badge badge-period">${getPeriodLabel(landmark.period)}</span>
                        <span class="badge badge-type">${typeLabels[landmark.type]}</span>
                    </div>
                </div>
            </div>

            <div class="popup-tabs">
                <button class="popup-tab active" data-tab="info">
                    <span class="tab-icon">ℹ️</span>
                    <span>Thông tin</span>
                </button>
                <button class="popup-tab" data-tab="events">
                    <span class="tab-icon">📜</span>
                    <span>Sự kiện</span>
                </button>
                <button class="popup-tab" data-tab="figures">
                    <span class="tab-icon">👤</span>
                    <span>Nhân vật</span>
                </button>
            </div>

            <div class="popup-content-tabs">
                <!-- Info Tab -->
                <div class="popup-tab-content active" data-content="info">
                    <div class="popup-description-enhanced">
                        <p>${landmark.description}</p>
                    </div>
                    <div class="popup-meta">
                        <div class="meta-item">
                            <span class="meta-icon">📍</span>
                            <span class="meta-text">Tọa độ: ${landmark.lat.toFixed(4)}°N, ${landmark.lon.toFixed(4)}°E</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span class="meta-text">${getPeriodLabel(landmark.period)}</span>
                        </div>
                    </div>
                </div>

                <!-- Events Tab -->
                <div class="popup-tab-content" data-content="events">
                    ${landmark.relatedEvents ? `
                        <div class="events-list">
                            ${parseEvents(landmark.relatedEvents).map(event => `
                                <div class="event-item">
                                    <span class="event-icon">${event.icon}</span>
                                    <div class="event-content">
                                        ${event.year ? `<div class="event-year">${event.year}</div>` : ''}
                                        <p class="event-text">${event.text}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-data">
                            <span class="no-data-icon">📜</span>
                            <p>Chưa có thông tin về sự kiện lịch sử liên quan</p>
                        </div>
                    `}
                </div>

                <!-- Figures Tab -->
                <div class="popup-tab-content" data-content="figures">
                    ${landmark.keyFigures && landmark.keyFigures.length > 0 ? `
                        <div class="figures-list">
                            ${landmark.keyFigures.map(figure => `
                                <div class="figure-item">
                                    <span class="figure-avatar">👤</span>
                                    <span class="figure-name">${figure}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-data">
                            <span class="no-data-icon">👤</span>
                            <p>Chưa có thông tin về nhân vật lịch sử liên quan</p>
                        </div>
                    `}
                </div>
            </div>

            <div class="popup-footer">
                <button class="popup-action-btn" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(landmark.name)}', '_blank')">
                    <span>🔍</span>
                    <span>Tìm hiểu thêm</span>
                </button>
            </div>
        </div>
    `;
}

// Initialize popup tabs functionality
function initPopupTabs() {
    // Use event delegation on the map container
    map.on('popupopen', function(e) {
        const popup = e.popup;
        const container = popup.getElement();

        if (!container) return;

        const tabs = container.querySelectorAll('.popup-tab');
        const contents = container.querySelectorAll('.popup-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;

                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = container.querySelector(`.popup-tab-content[data-content="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    // Add slide animation
                    targetContent.style.animation = 'slideInLeft 0.3s ease';
                }
            });
        });
    });
}

function updateMarkerCount(count) {
    const countElement = document.getElementById('marker-count');
    if (countElement) {
        countElement.textContent = count !== undefined ? count : markers.length;
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initSearch() {
    const searchInput = document.getElementById('map-search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchClearBtn = document.getElementById('search-clear-btn');

    if (!searchInput || !searchSuggestions || !searchClearBtn) return;

    // Handle input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();

        // Show/hide clear button
        searchClearBtn.style.display = query ? 'flex' : 'none';

        if (!query) {
            searchSuggestions.classList.remove('active');
            return;
        }

        // Search landmarks
        const results = historicalLandmarks.filter(landmark => {
            return landmark.name.toLowerCase().includes(query) ||
                   landmark.description.toLowerCase().includes(query) ||
                   landmark.relatedEvents.toLowerCase().includes(query) ||
                   (landmark.keyFigures && landmark.keyFigures.some(fig => fig.toLowerCase().includes(query)));
        });

        displaySearchResults(results, query);
    });

    // Clear button
    searchClearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchSuggestions.classList.remove('active');
        searchClearBtn.style.display = 'none';
        searchInput.focus();
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.map-search-container')) {
            searchSuggestions.classList.remove('active');
        }
    });

    // Focus to open if has value
    searchInput.addEventListener('focus', function() {
        if (searchInput.value.trim()) {
            searchSuggestions.classList.add('active');
        }
    });
}

function displaySearchResults(results, query) {
    const searchSuggestions = document.getElementById('search-suggestions');

    if (results.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">Không tìm thấy địa danh phù hợp</div>
            </div>
        `;
        searchSuggestions.classList.add('active');
        return;
    }

    // Sort by relevance (exact name match first)
    results.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(query);
        const bExact = b.name.toLowerCase().startsWith(query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
    });

    searchSuggestions.innerHTML = results.map(landmark => {
        const highlightedName = highlightMatch(landmark.name, query);
        const periodLabels = {
            ancient: 'Cổ đại',
            medieval: 'Trung đại',
            modern: 'Cận đại',
            contemporary: 'Hiện đại'
        };
        const typeLabels = {
            capital: 'Kinh đô',
            battlefield: 'Trận địa',
            monument: 'Di tích',
            landmark: 'Địa danh'
        };

        return `
            <div class="suggestion-item" data-lat="${landmark.lat}" data-lon="${landmark.lon}" data-name="${escapeHtml(landmark.name)}">
                <div class="suggestion-icon">${landmark.icon}</div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${highlightedName}</div>
                    <div class="suggestion-meta">
                        <span class="suggestion-badge badge-period">${periodLabels[landmark.period]}</span>
                        <span class="suggestion-badge badge-type">${typeLabels[landmark.type]}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    searchSuggestions.classList.add('active');

    // Add click handlers
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const lat = parseFloat(this.dataset.lat);
            const lon = parseFloat(this.dataset.lon);
            const name = this.dataset.name;

            // Fly to location
            if (map) {
                map.flyTo([lat, lon], 13, {
                    duration: 1.5,
                    easeLinearity: 0.25
                });

                // Find and open marker popup
                setTimeout(() => {
                    markers.forEach(marker => {
                        const markerLatLng = marker.getLatLng();
                        if (Math.abs(markerLatLng.lat - lat) < 0.001 &&
                            Math.abs(markerLatLng.lng - lon) < 0.001) {
                            marker.openPopup();

                            // Bounce animation
                            const markerElement = marker._icon;
                            if (markerElement) {
                                markerElement.classList.add('marker-active');
                                const container = markerElement.querySelector('.animated-marker-container');
                                if (container) {
                                    container.style.animation = 'markerBounce 0.6s ease';
                                }
                                setTimeout(() => {
                                    markerElement.classList.remove('marker-active');
                                    if (container) {
                                        container.style.animation = '';
                                    }
                                }, 1000);
                            }
                        }
                    });
                }, 1600);
            }

            // Close suggestions
            searchSuggestions.classList.remove('active');
            document.getElementById('map-search-input').blur();
        });
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<span class="suggestion-match">$1</span>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========================================
// TIMELINE SLIDER FUNCTIONALITY
// ========================================

let timelineInterval = null;
let isPlaying = false;

// Extract year from landmark data automatically
function getLandmarkYear(landmark) {
    // Try to extract year from relatedEvents
    const text = landmark.relatedEvents || '';

    // Match patterns like (938), (1010), (1945), (257 TCN), (2879 TCN)
    const yearMatch = text.match(/\((\d+)\s*(TCN)?\)/);

    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        const isBCE = yearMatch[2] === 'TCN';
        return isBCE ? -year : year;
    }

    // Default to period midpoints if no year found
    const periodYears = {
        'ancient': -1000,
        'medieval': 1000,
        'modern': 1800,
        'contemporary': 1945
    };

    return periodYears[landmark.period] || 0;
}

function initTimeline() {
    const timelineSlider = document.getElementById('timeline-slider');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineCurrentYear = document.getElementById('timeline-current-year');
    const timelineCount = document.getElementById('timeline-count');
    const timelinePlayBtn = document.getElementById('timeline-play-btn');

    if (!timelineSlider) {
        console.error('Timeline slider not found');
        return;
    }

    // Create tooltip for year display
    const tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, var(--gold), var(--brass));
        color: var(--dark-navy);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.9rem;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5);
    `;
    timelineSlider.parentElement.appendChild(tooltip);

    // Update timeline on slider change
    timelineSlider.addEventListener('input', function() {
        updateTimelineDisplay(this.value);
        filterMarkersByTimeline(this.value);

        // Update tooltip
        updateTooltip(this.value, tooltip, this);
    });

    // Show tooltip on hover
    timelineSlider.addEventListener('mouseenter', function() {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    });

    timelineSlider.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
    });

    // Update tooltip position on mouse move
    timelineSlider.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        tooltip.style.left = x + 'px';
        tooltip.style.top = '-40px';
    });

    // Play button
    if (timelinePlayBtn) {
        timelinePlayBtn.addEventListener('click', function() {
            if (isPlaying) {
                // Pause timeline and music
                stopTimelineAnimation();
            } else {
                // Resume or start timeline and music
                startTimelineAnimation();
            }
        });
    }

    // Initialize display
    updateTimelineDisplay(100);
    console.log('✅ Timeline initialized successfully');
}

function updateTooltip(value, tooltip, slider) {
    const minYear = -2879;
    const maxYear = new Date().getFullYear();
    const range = maxYear - minYear;
    const currentYear = minYear + (range * value / 100);

    let yearDisplay;
    if (currentYear < 0) {
        yearDisplay = Math.abs(Math.round(currentYear)) + ' TCN';
    } else if (currentYear < maxYear) {
        yearDisplay = 'Năm ' + Math.round(currentYear);
    } else {
        yearDisplay = 'Hiện tại';
    }

    tooltip.textContent = yearDisplay;
}

function updateTimelineDisplay(value) {
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineCurrentYear = document.getElementById('timeline-current-year');
    const timelineSlider = document.getElementById('timeline-slider');

    if (timelineProgress) {
        timelineProgress.style.width = value + '%';
    }

    // Map slider value (0-100) to years
    const minYear = -2879; // 2879 TCN
    const maxYear = new Date().getFullYear(); // Hiện tại
    const range = maxYear - minYear;
    const currentYear = minYear + (range * value / 100);

    // Format year display
    let yearDisplay;
    if (currentYear < 0) {
        yearDisplay = Math.abs(Math.round(currentYear)) + ' TCN';
    } else if (currentYear < maxYear) {
        yearDisplay = Math.round(currentYear).toString();
    } else {
        yearDisplay = 'Hiện tại';
    }

    if (timelineCurrentYear) {
        timelineCurrentYear.textContent = yearDisplay;
    }

    // Store current year for filtering
    if (timelineSlider) {
        timelineSlider.dataset.currentYear = currentYear;
    }
}

function filterMarkersByTimeline(value) {
    const minYear = -2879;
    const maxYear = new Date().getFullYear();
    const range = maxYear - minYear;
    const currentYear = minYear + (range * value / 100);

    let visibleCount = 0;
    const newlyVisibleMarkers = [];

    markers.forEach(marker => {
        const landmark = marker.landmarkData;
        if (!landmark) return;

        const landmarkYear = getLandmarkYear(landmark);
        const wasVisible = map.hasLayer(marker);

        // Show marker if its year is <= current year
        if (landmarkYear <= currentYear) {
            if (!wasVisible) {
                marker.addTo(map);
                newlyVisibleMarkers.push(marker);

                // Add fade-in animation
                const markerElement = marker._icon;
                if (markerElement) {
                    markerElement.classList.add('marker-new');
                    markerElement.style.animation = 'markerFadeIn 0.6s ease-out';

                    // Remove marker-new class after animation
                    setTimeout(() => {
                        markerElement.classList.remove('marker-new');
                    }, 3000);
                }
            }
            visibleCount++;
        } else {
            if (wasVisible) {
                map.removeLayer(marker);
            }
        }
    });

    // Update count
    const timelineCount = document.getElementById('timeline-count');
    if (timelineCount) {
        timelineCount.textContent = visibleCount + ' địa danh';
    }

    return visibleCount;
}

// Extract year from landmark data
function extractYear(landmark) {
    // If year property exists, use it
    if (landmark.year !== undefined) {
        return landmark.year;
    }

    // Extract from relatedEvents
    const yearMatch = (landmark.relatedEvents || '').match(/\((\d+)\s*(TCN)?\)/);
    if (yearMatch) {
        const yearNum = parseInt(yearMatch[1]);
        const isBCE = yearMatch[2] === 'TCN';
        return isBCE ? -yearNum : yearNum;
    }

    // Default based on period
    const periodDefaults = {
        'ancient': -1000,
        'medieval': 1200,
        'modern': 1900,
        'contemporary': 1960
    };
    return periodDefaults[landmark.period] || 1900;
}

function startTimelineAnimation() {
    isPlaying = true;
    const timelinePlayBtn = document.getElementById('timeline-play-btn');
    const timelineSlider = document.getElementById('timeline-slider');
    const playText = timelinePlayBtn.querySelector('.play-text');
    const playIcon = timelinePlayBtn.querySelector('.play-icon');

    if (!timelinePlayBtn || !timelineSlider) {
        console.error('Timeline elements not found');
        return;
    }

    timelinePlayBtn.classList.add('playing');
    if (playText) playText.textContent = 'Tạm dừng';
    if (playIcon) playIcon.textContent = '⏸️';

    // Sort ALL markers chronologically by year
    const sortedMarkers = markers.slice().sort((a, b) => {
        const yearA = extractYear(a.landmarkData);
        const yearB = extractYear(b.landmarkData);
        return yearA - yearB;
    });

    console.log(`🗓️ Timeline: ${sortedMarkers.length} landmarks sorted chronologically`);
    console.log(`📅 First: ${sortedMarkers[0].landmarkData.name} (${extractYear(sortedMarkers[0].landmarkData)})`);
    console.log(`📅 Last: ${sortedMarkers[sortedMarkers.length-1].landmarkData.name} (${extractYear(sortedMarkers[sortedMarkers.length-1].landmarkData)})`);

    // Hide all markers initially
    markers.forEach(m => map.removeLayer(m));

    // Calculate timing: each landmark needs ~4 seconds for full sequence (faster)
    // Zoom (0.8s) + Marker bounce (1.2s) + Card display (2s) = 4s per landmark
    const timePerLandmark = 4000; // 4 seconds per landmark (faster)
    const landmarkCount = sortedMarkers.length;
    const totalDuration = timePerLandmark * landmarkCount; // ~11 minutes for 170 landmarks

    console.log(`⏱️ Time per landmark: ${Math.round(timePerLandmark)}ms (Total: ${Math.round(totalDuration/60000)} minutes)`);

    let currentIndex = 0;
    let isProcessingMarker = false;

    // Start from beginning
    timelineSlider.value = 0;
    updateTimelineDisplay(0);

    // Show landmarks one by one in chronological order
    timelineInterval = setInterval(() => {
        if (currentIndex >= sortedMarkers.length) {
            stopTimelineAnimation();
            return;
        }

        // Update slider position
        const progress = (currentIndex / sortedMarkers.length) * 100;
        timelineSlider.value = progress;
        updateTimelineDisplay(progress);

        // Show current landmark
        if (!isProcessingMarker) {
            isProcessingMarker = true;
            const currentMarker = sortedMarkers[currentIndex];

            // Show introduction: zoom first, then marker appears, then card
            showLandmarkIntroduction(currentMarker, () => {
                isProcessingMarker = false;
            });

            currentIndex++;

            // Update counter
            const timelineCount = document.getElementById('timeline-count');
            if (timelineCount) {
                timelineCount.textContent = `${currentIndex}/${landmarkCount} địa danh`;
            }
        }
    }, timePerLandmark); // Show each landmark at calculated interval
}

// Show landmark introduction with zoom and description
function showLandmarkIntroduction(marker, callback) {
    const landmark = marker.landmarkData;
    if (!landmark) {
        if (callback) callback();
        return;
    }

    console.log(`🎯 Timeline: Showing ${landmark.name}`);

    // Step 1: Smooth zoom to the landmark location (faster)
    map.flyTo([landmark.lat, landmark.lon], 11, {
        duration: 0.7,  // 700ms zoom (faster)
        easeLinearity: 0.3
    });

    // Step 2: After zoom completes, ADD MARKER with bounce animation
    setTimeout(() => {
        console.log(`📍 Adding marker for ${landmark.name}`);

        // Add marker to map NOW (after zoom)
        marker.addTo(map);

        // Trigger bounce animation immediately
        setTimeout(() => {
            const markerElement = marker._icon;
            if (markerElement) {
                console.log('✨ Triggering bounce animation');
                markerElement.classList.add('timeline-marker-appear');
            } else {
                console.error('❌ Marker element not found!');
            }
        }, 50);

        // Step 3: Wait for marker to be visible, THEN show description card (faster)
        setTimeout(() => {
            console.log(`📋 Showing description card for ${landmark.name}`);
            showLandmarkCard(landmark);

            // Step 4: After card finishes displaying, clean up and callback
            setTimeout(() => {
                // Remove bounce animation class but KEEP marker on map
                const markerElement = marker._icon;
                if (markerElement) {
                    markerElement.classList.remove('timeline-marker-appear');
                }
                if (callback) callback();
            }, 1800); // Card display duration (faster: 1.8s)
        }, 1200); // Wait 1200ms after marker appears (faster)

    }, 800); // Wait for zoom to complete (700ms + 100ms buffer)
}

// Create and show landmark introduction card
function showLandmarkCard(landmark) {
    // Remove existing card if any
    const existingCard = document.querySelector('.landmark-intro-card');
    if (existingCard) {
        existingCard.remove();
    }

    // Create card
    const card = document.createElement('div');
    card.className = 'landmark-intro-card';

    // Get short description (first sentence or first 100 chars)
    let shortDesc = landmark.description;
    const firstSentence = shortDesc.match(/^[^.!?]+[.!?]/);
    if (firstSentence) {
        shortDesc = firstSentence[0];
    } else if (shortDesc.length > 100) {
        shortDesc = shortDesc.substring(0, 100) + '...';
    }

    // Get year from events
    const yearMatch = (landmark.relatedEvents || '').match(/\((\d+)\s*(TCN)?\)/);
    let yearDisplay = '';
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        const isBCE = yearMatch[2] === 'TCN';
        yearDisplay = isBCE ? `${year} TCN` : `Năm ${year}`;
    }

    const typeLabels = {
        'capital': 'Kinh đô',
        'battlefield': 'Trận địa',
        'monument': 'Di tích',
        'landmark': 'Địa danh'
    };

    card.innerHTML = `
        <div class="landmark-intro-icon">${landmark.icon}</div>
        <div class="landmark-intro-content">
            <div class="landmark-intro-type">${typeLabels[landmark.type] || 'Địa danh'}</div>
            <h3 class="landmark-intro-title">${landmark.name}</h3>
            ${yearDisplay ? `<div class="landmark-intro-year">${yearDisplay}</div>` : ''}
            <p class="landmark-intro-desc">${shortDesc}</p>
        </div>
    `;

    document.body.appendChild(card);

    // STAGED REVEAL - FASTER VERSION
    // Stage 1: Icon appears ALONE with circular ripple effect
    setTimeout(() => {
        card.classList.add('show-icon');
    }, 80);

    // Stage 2: Content slides in after icon (faster gap: 1s instead of 1.5s)
    setTimeout(() => {
        card.classList.add('show-content');
    }, 1000);

    // Stage 3: Full card display
    setTimeout(() => {
        card.classList.add('show');
    }, 1150);

    // Stage 4: Card stays visible for reading (1.8 seconds total, faster)
    // Animate out after 3000ms
    setTimeout(() => {
        card.classList.remove('show');
        setTimeout(() => {
            card.remove();
        }, 300);
    }, 3000);
}

function stopTimelineAnimation() {
    isPlaying = false;
    const timelinePlayBtn = document.getElementById('timeline-play-btn');
    const timelineSlider = document.getElementById('timeline-slider');

    if (!timelinePlayBtn) return;

    const playText = timelinePlayBtn.querySelector('.play-text');
    const playIcon = timelinePlayBtn.querySelector('.play-icon');

    timelinePlayBtn.classList.remove('playing');
    if (playText) playText.textContent = 'Xem dòng thời gian';
    if (playIcon) playIcon.textContent = '▶️';

    if (timelineInterval) {
        clearInterval(timelineInterval);
        timelineInterval = null;
    }

    // Show completion notification if reached the end
    if (timelineSlider && parseFloat(timelineSlider.value) >= 99) {
        showNotification('✅ Đã xem hết dòng thời gian lịch sử Việt Nam!');
    }
}

function fitMapToVisibleMarkers() {
    const visibleMarkers = markers.filter(marker => map.hasLayer(marker));

    if (visibleMarkers.length === 0) return;

    const group = L.featureGroup(visibleMarkers);

    // Very smooth, slow zoom
    map.flyToBounds(group.getBounds(), {
        padding: [100, 100],  // More padding
        duration: 2,          // Slower animation for smoother feel
        easeLinearity: 0.15,  // Even smoother easing
        maxZoom: 7            // Don't zoom too close
    });
}

function fitMapToNewMarkers(newMarkers) {
    if (!newMarkers || newMarkers.length === 0) return;

    try {
        // If only one marker, fly to it with smooth animation
        if (newMarkers.length === 1) {
            const landmark = newMarkers[0].landmarkData;
            if (landmark && landmark.lat && landmark.lon) {
                map.flyTo([landmark.lat, landmark.lon], 9, {
                    duration: 2,
                    easeLinearity: 0.15
                });
            }
        } else if (newMarkers.length >= 2) {
            // Multiple markers - fit bounds to show all new markers
            const group = L.featureGroup(newMarkers);
            const bounds = group.getBounds();

            if (bounds.isValid()) {
                map.flyToBounds(bounds, {
                    padding: [100, 100],
                    duration: 2,
                    easeLinearity: 0.15,
                    maxZoom: 10
                });
            }
        }
    } catch (error) {
        console.error('Error fitting map to new markers:', error);
    }
}

// ========================================
// FLOATING CONTROL PANEL
// ========================================

let currentLayerType = 'streets'; // streets, satellite, terrain
let satelliteLayer = null;

function initControls() {
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const myLocationBtn = document.getElementById('my-location-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const layerToggleBtn = document.getElementById('layer-toggle-btn');

    // Zoom In
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            map.zoomIn();
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
        });
    }

    // Zoom Out
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            map.zoomOut();
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
        });
    }

    // Reset View - Fly to Vietnam
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            this.classList.add('loading');
            map.flyTo([16.0, 106.0], 6, {
                duration: 1.5,
                easeLinearity: 0.25
            });
            setTimeout(() => this.classList.remove('loading'), 1500);
        });
    }

    // My Location
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', function() {
            this.classList.add('loading');

            if (!navigator.geolocation) {
                alert('Trình duyệt của bạn không hỗ trợ Geolocation');
                this.classList.remove('loading');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Fly to user location
                    map.flyTo([lat, lon], 13, {
                        duration: 1.5,
                        easeLinearity: 0.25
                    });

                    // Add temporary marker
                    const userMarker = L.marker([lat, lon], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<div style="font-size: 2rem;">📍</div>',
                            iconSize: [40, 40],
                            iconAnchor: [20, 40]
                        })
                    }).addTo(map);

                    userMarker.bindPopup('<b>📍 Vị trí của bạn</b>').openPopup();

                    // Remove after 5 seconds
                    setTimeout(() => {
                        map.removeLayer(userMarker);
                    }, 5000);

                    this.classList.remove('loading');
                    this.classList.add('active');
                    setTimeout(() => this.classList.remove('active'), 1000);
                },
                (error) => {
                    alert('Không thể lấy vị trí của bạn: ' + error.message);
                    this.classList.remove('loading');
                }
            );
        });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const mapContainer = document.getElementById('map');

            if (!document.fullscreenElement) {
                // Enter fullscreen
                if (mapContainer.requestFullscreen) {
                    mapContainer.requestFullscreen();
                } else if (mapContainer.webkitRequestFullscreen) {
                    mapContainer.webkitRequestFullscreen();
                } else if (mapContainer.msRequestFullscreen) {
                    mapContainer.msRequestFullscreen();
                }
                this.classList.add('fullscreen-active');
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.classList.remove('fullscreen-active');
            }
        });

        // Listen for fullscreen change
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                fullscreenBtn.classList.remove('fullscreen-active');
            }
        });
    }

    // Layer Toggle
    if (layerToggleBtn) {
        layerToggleBtn.addEventListener('click', function() {
            toggleMapLayer();
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 500);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // + or = for zoom in
        if (e.key === '+' || e.key === '=') {
            map.zoomIn();
            if (zoomInBtn) {
                zoomInBtn.classList.add('active');
                setTimeout(() => zoomInBtn.classList.remove('active'), 300);
            }
        }
        // - for zoom out
        if (e.key === '-') {
            map.zoomOut();
            if (zoomOutBtn) {
                zoomOutBtn.classList.add('active');
                setTimeout(() => zoomOutBtn.classList.remove('active'), 300);
            }
        }
        // H for home/reset
        if (e.key === 'h' || e.key === 'H') {
            resetViewBtn.click();
        }
        // F for fullscreen
        if (e.key === 'f' || e.key === 'F') {
            fullscreenBtn.click();
        }
        // L for layer toggle
        if (e.key === 'l' || e.key === 'L') {
            layerToggleBtn.click();
        }
    });
}

function toggleMapLayer() {
    if (currentLayerType === 'streets') {
        // Switch to Satellite
        if (!satelliteLayer) {
            satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });
        }
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        satelliteLayer.addTo(map);
        currentLayerType = 'satellite';
        showNotification('🛰️ Chế độ: Ảnh vệ tinh');
    } else {
        // Switch back to Streets
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        currentLayerType = 'streets';
        showNotification('🗺️ Chế độ: Bản đồ đường phố');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'map-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--gold), var(--brass));
        color: var(--dark-navy);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

// Initialize timeline music with error handling
function initTimelineMusic() {
    const timelineMusic = document.getElementById('timelineMusic');
    if (!timelineMusic) {
        console.error('❌ Timeline music element not found');
        return;
    }

    // Add error listener
    timelineMusic.addEventListener('error', function(e) {
        console.error('❌ Timeline music loading error:');
        console.error('Error code:', timelineMusic.error?.code);
        console.error('Error message:', timelineMusic.error?.message);
        if (timelineMusic.error) {
            switch(timelineMusic.error.code) {
                case 1: console.error('MEDIA_ERR_ABORTED - Loading was aborted'); break;
                case 2: console.error('MEDIA_ERR_NETWORK - Network error'); break;
                case 3: console.error('MEDIA_ERR_DECODE - Decoding error'); break;
                case 4: console.error('MEDIA_ERR_SRC_NOT_SUPPORTED - File not found or format not supported'); break;
            }
        }
        console.error('Source:', timelineMusic.currentSrc || timelineMusic.src);
    });

    // Add success listener
    timelineMusic.addEventListener('loadeddata', function() {
        console.log('✅ Timeline music loaded successfully!');
        console.log('Source:', timelineMusic.currentSrc);
        console.log('Duration:', timelineMusic.duration, 'seconds');
    });

    // Add can play listener
    timelineMusic.addEventListener('canplay', function() {
        console.log('✅ Timeline music can play');
    });
}

// ========================================
// XP TRACKING
// ========================================

/**
 * Track map exploration and add XP
 */
const exploredLocations = new Set(JSON.parse(localStorage.getItem('exploredMapLocations') || '[]'));

async function trackMapExploration(landmark) {
    const locationKey = `${landmark.name}_${landmark.lat}_${landmark.lon}`;

    // Only track if not explored before
    if (exploredLocations.has(locationKey)) {
        return;
    }

    exploredLocations.add(locationKey);
    localStorage.setItem('exploredMapLocations', JSON.stringify([...exploredLocations]));

    // Track activity via API if logged in
    const token = Auth.getToken();
    if (token) {
        try {
            const response = await API.trackActivity('map', {
                location: landmark.name,
                period: landmark.period,
                type: landmark.type
            });

            if (response && response.xp_earned > 0) {
                showNotification(`+${response.xp_earned} XP - Khám phá ${landmark.name}!`);
                if (response.leveled_up) {
                    setTimeout(() => {
                        showNotification(`🎉 Level Up! Level ${response.level}!`);
                    }, 1000);
                }
            }
        } catch (error) {
            console.log('Failed to track map exploration', error);
            // Fallback to local XP
            await UserData.addXP(5, 'map');
            showNotification(`+5 XP - Khám phá ${landmark.name}!`);
        }
    } else {
        // Not logged in, use local XP
        await UserData.addXP(5, 'map');
        showNotification(`+5 XP - Khám phá ${landmark.name}!`);
    }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initSearch();
    initTimeline();
    initControls();
    initPopupTabs();
    initTimelineMusic();
});
