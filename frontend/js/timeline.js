/**
 * VIỆT KÝ SỬ - Enhanced Timeline Page JavaScript
 * Advanced features: Search, Zoom, Minimap, Keyboard Shortcuts, Particles
 */

// ==================== STATE ====================
let timelineEvents = [];
let filteredEvents = [];
let currentPeriod = 'all';
let currentZoomLevel = 100;
let currentEventIndex = -1;
let selectedEventMarker = null;

// ==================== DOM ELEMENTS ====================
const timelineEventsContainer = document.getElementById('timeline-events');
const timelineScroll = document.getElementById('timeline-scroll');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('event-modal');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchOverlay = document.getElementById('search-overlay');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetZoomBtn = document.getElementById('reset-zoom');
const toggleViewBtn = document.getElementById('toggle-view');
const yearInput = document.getElementById('year-input');
const jumpBtn = document.getElementById('jump-btn');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapViewport = document.getElementById('minimap-viewport');
const progressFill = document.getElementById('progress-fill');
const progressIndicator = document.getElementById('progress-indicator');
const prevEventBtn = document.getElementById('prev-event');
const nextEventBtn = document.getElementById('next-event');
const particlesContainer = document.getElementById('timeline-particles');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('⏰ Timeline Enhanced - Initializing...');
    loadTimelineEvents();
    initEventListeners();
    initParticles();
    initMinimap();
});

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Scroll buttons
    scrollLeft.addEventListener('click', () => scrollTimeline(-500));
    scrollRight.addEventListener('click', () => scrollTimeline(500));

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.dataset.period;
            filterEvents();
        });
    });

    // Search
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchResults.classList.add('active');
            searchOverlay.classList.add('active');
        }
    });

    // Click outside to close search results
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
            searchOverlay.classList.remove('active');
        }
    });

    // Click overlay to close search
    searchOverlay.addEventListener('click', () => {
        searchResults.classList.remove('active');
        searchOverlay.classList.remove('active');
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', () => changeZoom(25));
    zoomOutBtn.addEventListener('click', () => changeZoom(-25));
    resetZoomBtn.addEventListener('click', resetZoom);

    // View toggle
    toggleViewBtn.addEventListener('click', toggleView);

    // Year jump
    jumpBtn.addEventListener('click', jumpToYear);
    yearInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') jumpToYear();
    });

    // Timeline scroll for minimap and progress
    timelineScroll.addEventListener('scroll', updateScrollIndicators);

    // Modal controls
    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    prevEventBtn.addEventListener('click', showPreviousEvent);
    nextEventBtn.addEventListener('click', showNextEvent);

    // Keyboard shortcuts
    initKeyboardShortcuts();
}

// ==================== KEYBOARD SHORTCUTS ====================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' && e.key !== 'Escape' && e.key !== 'Enter') {
            return;
        }

        // Close modals with Escape
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) {
                closeModal();
            }
            searchResults.classList.remove('active');
        }

        // Don't process other shortcuts if modal is open
        if (modal.classList.contains('active')) {
            // Navigate events in modal
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showPreviousEvent();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                showNextEvent();
            }
            return;
        }

        // Timeline navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollTimeline(-300);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollTimeline(300);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollTimeline(-1000);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            scrollTimeline(1000);
        }

        // Zoom controls
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            changeZoom(25);
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            changeZoom(-25);
        } else if (e.key === '0') {
            e.preventDefault();
            resetZoom();
        }

        // Jump to start/end
        if (e.key === 'Home') {
            e.preventDefault();
            timelineScroll.scrollLeft = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            timelineScroll.scrollLeft = timelineScroll.scrollWidth;
        }

        // Focus search
        if (e.key === '/' || (e.ctrlKey && e.key === 'f')) {
            e.preventDefault();
            searchInput.focus();
        }

        // Toggle view
        if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            toggleView();
        }

        // Period filters (1-5)
        if (e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const filters = ['all', 'ancient', 'medieval', 'modern', 'contemporary'];
            const index = parseInt(e.key) - 1;
            if (index < filters.length) {
                const filterBtn = document.querySelector(`[data-period="${filters[index]}"]`);
                if (filterBtn) filterBtn.click();
            }
        }

        // Open selected event
        if (e.key === ' ' && selectedEventMarker) {
            e.preventDefault();
            const eventData = JSON.parse(selectedEventMarker.dataset.eventData);
            showEventModal(eventData);
        }
    });
}

// ==================== LOAD TIMELINE EVENTS ====================
async function loadTimelineEvents() {
    try {
        // Use sample data with full details (API data is too brief)
        console.log('Loading timeline with full details from sample data');
        timelineEvents = getSampleEvents();

        filteredEvents = [...timelineEvents];
        displayTimeline();
        updateMinimap();
    } catch (error) {
        console.error('Error loading timeline:', error);
        if (window.showNotification) {
            showNotification('Không thể tải dòng thời gian', 'error');
        }
    }
}

// ==================== SAMPLE EVENTS DATA ====================
function getSampleEvents() {
    return [
        {
            year: '2879 TCN',
            name: 'Lập quốc Văn Lang',
            type: 'founding',
            icon: '👑',
            period: 'ancient',
            description: 'Hùng Vương dựng nước Văn Lang, khởi đầu lịch sử dựng nước và giữ nước của dân tộc Việt Nam.',
            details: `<strong>Bối cảnh lịch sử:</strong> Theo truyền thuyết và các tài liệu lịch sử, khoảng thế kỷ VII trước Công nguyên, trên vùng đất châu thổ sông Hồng và sông Mã đã hình thành một nhà nước cổ đại mang tên Văn Lang. Đây là thời kỳ đồ đồng Đông Sơn phát triển rực rỡ.

<strong>Tổ chức nhà nước:</strong> Nước Văn Lang do các vua Hùng (18 đời) cai trị, với hệ thống tổ chức nhà nước khá hoàn chỉnh. Đất nước được chia thành 15 bộ, mỗi bộ do một Lạc tướng cai quản. Dưới Lạc tướng là Lạc hầu cai quản các ấp (làng). Quân đội được tổ chức chặt chẽ với Lạc tướng làm thống soái.

<strong>Nền văn minh lúa nước:</strong> Người Việt cổ đã phát triển nghề trồng lúa nước với kỹ thuật canh tác tiên tiến cho thời đại. Họ biết đắp đê, đào mương, chế tạo công cụ sản xuất bằng đồng và sắt. Văn hóa Đông Sơn với trống đồng nổi tiếng là minh chứng rực rỡ của nền văn minh này.

<strong>Xã hội và văn hóa:</strong> Xã hội Văn Lang đã có sự phân hóa giai cấp rõ rệt với tầng lớp quý tộc, người tự do và nô tỳ. Tín ngưỡng thờ cúng Hùng Vương, thờ thần Giao (Rồng) và thần Âu Cơ (Tiên) thể hiện nguồn gốc văn hóa đặc sắc của dân tộc.

<strong>Di sản để lại:</strong> Nước Văn Lang tồn tại khoảng 2000 năm, đặt nền móng cho lịch sử dựng nước và giữ nước của dân tộc Việt Nam. Lễ hội Giỗ Tổ Hùng Vương (10/3 Âm lịch) hàng năm là minh chứng cho lòng biết ơn của thế hệ sau đối với công đức của tiên tổ.`,
            significance: 'Đánh dấu khởi nguồn của dân tộc Việt Nam với nền văn minh lúa nước, là cơ sở cho sự hình thành và phát triển của các triều đại sau này.',
            relatedFigures: ['Lạc Long Quân', 'Âu Cơ', '18 đời Hùng Vương'],
            location: 'Đồng bằng sông Hồng và sông Mã (Phong Châu - nay là Phú Thọ)'
        },
        {
            year: '257 TCN',
            name: 'Thục Phán lập nước Âu Lạc',
            type: 'founding',
            icon: '🏰',
            period: 'ancient',
            description: 'Thục Phán đánh bại vua Hùng cuối cùng, sáp nhập Văn Lang và Âu Việt, lập nước Âu Lạc.',
            details: `<strong>Xuất thân và khởi nghĩa:</strong> Thục Phán là người dân tộc Âu Việt (người Tây Âu ở vùng núi phía Bắc). Theo sử sách, ông có xuất thân từ dòng dõi Thục (nay là vùng Tứ Chuyên, Trung Quốc). Khi vua Hùng cuối cùng cai trị yếu kém, xã hội loạn lạc, Thục Phán đã tập hợp lực lượng Âu Việt tiến xuống vùng đồng bằng.

<strong>Chiến thắng vua Hùng và lập quốc:</strong> Năm 257 TCN, Thục Phán đánh bại vua Hùng Vương thứ 18 (vị vua cuối cùng của nhà Hùng), sáp nhập Văn Lang (vùng đồng bằng) với Âu Việt (vùng núi), lập nên nước Âu Lạc. Ông lên ngôi vua, lấy hiệu là An Dương Vương, đóng đô tại Cổ Loa (nay thuộc huyện Đông Anh, Hà Nội).

<strong>Xây dựng thành Cổ Loa:</strong> An Dương Vương xây dựng kinh đô Cổ Loa với hệ thống thành quách 3 vòng (vòng ngoài, vòng giữa, vòng trong) kiên cố, là một kỳ công kiến trúc quân sự xuất sắc. Thành Cổ Loa hình xoắn ốc, có tổng chiều dài hơn 8km, cao 3-5m, sâu và rộng. Đây là công trình phòng thủ tiên tiến nhất thời đại, thể hiện trình độ tổ chức xã hội và quân sự cao.

<strong>Truyền thuyết về nỏ thần:</strong> Theo truyền thuyết, An Dương Vương được thần Kim Quy (Rùa vàng) giúp đỡ làm nỏ thần có thể bắn một lần giết hàng trăm địch. Câu chuyện về Mỵ Châu - Trọng Thủy cũng gắn với giai đoạn này, phản ánh cuộc xung đột với Triệu Đà sau này.

<strong>Tổ chức nhà nước và xã hội:</strong> Nước Âu Lạc kế thừa và phát triển tổ chức nhà nước của Văn Lang. An Dương Vương xây dựng quân đội hùng mạnh, có tổ chức chặt chẽ. Kinh tế phát triển với nông nghiệp trồng lúa nước, thủ công nghiệp đúc đồng, rèn sắt tiến bộ. Xã hội Âu Lạc đã có sự phân hóa giai cấp rõ rệt.

<strong>Sự sụp đổ:</strong> Năm 208 TCN, Triệu Đà - một tướng nhà Tần ở miền Nam Trung Quốc - lợi dụng sự suy yếu của nhà Tần để tự lập. Ông tiến đánh Âu Lạc, lợi dụng Trọng Thủy (con rể An Dương Vương) để biết bí mật nỏ thần. An Dương Vương thua trận, chạy về Cổ Loa rồi tự vẫn. Nước Âu Lạc sụp đổ, bị sáp nhập vào Nam Việt.`,
            significance: 'Đánh dấu sự phát triển của nhà nước phong kiến sơ khai. Thành Cổ Loa là di tích kiến trúc quân sự độc đáo. Sự kết hợp giữa Văn Lang (đồng bằng) và Âu Việt (miền núi) tạo nền tảng cho sự hình thành dân tộc Việt Nam.',
            relatedFigures: ['An Dương Vương Thục Phán', 'Mỵ Châu', 'Trọng Thủy', 'Kim Quy Thần'],
            location: 'Cổ Loa (Đông Anh, Hà Nội)'
        },
        {
            year: '208 TCN',
            name: 'Triệu Đà lập nước Nam Việt',
            type: 'founding',
            icon: '⚔️',
            period: 'ancient',
            description: 'Triệu Đà tiêu diệt Âu Lạc, sáp nhập vào Nam Việt, tự xưng là Nam Việt Vũ Đế.',
            details: `<strong>Xuất thân và bối cảnh:</strong> Triệu Đà là người huyện Long Xuyên, quận Chân Định (nay thuộc Hà Bắc, Trung Quốc). Ông là một tướng của nhà Tần, được cử vào Nam Hải (vùng Lĩnh Nam) để cai quản. Sau khi nhà Tần sụp đổ (năm 207 TCN), Trung Quốc rơi vào loạn lạc với cuộc chiến tranh giữa Sở và Hán. Triệu Đà lợi dụng tình thế để tự lập.

<strong>Lập nước Nam Việt:</strong> Năm 207 TCN, Triệu Đà sát nhập 3 quận Nam Hải, Quế Lâm, Tượng Quận (đại khái là vùng Lưỡng Quảng và một phần Quảng Tây ngày nay) để lập ra nước Nam Việt, tự xưng là Nam Việt Vũ Vương. Ông đóng đô tại Phiên Ngung (nay là Quảng Châu).

<strong>Xâm lược Âu Lạc:</strong> Năm 208 TCN, Triệu Đà huy quân Nam tiến, tấn công nước Âu Lạc. Theo truyền thuyết, Triệu Đà dùng mưu kế: cử Trọng Thủy (con trai mình) đến làm rể An Dương Vương. Trọng Thủy lấy được Mỵ Châu (con gái An Dương Vương) và lừa biết bí mật về nỏ thần. Khi Triệu Đà mang quân tới, An Dương Vương dùng nỏ thần bắn nhưng nỏ không linh nghiệm nữa (vì Trọng Thủy đã đánh tráo móng của Kim Quy thần). An Dương Vương thua trận, phải chạy về Cổ Loa rồi tự vẫn. Nước Âu Lạc diệt vong, bị sáp nhập vào Nam Việt.

<strong>Tổ chức nhà nước Nam Việt:</strong> Triệu Đà thiết lập bộ máy nhà nước theo kiểu phong kiến Trung Hoa nhưng có nhiều đặc thù địa phương. Ông giữ phong tục Việt (để tóc dài, mặc y phục Việt), khuyến khích sự hòa hợp giữa người Hán và người Việt. Nhà nước Nam Việt tồn tại 93 năm (từ 207 TCN đến 111 TCN) qua 5 đời vua.

<strong>Chính sách cai trị:</strong> Triệu Đà thực hiện chính sách "dĩ Hán dĩ Việt trị Việt" - vừa dùng người Hán vừa dùng người Việt để cai trị. Ông khuyến khích người Hán di cư vào Nam, khai phá ruộng đất, truyền bá văn hóa Hán. Tuy nhiên, ông cũng tôn trọng phong tục người Việt, tạo sự ổn định. Kinh tế phát triển với nông nghiệp, thủ công nghiệp, thương mại.

<strong>Quan hệ với nhà Hán:</strong> Ban đầu, Triệu Đà chấp nhận làm "thần tử" của nhà Hán để tránh chiến tranh. Nhưng khi nhà Hán cấm vận sắt và gia súc vào Nam Việt, Triệu Đà nổi giận tự xưng là "Nam Việt Vũ Đế" (Hoàng đế Nam Việt). Sau đó, do tình hình chính trị, ông lại hạ mình xuống làm vua chư hầu của Hán. Triệu Đà mất năm 137 TCN, thọ trên 100 tuổi.

<strong>Sự sụp đổ của Nam Việt:</strong> Sau Triệu Đà, các đời vua Nam Việt yếu kém. Năm 111 TCN, nhà Hán Vũ Đế cử quân tiêu diệt Nam Việt, sáp nhập vào đế quốc Hán, đặt các quận Giao Chỉ, Cửu Chân, Nhật Nam... Đây là bắt đầu thời kỳ Bắc thuộc lần thứ nhất của Việt Nam, kéo dài gần 1000 năm (111 TCN - 938).

<strong>Đánh giá lịch sử:</strong> Triệu Đà là nhân vật gây tranh cãi trong lịch sử. Ông là người Trung Hoa nhưng đã "Việt hóa" và cai trị vùng đất bao gồm cả Việt Nam Bắc bộ. Việc ông tiêu diệt Âu Lạc khiến đất nước mất độc lập, nhưng dưới thời Nam Việt, người Việt vẫn giữ được nhiều bản sắc văn hóa. Nam Việt là cầu nối giữa giai đoạn độc lập (Âu Lạc) và thời kỳ Bắc thuộc (Hán).`,
            significance: 'Đánh dấu sự kết thúc nhà nước Âu Lạc độc lập. Nam Việt là một nhà nước có tính chất đặc thù, vừa chịu ảnh hưởng văn hóa Hán vừa giữ một số bản sắc Việt. Sự sụp đổ của Nam Việt dẫn đến thời kỳ Bắc thuộc lần thứ nhất kéo dài gần 1000 năm.',
            relatedFigures: ['Triệu Đà', 'An Dương Vương', 'Mỵ Châu', 'Trọng Thủy'],
            location: 'Phiên Ngung (Quảng Châu), Cổ Loa (Hà Nội)'
        },
        {
            year: '111 TCN',
            name: 'Nhà Hán đô hộ Việt Nam',
            type: 'battle',
            icon: '⛓️',
            period: 'ancient',
            description: 'Nhà Hán tiêu diệt Nam Việt, đặt quận Giao Chỉ, bắt đầu 1000 năm Bắc thuộc.',
            details: `<strong>Bối cảnh sự sụp đổ của Nam Việt:</strong> Sau khi Triệu Đà mất (137 TCN), các đời vua Nam Việt kế tiếp (Triệu Hồ, Triệu Anh Tề, Triệu Hưng) cai trị yếu kém và có xu hướng phục tùng nhà Hán ngày càng nhiều. Đến năm 113 TCN, vua Triệu Hưng mất, vợ của ông là Cẩm Thị (người Hán Việt) làm Thái hậu nhiếp chính. Thái hậu Cẩm có ý muốn đầu hàng nhà Hán, gây bất ổn trong triều đình.

<strong>Cuộc nội chiến và sự can thiệp của Hán:</strong> Năm 112 TCN, Lữ Gia - một đại thần lão thành, trung thành với nền độc lập của Nam Việt - phản đối chính sách đầu hàng của Thái hậu Cẩm Thị. Lữ Gia nổi dậy, giết Thái hậu Cẩm, giết vua Triệu Kiến Đức (con của Triệu Hưng và Cẩm Thị), lập một người khác thuộc dòng Triệu lên làm vua. Nhà Hán lấy cớ này để cử quân xâm lược.

<strong>Cuộc xâm lược của Hán Vũ Đế:</strong> Năm 111 TCN, Hán Vũ Đế - một trong những hoàng đế hùng mạnh nhất lịch sử Trung Quốc - sai hai tướng là Lộ Bác Đức và Dương Bộc mang 10 vạn quân chia hai đường tấn công Nam Việt. Quân Hán tiến rất nhanh, phá tan quân Nam Việt. Kinh đô Phiên Ngung thất thủ. Lữ Gia và vua Nam Việt chạy trốn ra biển nhưng bị bắt giết. Nước Nam Việt diệt vong sau 93 năm tồn tại (từ 207 TCN đến 111 TCN).

<strong>Đặt quận huyện và chính sách đồng hóa:</strong> Sau khi tiêu diệt Nam Việt, nhà Hán chia vùng đất này thành 9 quận, trong đó 3 quận ở Việt Nam Bắc bộ là: <em>Giao Chỉ</em> (khu vực đồng bằng sông Hồng, trung tâm tại Luy Lâu - nay thuộc Bắc Ninh), <em>Cửu Chân</em> (khu vực Thanh Hóa - Nghệ An), và <em>Nhật Nam</em> (khu vực Quảng Bình - Quảng Trị - Thừa Thiên Huế). Hán Vũ Đế cử quan lại Hán sang cai trị, đặt Thái thủ (tương đương Thống đốc) và các quan chức để kiểm soát chặt chẽ.

<strong>Chính sách cai trị của nhà Hán:</strong> Nhà Hán áp đặt chế độ quận huyện của Trung Hoa lên Việt Nam. Họ thực hiện chính sách đồng hóa mạnh mẽ: truyền bá chữ Hán, đạo Nho, phong tục Hán; bắt dân ta đóng thuế nặng nề, cống nạp và lao dịch; cấm dùng tiếng Việt và phong tục Việt trong các công văn chính thức. Người Hán được khuyến khích di cư vào Việt Nam, chiếm đất đai, giữ các chức vụ quan trọng.

<strong>Sự áp bức và kháng cự:</strong> Dưới ách đô hộ của nhà Hán, nhân dân Việt Nam phải chịu đựng sự bóc lột và áp bức tàn khốc. Tuy nhiên, tinh thần đấu tranh của dân tộc không bao giờ tắt. Hàng loạt cuộc khởi nghĩa nổ ra trong suốt thời kỳ Bắc thuộc, tiêu biểu như: <em>Hai Bà Trưng (năm 40)</em>, <em>Bà Triệu (năm 248)</em>, <em>Lý Bí (năm 542)</em>, <em>Mai Thúc Loan (năm 722)</em>, <em>Phùng Hưng (năm 791)</em>...

<strong>Thời kỳ Bắc thuộc lần thứ nhất (111 TCN - 938):</strong> Từ năm 111 TCN đến năm 938, Việt Nam chịu sự đô hộ của các triều đại phong kiến Trung Hoa (Hán, Tam Quốc - Đông Ngô, Tấn, Lưu Tống, Nam Tề, Lương, Trần, Tùy, Đường, Nam Hán) trong gần 1000 năm. Đây là thời kỳ thử thách khắc nghiệt nhất trong lịch sử dân tộc. Tuy nhiên, nhân dân ta vẫn giữ vững bản sắc văn hóa, ngôn ngữ, phong tục và tinh thần đấu tranh giành độc lập.

<strong>Ảnh hưởng văn hóa và di sản:</strong> Mặc dù bị đô hộ, người Việt đã tiếp thu có chọn lọc các yếu tố văn hóa tiên tiến của Trung Hoa (chữ Hán, Nho giáo, Phật giáo, kỹ thuật nông nghiệp, thủ công nghiệp) để làm giàu thêm nền văn hóa Việt Nam, đồng thời vẫn giữ vững bản sắc dân tộc. Luy Lâu (Bắc Ninh) trở thành trung tâm văn hóa Phật giáo lớn nhất Đông Nam Á thời bấy giờ.

<strong>Ý nghĩa lịch sử:</strong> Thời kỳ Bắc thuộc lần thứ nhất là giai đoạn đau thương nhưng cũng tôi luyện ý chí và bản lĩnh dân tộc. Các cuộc khởi nghĩa liên tiếp chứng tỏ tinh thần bất khuất, khát khao độc lập tự do của người Việt. Cuối cùng, năm 938, Ngô Quyền đánh thắng quân Nam Hán trên sông Bạch Đằng, chấm dứt 1000 năm Bắc thuộc.`,
            significance: 'Đánh dấu bắt đầu thời kỳ Bắc thuộc lần thứ nhất kéo dài gần 1000 năm (111 TCN - 938). Dù bị đô hộ nhưng người Việt vẫn giữ vững bản sắc dân tộc và không ngừng đấu tranh giành độc lập. Thời kỳ này tôi luyện ý chí, bản lĩnh của dân tộc Việt Nam.',
            relatedFigures: ['Hán Vũ Đế', 'Lữ Gia', 'Triệu Kiến Đức', 'Thái hậu Cẩm Thị'],
            location: 'Giao Chỉ (Luy Lâu, Bắc Ninh), Cửu Chân (Thanh Hóa), Nhật Nam (Quảng Bình - Huế)'
        },
        {
            year: '40',
            name: 'Khởi nghĩa Hai Bà Trưng',
            type: 'battle',
            icon: '⚔️',
            period: 'ancient',
            description: 'Hai Bà Trưng khởi nghĩa chống ách đô hộ của nhà Đông Hán, lập nước tự chủ.',
            details: `<strong>Nguyên nhân khởi nghĩa:</strong> Sau khi nhà Hán chiếm nước ta (năm 111 TCN), chính quyền đô hộ áp đặt các chính sách bóc lột nặng nề, tàn bạo với nhân dân. Tô Định, Thái thú quận Giao Chỉ, cai trị hà khắc, bắt nạt nhân dân, thậm chí giết hại chồng của Trưng Trắc là Thi Sách - một vị tướng giàu lòng yêu nước.

<strong>Khởi nghĩa và chiến thắng:</strong> Năm 40, Trưng Trắc và Trưng Nhị - hai chị em con gái của Lạc tướng ở Mê Linh - cùng các tướng lĩnh như Phùng Thị Chính, Lê Chân nổi lên khởi nghĩa. Nghĩa quân như vũ bão, đánh chiếm liên tiếp 65 thành trì của nhà Hán, giải phóng hoàn toàn đất nước. Trưng Trắc được tôn làm Nữ Vương, xưng là Trưng Nữ Vương, đóng đô tại Mê Linh.

<strong>Thời kỳ tự chủ (40-43):</strong> Trong 3 năm cầm quyền, Hai Bà xây dựng bộ máy nhà nước, miễn thuế cho nhân dân, khôi phục nền tảng kinh tế. Đất nước tự chủ, độc lập, đặt lại tên nước là Giao Chỉ. Các chính sách của Hai Bà được dân chúng hoan nghênh, đất nước yên ổn.

<strong>Cuối cùng khởi nghĩa:</strong> Năm 42, nhà Hán cử Mã Viện - một danh tướng - mang 20 vạn quân sang đàn áp. Sau nhiều trận đánh dữ dội, nghĩa quân Hai Bà thua thiệt về vũ khí và lực lượng. Năm 43, Hai Bà rút về cứ điểm cuối cùng ở Hát Giang (nay thuộc Sơn Tây). Trước nguy cơ bị bắt sống, hai chị em đã anh dũng nhảy xuống sông Hát để giữ tiết tháo.

<strong>Ảnh hưởng sâu rộng:</strong> Khởi nghĩa Hai Bà Trưng là cuộc khởi nghĩa quy mô toàn quốc đầu tiên chống lại ách đô hộ Bắc thuộc. Dù không giành được thắng lợi cuối cùng, nhưng tinh thần bất khuất, ý chí độc lập tự chủ của Hai Bà đã trở thành biểu tượng sáng ngời trong lịch sử dân tộc. Hai Bà được thờ ở nhiều đền miếu khắp cả nước, đặc biệt là Đền Hai Bà Trưng ở Hà Nội.`,
            significance: 'Biểu tượng bất diệt của tinh thần yêu nước, ý chí giành độc lập và sức mạnh của phụ nữ Việt Nam. Khẳng định rằng dù bị đô hộ nhưng tinh thần dân tộc không bao giờ khuất phục.',
            relatedFigures: ['Trưng Trắc', 'Trưng Nhị', 'Thi Sách', 'Phùng Thị Chính', 'Lê Chân', 'Mã Viện'],
            location: 'Mê Linh (Hà Nội), Hát Giang (Sơn Tây)'
        },
        {
            year: '248',
            name: 'Khởi nghĩa Triệu Thị Trinh (Bà Triệu)',
            type: 'battle',
            icon: '🗡️',
            period: 'ancient',
            description: 'Bà Triệu (Triệu Ẩu) khởi nghĩa chống nhà Ngô, tự xưng là "Nữ tướng quân".',
            details: `<strong>Xuất thân và động lực khởi nghĩa:</strong> Triệu Thị Trinh (tên gọi khác là Triệu Ẩu, Bà Triệu) sinh năm 225 tại làng Cẩm Khê, quận Cửu Chân (nay thuộc huyện Triệu Sơn, tỉnh Thanh Hóa). Bà là con gái của một gia đình Lạc tướng, từ nhỏ đã nổi tiếng về sức khỏe, dũng cảm và tài năng. Sau khi cha mẹ mất, bà sống với anh trai Triệu Quốc Đạt. Chịu không nổi sự áp bức của quan lại nhà Ngô và thấy đồng bào khổ sở, bà quyết tâm nổi dậy.

<strong>Câu nói bất hủ:</strong> Khi anh trai khuyên can, bà Triệu đã nói câu nổi tiếng: <em>"Tôi chỉ muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá mập biển Đông, dẹp sạch bờ cõi, cứu dân ra khỏi nạn lụt sang, lấy lại nền tự chủ cho nước, chẳng nỡ khom lưng làm tì thiếp cho người."</em> Câu nói này thể hiện khí phách hào hùng, lý tưởng cao cả của một nữ anh hùng.

<strong>Khởi nghĩa và chiến đấu:</strong> Năm 248, khi mới 23 tuổi, Bà Triệu cùng anh trai Triệu Quốc Đạt khởi nghĩa ở Cửu Chân. Bà tự xưng là "Nữ tướng quân", tập hợp được hàng nghìn người theo. Nghĩa quân Bà Triệu chiến đấu dũng cảm, đánh chiếm nhiều thành trì của địch. Theo sử sách, Bà cao gần 9 tấc (khoảng 2,7m - con số này có thể là phóng đại để tôn vinh), ngực dài 3 tấc, mặc áo vàng, cưỡi voi chiến, oai phong lẫm liệt.

<strong>Chiến thuật và tác chiến:</strong> Bà Triệu sử dụng địa hình núi rừng Cửu Chân để đánh du kích. Quân của bà cơ động nhanh, đánh úp bất ngờ, khiến quân Ngô rất e ngại. Trong 6 tháng, bà đánh hơn 30 trận, đều thắng lợi. Tiếng tăm của "Nữ tướng quân" lan rộng, nhiều vùng nổi dậy hưởng ứng.

<strong>Thất bại và hy sinh:</strong> Nhà Ngô cử Lục Dận - một tướng giỏi - mang đại quân tới đàn áp. Lục Dận sử dụng chiến thuật kỳ quái: cho lính khỏa thân, vẽ mình ra trận. Quân của bà, trong đó có nhiều phụ nữ, thấy vậy xấu hổ, lung tung trận địa. Nghĩa quân thua trận. Bà Triệu rút về Tục Sơn (Núi Tức, Thanh Hóa). Trước nguy cơ bị bắt, năm 248, Bà Triệu tự vẫn ở tuổi 23. Theo truyền thuyết, hồn bà bay về núi Tức, biến thành tiên canh giữ quê hương.

<strong>Di sản và tôn thờ:</strong> Nhân dân Việt Nam kính trọng và tôn thờ Bà Triệu như một vị thánh nữ anh hùng. Đền thờ Bà Triệu ở Thanh Hóa là nơi hàng năm nhân dân đến dâng hương, tưởng nhớ. Hình ảnh Bà Triệu cưỡi voi, áo vàng tung bay đã trở thành biểu tượng của lòng yêu nước và tinh thần bất khuất của phụ nữ Việt Nam.`,
            significance: 'Khẳng định truyền thống anh hùng bất khuất của phụ nữ Việt Nam, tiếp nối Hai Bà Trưng. Câu nói "cưỡi cơn gió mạnh, đạp luồng sóng dữ" trở thành khí phách của những người phụ nữ Việt yêu nước. Bà Triệu là biểu tượng của ý chí giành độc lập, không khuất phục trước bất kỳ áp bức nào.',
            relatedFigures: ['Triệu Thị Trinh (Bà Triệu)', 'Triệu Quốc Đạt', 'Lục Dận'],
            location: 'Cửu Chân (Triệu Sơn, Thanh Hóa), Núi Tức'
        },
        {
            year: '544',
            name: 'Khởi nghĩa Lý Bí',
            type: 'battle',
            icon: '👑',
            period: 'ancient',
            description: 'Lý Bí khởi nghĩa đánh đuổi nhà Lương, lập nước Vạn Xuân - nhà nước độc lập đầu tiên.',
            details: `<strong>Bối cảnh và xuất thân:</strong> Sau hơn 600 năm Bắc thuộc, nhân dân Việt Nam chịu sự áp bức nặng nề từ các triều đại phong kiến Trung Hoa (Hán, Đông Ngô, Tấn, Nam Tề, Lương). Thế kỷ VI, nhà Lương cai trị hà khắc, bóc lột dân ta tàn tệ, gây bất bình trong nhân dân. Lý Bí (tên thật là Lý Bôn hoặc Lý Bí Đàn) sinh năm 503, quê ở quận Giao Chỉ (nay thuộc Bắc Ninh), là người xuất thân từ tầng lớp hào trưởng địa phương. Ông thông minh, tài giỏi, có uy tín trong dân.

<strong>Chuẩn bị khởi nghĩa:</strong> Lý Bí và Triệu Túc - một vị tướng tài năng - bí mật chuẩn bị lực lượng, vũ khí, lương thực. Họ liên kết với các tù trưởng (thủ lĩnh địa phương), hào trưởng và nhân dân để tạo thành một lực lượng hùng hậu. Kế hoạch khởi nghĩa được chuẩn bị kỹ lưỡng, chờ thời cơ thuận lợi.

<strong>Khởi nghĩa và giành độc lập (năm 542-544):</strong> Năm 541, Tiêu Tư (Thái thú Giao Châu, người nhà Lương) cai trị tàn bạo, bắt người để đắp thành, gây phẫn nộ toàn dân. Năm 542, Lý Bí nổi dậy khởi nghĩa tại Chu Diên (Hải Dương). Nghĩa quân như vũ bão, nhân dân đồng loạt hưởng ứng. Trong vòng vài tháng, quân Lý Bí chiếm được nhiều vùng đất, đánh bại quân Lương. Năm 544, nghĩa quân tiến đánh thành Long Biên (kinh đô Giao Châu, nay là Hà Nội), đánh bại và giết Tiêu Tư. Toàn bộ đất Giao Châu được giải phóng khỏi ách đô hộ của nhà Lương.

<strong>Lập nước Vạn Xuân:</strong> Sau khi giành thắng lợi, năm 544, Lý Bí lên ngôi hoàng đế, lấy hiệu là <em>Lý Nam Đế</em>, đặt quốc hiệu là <em>Vạn Xuân</em> (nghĩa là "Muôn năm xuân"), đóng đô tại Long Biên. Đây là lần đầu tiên sau hơn 600 năm Bắc thuộc, người Việt lập được một nhà nước độc lập hoàn toàn với tên gọi riêng. Lý Nam Đế tự xưng là "Thiên tử" (Hoàng đế), không phải là chư hầu của Trung Hoa, thể hiện ý chí độc lập tự chủ hoàn toàn.

<strong>Tổ chức nhà nước và xây dựng đất nước:</strong> Lý Nam Đế xây dựng bộ máy nhà nước, phong tước cho các tướng lĩnh có công. Triệu Túc được phong làm "Đô đốc thần binh", giữ vai trò tư lệnh quân đội. Nhà nước Vạn Xuân được tổ chức theo mô hình phong kiến tập quyền, có hệ thống quan lại, quân đội. Lý Nam Đế khuyến khích sản xuất, giảm thuế, chăm lo đời sống nhân dân. Kinh tế xã hội phục hồi sau nhiều năm chiến tranh.

<strong>Cuộc chiến chống quân Lương phản công:</strong> Năm 545, nhà Lương cử Trần Bá Tiên mang đại quân sang đàn áp. Quân Lương hùng mạnh, tiến đánh ác liệt. Sau nhiều trận đánh, năm 547, quân Lương chiếm lại Long Biên. Lý Nam Đế phải rút lui về vùng núi Tây Bắc (Hòa Bình, Sơn La), tiếp tục kháng chiến du kích. Năm 548, Lý Nam Đế mất tại vùng Khúc Thừa (nay là Hòa Bình), hưởng thọ 45 tuổi.

<strong>Triệu Quang Phục tiếp tục cuộc kháng chiến:</strong> Sau khi Lý Nam Đế mất, Triệu Quang Phục - một tướng tài năng - được suy tôn lên kế vị, lấy hiệu là <em>Triệu Việt Vương</em>. Ông tiếp tục cuộc kháng chiến chống quân Lương. Triệu Quang Phục rất dũng cảm, tài giỏi, đánh nhiều trận thắng lợi. Năm 550, ông giải phóng lại Long Biên, đuổi quân Lương ra khỏi đất nước. Triệu Quang Phục cai trị nước Vạn Xuân từ năm 550 đến năm 571, duy trì độc lập và ổn định đất nước. Năm 571, quân Tùy (kế tiếp nhà Lương) lại xâm lược, Triệu Quang Phục chiến đấu quyết liệt nhưng cuối cùng thất bại, nước Vạn Xuân sụp đổ. Đất nước lại rơi vào tay Bắc thuộc.

<strong>Ý nghĩa lịch sử vĩ đại:</strong> Khởi nghĩa Lý Bí và nhà nước Vạn Xuân (544-571) có ý nghĩa to lớn trong lịch sử dân tộc:
- <em>Nhà nước độc lập đầu tiên:</em> Lần đầu tiên sau hơn 600 năm Bắc thuộc, người Việt lập được nhà nước độc lập hoàn toàn, có quốc hiệu, có hoàng đế tự xưng Thiên tử.
- <em>Khẳng định tinh thần tự chủ:</em> Chứng tỏ dân tộc Việt Nam không chấp nhận cảnh lệ thuộc, có khả năng tự quản lý, tự cai trị đất nước.
- <em>Truyền cảm hứng cho các thế hệ sau:</em> Mô hình nhà nước Vạn Xuân trở thành tấm gương sáng cho các cuộc khởi nghĩa sau này như Mai Thúc Loan (722), Phùng Hưng (791) và cuối cùng là Ngô Quyền (938) giành lại độc lập lâu dài.

<strong>Di sản:</strong> Lý Bí và Triệu Quang Phục được thờ phụng như những anh hùng dân tộc. Tên của họ gắn liền với tinh thần bất khuất, ý chí giành độc lập của dân tộc Việt Nam. Câu chuyện về nước Vạn Xuân là minh chứng cho niềm tin: "Dù bị đô hộ bao nhiêu lần, dân tộc Việt Nam vẫn luôn đứng lên, giành lại độc lập."`,
            significance: 'Lập ra nhà nước độc lập đầu tiên sau hơn 600 năm Bắc thuộc. Chứng minh người Việt có đủ năng lực tự cai trị, tự quản lý đất nước. Mở đường cho các cuộc khởi nghĩa sau này giành độc lập lâu dài. Truyền cảm hứng và niềm tin cho các thế hệ sau về tinh thần bất khuất, ý chí giành độc lập của dân tộc.',
            relatedFigures: ['Lý Bí (Lý Nam Đế)', 'Triệu Túc', 'Triệu Quang Phục (Triệu Việt Vương)', 'Tiêu Tư', 'Trần Bá Tiên'],
            location: 'Long Biên (Hà Nội), Chu Diên (Hải Dương), Khúc Thừa (Hòa Bình)'
        },
        {
            year: '722',
            name: 'Khởi nghĩa Mai Thúc Loan',
            type: 'battle',
            icon: '⚔️',
            period: 'ancient',
            description: 'Mai Thúc Loan khởi nghĩa chống nhà Đường, tự xưng là Hắc Y Thiên Vương.',
            details: `<strong>Bối cảnh lịch sử:</strong> Sau khi nước Vạn Xuân của Triệu Quang Phục sụp đổ (571), Việt Nam lại rơi vào tay Bắc thuộc. Thời nhà Tùy (581-618) và nhà Đường (618-907), chính sách cai trị của Trung Hoa ở Việt Nam rất khắc nghiệt. Nhà Đường áp đặt thuế khóa nặng nề, bắt người ta làm lính, lao dịch khổ sai. Quan lại nhà Đường tham nhũng, bóc lột, hà khắc với nhân dân. Thế kỷ VIII, sự bất bình tích tụ, chờ người đứng lên lãnh đạo.

<strong>Xuất thân và khởi nghĩa:</strong> Mai Thúc Loan (còn gọi là Mai Hắc Đế) là người ở Hoan Châu (nay thuộc Nghệ An), xuất thân từ một gia đình thường dân nghèo khó. Theo sử sách, ông là người có tài, dũng cảm, yêu nước. Chứng kiến cảnh đồng bào chịu khổ, ông quyết tâm nổi dậy. Năm 722 (đời Đường Huyền Tông), Mai Thúc Loan cùng anh trai là Mai Thúc Loan (có tài liệu ghi tên khác nhau) tập hợp nhân dân nghèo, nông dân, thợ thủ công khởi nghĩa chống nhà Đường.

<strong>Tự xưng Hắc Y Thiên Vương:</strong> Sau khi khởi nghĩa, Mai Thúc Loan tự xưng là <em>"Hắc Y Thiên Vương"</em> (Vua trời áo đen). Tên gọi này có ý nghĩa sâu sắc: "Hắc Y" (áo đen) tượng trưng cho tầng lớp bình dân, người lao động nghèo khổ (vì người nghèo thường mặc áo đen thô); "Thiên Vương" thể hiện quyền lực tối cao, tự xưng là vua do Trời phong. Điều này cho thấy khởi nghĩa Mai Thúc Loan có tính chất của một cuộc nổi dậy của giai cấp bình dân, nông dân chống chế độ phong kiến áp bức.

<strong>Lập nước và tổ chức:</strong> Mai Thúc Loan lập ra chính quyền riêng, tự xưng hoàng đế, đặt niên hiệu, phong tước cho các tướng lĩnh. Ông xây dựng quân đội, tổ chức bộ máy nhà nước theo kiểu phong kiến. Đất nước được gọi là "Hắc Y Quốc" (Nước Áo Đen). Nghĩa quân Mai Thúc Loan chiếm được nhiều vùng đất ở miền Trung và miền Bắc Việt Nam, đặc biệt là vùng Hoan Châu (Nghệ An) và Ái Châu (Thanh Hóa).

<strong>Cuộc chiến chống quân Đường:</strong> Nhà Đường rất lo ngại trước sức mạnh của khởi nghĩa Mai Thúc Loan. Năm 722, Đường Huyền Tông sai Dương Tư Húc - một tướng giỏi - mang quân sang đàn áp. Quân Đường tiến đánh ác liệt. Nghĩa quân Mai Thúc Loan chiến đấu dũng cảm, sử dụng địa hình núi rừng để kháng chiến du kích. Nhiều trận đánh diễn ra, hai bên thắng thua lẫn nhau. Tuy nhiên, do lực lượng và vũ khí kém hơn, nghĩa quân dần dần rơi vào thế bị động.

<strong>Thất bại và hy sinh:</strong> Sau nhiều tháng chiến đấu quyết liệt, do quân Đường đông đảo hơn, vũ khí tinh nhuệ hơn, thêm vào đó sự chia rẽ nội bộ, nghĩa quân Mai Thúc Loan dần thất thế. Năm 723, quân Đường đánh bại nghĩa quân. Mai Thúc Loan bị bắt và bị giết hại. Khởi nghĩa thất bại, nhưng tinh thần bất khuất của Mai Thúc Loan và nghĩa quân đã ghi dấu ấn sâu đậm trong lòng dân.

<strong>Nguyên nhân thất bại:</strong>
- <em>Lực lượng chưa đủ mạnh:</em> Nghĩa quân chủ yếu là nông dân, lao động nghèo, chưa được huấn luyện bài bản, vũ khí thô sơ.
- <em>Đối thủ quá mạnh:</em> Nhà Đường là một đế quốc hùng mạnh, có quân đội tinh nhuệ, vũ khí hiện đại.
- <em>Chưa có liên minh rộng rãi:</em> Khởi nghĩa chưa liên kết được với các tầng lớp hào trưởng, địa chủ.
- <em>Thiếu hậu cần:</em> Lương thực, vũ khí, hậu cần không đủ để chiến đấu lâu dài.

<strong>Ý nghĩa lịch sử:</strong> Mặc dù thất bại, khởi nghĩa Mai Thúc Loan vẫn có ý nghĩa quan trọng:
- <em>Tiếp nối truyền thống đấu tranh:</em> Sau Lý Bí (544) và Triệu Quang Phục (571), Mai Thúc Loan là người tiếp tục cầm cờ chống Bắc thuộc, giữ cho ngọn lửa yêu nước không bao giờ tắt.
- <em>Tiếng nói của giai cấp bình dân:</em> Đây là cuộc khởi nghĩa có tính chất giai cấp rõ nét, đại diện cho nông dân và người nghèo khổ.
- <em>Truyền cảm hứng cho sau này:</em> Tinh thần "Hắc Y Thiên Vương" trở thành biểu tượng của sự nổi dậy chống áp bức, kích thích các cuộc khởi nghĩa sau như Phùng Hưng (791) và Ngô Quyền (938).

<strong>Di sản:</strong> Mai Thúc Loan được tôn vinh là anh hùng dân tộc. Nhân dân Nghệ An - Thanh Hóa thờ phụng ông như một vị thánh. Hình ảnh "Hắc Y Thiên Vương" đại diện cho sức mạnh của người bình dân, sẵn sàng đứng lên chiến đấu vì độc lập, tự do.`,
            significance: 'Tiếp nối truyền thống đấu tranh giành độc lập sau Lý Bí và Triệu Quang Phục. Thể hiện sức mạnh và ý chí của giai cấp bình dân, nông dân chống áp bức. Giữ cho ngọn lửa yêu nước không bao giờ tắt, truyền cảm hứng cho các cuộc khởi nghĩa sau này.',
            relatedFigures: ['Mai Thúc Loan (Mai Hắc Đế)', 'Dương Tư Húc'],
            location: 'Hoan Châu (Nghệ An), Ái Châu (Thanh Hóa)'
        },
        {
            year: '791',
            name: 'Khởi nghĩa Phùng Hưng',
            type: 'battle',
            icon: '👑',
            period: 'ancient',
            description: 'Phùng Hưng khởi nghĩa, tự xưng là Bố Cái Đại Vương, cai trị độc lập 20 năm.',
            details: `<strong>Bối cảnh cuối thế kỷ VIII:</strong> Cuối thế kỷ VIII, nhà Đường đã qua thời kỳ cực thịnh (thời Đường Huyền Tông), bắt đầu suy yếu sau loạn An Lộc Sơn (755-763). Ở Việt Nam, các quan lại Đường cai trị tham nhũng, hà khắc, bóc lột nhân dân nặng nề. Năm 791, Cao Chính Bình - Đô hộ An Nam (Thống đốc do nhà Đường cử sang cai trị Giao Châu) - đặc biệt tàn bạo, thu thuế khắc nghiệt, nhân dân không chịu đựng nổi.

<strong>Xuất thân và danh tiếng của Phùng Hưng:</strong> Phùng Hưng sinh năm 761, người làng Đường Lâm (nay thuộc Sơn Tây, Hà Nội), xuất thân từ gia đình hào trưởng địa phương. Theo sử sách, Phùng Hưng cao lớn, khỏe mạnh (cao 10 tấc, tức khoảng 3m - con số này có thể được phóng đại), có sức mạnh phi thường, tài giỏi, có uy tín với nhân dân. Ông làm quan cho nhà Đường nhưng thấy quan lại bất công, quyết tâm đứng lên vì dân.

<strong>Khởi nghĩa năm 791:</strong> Năm 791, do không chịu nổi sự áp bức của Cao Chính Bình, Phùng Hưng cùng anh ruột là Phùng Hải tập hợp hào trưởng địa phương và nhân dân nổi dậy khởi nghĩa. Nghĩa quân tiến đánh thành Long Biên (kinh đô An Nam). Cao Chính Bình hoảng sợ, bỏ chạy. Quân Phùng Hưng chiếm lại Long Biên và toàn bộ đất Giao Châu. Sự thành công nhanh chóng này cho thấy sức mạnh của khởi nghĩa và lòng ủng hộ nhiệt tình của nhân dân.

<strong>Tự xưng Bố Cái Đại Vương và cai trị:</strong> Sau khi giải phóng đất nước, Phùng Hưng được nhân dân tôn lên làm vua. Ông không tự xưng là hoàng đế mà khiêm tốn lấy hiệu là <em>"Bố Cái Đại Vương"</em> (Vua cha mẹ vĩ đại). Tên gọi này thể hiện triết lý cai trị của ông: coi dân như con, yêu thương và chăm sóc nhân dân như cha mẹ. Đây là một quan niệm cai trị rất nhân văn, được dân chúng yêu mến.

<strong>Chính sách cai trị nhân đạo:</strong> Trong thời gian cai trị, Phùng Hưng thực hiện nhiều chính sách tốt:
- <em>Giảm thuế nhẹ tô:</em> Giảm thuế khóa, miễn lao dịch cho nhân dân nghèo.
- <em>Chăm lo đời sống:</em> Khuyến khích sản xuất, phát triển nông nghiệp, thủ công nghiệp.
- <em>Cai trị công bằng:</em> Xử án công minh, trừng trị tham nhũng, bảo vệ quyền lợi của dân.
- <em>Gìn giữ hòa bình:</em> Duy trì an ninh, trật tự xã hội, để nhân dân yên ổn sinh sống.

<strong>Thời kỳ độc lập tự chủ:</strong> Dưới thời Phùng Hưng, đất nước được độc lập tự chủ. Mặc dù nhà Đường không chính thức công nhận, nhưng do đang suy yếu nên không đủ sức can thiệp. Phùng Hưng không công khai đối đầu với nhà Đường, nhưng thực tế cai trị hoàn toàn độc lập. Đất nước yên bình, kinh tế phục hồi, nhân dân no ấm. Phùng Hưng được dân chúng kính trọng như một vị vua hiền.

<strong>Phùng Hưng mất (802) và Phùng An kế vị:</strong> Năm 802, Phùng Hưng mất, hưởng thọ 41 tuổi, sau 11 năm cai trị (791-802). Con trai ông là Phùng An kế vị, tiếp tục cai trị đất nước. Phùng An được tôn là <em>"Phùng Thiên Vương"</em>. Ông cũng tiếp tục chính sách nhân đạo của cha, yêu thương và chăm lo nhân dân. Phùng An cai trị từ 802 đến 819, tổng cộng 17 năm.

<strong>Nhà Đường trở lại (819):</strong> Năm 819, nhà Đường có phần hồi phục, quyết định đưa quân sang chiếm lại Giao Châu. Phùng An không đủ sức chống trả, phải đầu hàng. Nhà Đường đặt lại chính quyền đô hộ ở Giao Châu. Thời kỳ độc lập của Phùng Hưng - Phùng An kết thúc sau 28 năm (791-819, gồm 11 năm Phùng Hưng và 17 năm Phùng An). Tuy nhiên, di sản của họ vẫn sống mãi trong lòng dân.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Thời kỳ độc lập quý giá:</em> Trong gần 30 năm, đất nước được tự chủ, nhân dân được sống yên bình, không phải chịu sự áp bức của chính quyền đô hộ.
- <em>Mô hình cai trị nhân đạo:</em> Phùng Hưng đề cao triết lý "dân vi quý", coi dân là gốc, cai trị bằng lòng nhân ái. Đây là tấm gương về một vị vua hiền, được nhân dân yêu mến.
- <em>Tích lũy kinh nghiệm:</em> Gần 30 năm độc lập giúp dân tộc tích lũy kinh nghiệm về tổ chức nhà nước, quản lý đất nước, chuẩn bị nền tảng cho cuộc giành độc lập lâu dài sau này (Ngô Quyền 938).

<strong>Thờ phụng và di sản:</strong> Phùng Hưng được thờ phụng rộng rãi ở nhiều nơi, đặc biệt là Đền Đường Lâm (Sơn Tây) và Đền Hát Môn (Hà Nội). Nhân dân tôn ông là <em>"Đại Vương Bố Cái"</em>, "Phùng Vương", thờ cúng như một vị thần hộ mệnh, bảo vệ quê hương. Hình ảnh Phùng Hưng cao lớn, uy nghiêm nhưng nhân từ đã trở thành biểu tượng của một vị vua hiền, yêu thương dân như con. Câu chuyện về Phùng Hưng nhắc nhở thế hệ sau: "Người cai trị phải lấy dân làm gốc, yêu thương và chăm sóc nhân dân."`,
            significance: 'Duy trì độc lập tự chủ trong gần 30 năm (791-819). Thể hiện mô hình cai trị nhân đạo, lấy dân làm gốc. Tích lũy kinh nghiệm về tổ chức và quản lý nhà nước độc lập, chuẩn bị nền tảng cho cuộc giành độc lập lâu dài (Ngô Quyền 938).',
            relatedFigures: ['Phùng Hưng (Bố Cái Đại Vương)', 'Phùng An (Phùng Thiên Vương)', 'Phùng Hải', 'Cao Chính Bình'],
            location: 'Long Biên (Hà Nội), Đường Lâm (Sơn Tây)'
        },
        {
            year: '938',
            name: 'Trận Bạch Đằng (Ngô Quyền)',
            type: 'battle',
            icon: '⚔️',
            period: 'medieval',
            description: 'Ngô Quyền đánh thắng quân Nam Hán trên sông Bạch Đằng, chấm dứt nghìn năm Bắc thuộc.',
            details: `<strong>Bối cảnh lịch sử:</strong> Sau khi nhà Đường suy yếu và sụp đổ, Dương Đình Nghệ - một vị Tiết độ sứ tài năng - đã cai quản tự chủ vùng Giao Châu. Năm 937, Kiều Công Tiễn giết Dương Đình Nghệ và xưng làm Tiết độ sứ, đồng thời cầu viện nhà Nam Hán (một chính quyền ở miền Nam Trung Quốc) để củng cố quyền lực.

<strong>Chuẩn bị chiến đấu:</strong> Ngô Quyền - con rể của Dương Đình Nghệ - quyết tâm báo thù và giải phóng đất nước. Ông tập hợp nghĩa quân, đánh bại Kiều Công Tiễn. Khi nhà Nam Hán điều hạm đội lớn do Lưu Hoằng Tháo chỉ huy (con vua Nam Hán) kéo sang xâm lược, Ngô Quyền đã chuẩn bị chiến lược phòng thủ tuyệt vời.

<strong>Chiến thuật cọc ngầm:</strong> Ngô Quyền nghiên cứu kỹ địa hình sông Bạch Đằng và quy luật thủy triều. Ông cho đóng hàng ngàn cọc sắt nhọn dưới lòng sông, phần ngọn cọc có gắn dao sắc, vừa đủ chìm dưới nước khi thủy triều lên cao. Chiến thuật này thể hiện trí tuệ quân sự và sự am hiểu địa lý của người Việt.

<strong>Diễn biến trận chiến:</strong> Khi quân Nam Hán tiến vào sông Bạch Đằng lúc nước triều lên cao, Ngô Quyền cho quân đội giả thua, dụ địch đuổi theo. Khi thủy triều xuống, cọc ngầm lộ ra, thuyền chiến của địch bị cọc đâm thủng, quân lính rơi xuống nước. Ngô Quyền ra lệnh tổng phản công, đánh tan hoàn toàn quân Nam Hán. Lưu Hoằng Tháo bị giết, hạm đội tan vỡ.

<strong>Ý nghĩa lịch sử:</strong> Chiến thắng Bạch Đằng năm 938 là bước ngoặt vĩ đại trong lịch sử dân tộc. Sau 1000 năm Bắc thuộc (từ 111 TCN đến 938), đất nước ta giành lại độc lập hoàn toàn. Ngô Quyền lên ngôi vua năm 939, lập ra nhà Ngô, mở đầu thời kỳ tự chủ lâu dài. Chiến thắng này còn để lại bài học về nghệ thuật quân sự: kết hợp thiên thời, địa lợi, nhân hòa để đánh thắng kẻ địch hùng mạnh.`,
            significance: 'Kết thúc 1000 năm Bắc thuộc, mở đầu kỷ nguyên độc lập tự chủ của Việt Nam. Khẳng định tài năng quân sự và ý chí quyết tâm giành độc lập của dân tộc.',
            relatedFigures: ['Ngô Quyền', 'Dương Đình Nghệ', 'Kiều Công Tiễn', 'Lưu Hoằng Tháo'],
            location: 'Sông Bạch Đằng (Quảng Ninh)'
        },
        {
            year: '968',
            name: 'Đinh Bộ Lĩnh thống nhất đất nước',
            type: 'founding',
            icon: '👑',
            period: 'medieval',
            description: 'Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, thống nhất đất nước, lập nhà Đinh, tự xưng là Đại Thắng Minh Hoàng Đế.',
            details: `<strong>Thời kỳ loạn 12 sứ quân (944-968):</strong> Sau khi Ngô Quyền mất (năm 944), các con ông tranh giành ngôi vua, đất nước rối loạn. Quyền lực chia cắt, nhiều hào trưởng địa phương tự xưng là vua, gọi là "sứ quân" (tướng quân). Có 12 sứ quân chia cắt đất nước, mỗi người chiếm một vùng, tự cai trị: Ngô Xương Ngập (Đường Lâm), Đỗ Cảnh Thạc (Đỗ Động Giang), Kiều Công Tiễn (Phong Châu), Nguyễn Khoan (Tam Đái), v.v... Đất nước chia năm xẻ bảy, chiến tranh liên miên, nhân dân đau khổ.

<strong>Xuất thân và phát tích của Đinh Bộ Lĩnh:</strong> Đinh Bộ Lĩnh sinh năm 924 tại Hoa Lư (Ninh Bình), con của Đinh Công Trứ - một tướng của Ngô Quyền. Từ nhỏ, Đinh Bộ Lĩnh đã thể hiện khí phách phi thường. Theo truyền thuyết, khi còn nhỏ, ông thường tập hợp con em trong làng, giả làm vua tướng, chỉ huy đánh trận. Lớn lên, ông theo Trần Lãm (một trong 12 sứ quân) làm tướng, tài giỏi trong chiến đấu và có uy tín với quân sĩ.

<strong>Vươn lên và thống nhất đất nước (965-968):</strong> Sau khi Trần Lãm mất, Đinh Bộ Lĩnh lên thay, trở thành một sứ quân. Với tài năng quân sự xuất chúng và khát vọng thống nhất đất nước, ông bắt đầu chinh phạt các sứ quân khác. Từ năm 965 đến 968, Đinh Bộ Lĩnh lần lượt đánh bại 11 sứ quân còn lại, thống nhất cả nước. Các trận chiến diễn ra ác liệt, Đinh Bộ Lĩnh sử dụng chiến thuật linh hoạt, vừa đánh vừa mua chuộc, vừa dùng uy vừa dùng đức để chinh phục đối thủ.

<strong>Lập quốc hiệu Đại Cồ Việt (968):</strong> Năm 968, sau khi hoàn toàn thống nhất đất nước, Đinh Bộ Lĩnh lên ngôi hoàng đế, tự xưng là <em>"Đại Thắng Minh Hoàng Đế"</em>, lấy hiệu là <em>Đinh Tiên Hoàng</em>. Ông đặt quốc hiệu là <em>Đại Cồ Việt</em> (nghĩa là "Nước Việt vĩ đại, cường thịnh"). Đây là lần đầu tiên một vương triều Việt Nam độc lập có quốc hiệu chính thức. Đinh Tiên Hoàng đóng đô tại Hoa Lư (Ninh Bình), một vùng đất địa thế hiểm trở, dễ phòng thủ.

<strong>Xây dựng bộ máy nhà nước tập quyền:</strong> Đinh Tiên Hoàng xây dựng bộ máy nhà nước phong kiến tập quyền đầu tiên của Việt Nam:
- <em>Phân định ngôi vị:</em> Lập thái tử Đinh Liễn, phong hoàng hậu Dương Vân Nga.
- <em>Đặt quan chức:</em> Lập "Thập đạo tướng quân" (10 đạo quân) để cai quản quân đội và các vùng đất. Mỗi đạo do một tướng lĩnh tài năng chỉ huy.
- <em>Xây dựng luật pháp nghiêm minh:</em> Ban hành bộ luật khắt khe với nhiều hình phạt nặng nề như chém, trảm, thiêu sống... để duy trì kỷ cương, trật tự sau thời kỳ loạn lạc.
- <em>Phong tước cho các công thần:</em> Các tướng lĩnh có công được phong làm vương, hầu để gắn kết lòng người.

<strong>Chính sách đối ngoại khôn khéo:</strong> Để đất nước non trẻ được yên ổn phát triển, Đinh Tiên Hoàng thực hiện chính sách ngoại giao linh hoạt với nhà Tống (Trung Quốc):
- Năm 971, ông sai sứ sang nhà Tống xin "sách phong" (công nhận), đồng ý làm chư hầu (hình thức). Nhà Tống phong ông làm "An Nam Quận Vương" (Vua quận An Nam), công nhận quyền cai trị của Đinh Tiên Hoàng.
- Mặc dù chấp nhận làm "chư hầu" về hình thức, nhưng thực tế Đinh Tiên Hoàng cai trị hoàn toàn độc lập, có quân đội, luật pháp, nghi lễ riêng.

<strong>Bi kịch cung đình (979):</strong> Năm 979, một bi kịch đẫm máu xảy ra trong cung đình. Đỗ Thích - một thái giám - đã giết chết Đinh Tiên Hoàng và thái tử Đinh Liễn khi họ đang say rượu. Nguyên nhân có thể do tranh chấp quyền lực trong triều đình. Đinh Tiên Hoàng hưởng thọ 55 tuổi, trị vì 11 năm (968-979). Con trai thứ hai của ông là Đinh Toàn (6 tuổi) lên kế vị. Hoàng hậu Dương Vân Nga nhiếp chính. Tình hình chính trị rất bất ổn, nội loạn, ngoại xâm đe dọa.

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Thống nhất đất nước:</em> Kết thúc 24 năm loạn 12 sứ quân, tái lập đất nước thống nhất, độc lập.
- <em>Lập nền móng nhà nước phong kiến:</em> Xây dựng bộ máy nhà nước tập quyền đầu tiên, đặt nền móng cho các triều đại phong kiến sau này (Lê, Lý, Trần, Lê Sơ, Nguyễn).
- <em>Có quốc hiệu chính thức:</em> Đại Cồ Việt là quốc hiệu chính thức đầu tiên, khẳng định chủ quyền độc lập.
- <em>Chính sách ngoại giao khôn ngoan:</em> Biết cân bằng giữa độc lập và hòa bình, tránh chiến tranh với cường quốc để xây dựng đất nước.

<strong>Di sản:</strong> Đinh Tiên Hoàng được tôn là vị vua có công lớn trong việc thống nhất và xây dựng đất nước. Cố đô Hoa Lư (Ninh Bình) ngày nay vẫn còn di tích Đền Đinh Tiên Hoàng, nơi thờ phụng ông như một vị anh hùng dân tộc, người đặt nền móng cho nhà nước phong kiến độc lập.`,
            significance: 'Kết thúc loạn 12 sứ quân, thống nhất đất nước. Lập nền móng nhà nước phong kiến tập quyền đầu tiên. Đặt quốc hiệu Đại Cồ Việt, khẳng định chủ quyền độc lập. Mở đường cho các triều đại phong kiến phát triển hưng thịnh.',
            relatedFigures: ['Đinh Tiên Hoàng Đinh Bộ Lĩnh', 'Đinh Liễn', 'Dương Vân Nga', 'Đỗ Thích', 'Trần Lãm'],
            location: 'Hoa Lư (Ninh Bình)'
        },
        {
            year: '981',
            name: 'Chiến thắng chống quân Tống (Lê Hoàn)',
            type: 'battle',
            icon: '⚔️',
            period: 'medieval',
            description: 'Lê Hoàn đánh bại 30 vạn quân Tống xâm lược, bảo vệ độc lập dân tộc.',
            details: `<strong>Bối cảnh sau bi kịch nhà Đinh:</strong> Sau khi Đinh Tiên Hoàng và thái tử Đinh Liễn bị Đỗ Thích giết hại (979), tình hình chính trị vô cùng bất ổn. Vua Đinh Toàn mới 6 tuổi, hoàng hậu Dương Vân Nga nhiếp chính. Nội bộ triều đình rối loạn, ngoại xâm đe dọa. Nhà Tống (Trung Quốc) thấy đây là cơ hội tốt để xâm lược, sáp nhập Đại Cồ Việt.

<strong>Lê Hoàn lên ngôi và chuẩn bị chiến đấu:</strong> Lê Hoàn (tên thật là Lê Hoan) là một trong mười đạo tướng quân của Đinh Tiên Hoàng, trấn giữ vùng Hoa Lư. Thấy tình thế nguy cấp, hoàng hậu Dương Vân Nga quyết định gả mình cho Lê Hoàn, trao ngôi cho ông để ổn định triều đình và đối phó với ngoại xâm. Năm 980, Lê Hoàn lên ngôi, lấy hiệu là <em>Lê Đại Hành</em>, lập ra nhà Tiền Lê. Ông ngay lập tức củng cố quân đội, chuẩn bị đối phó với cuộc xâm lược sắp tới từ nhà Tống.

<strong>Cuộc xâm lược của nhà Tống (981):</strong> Năm 981, Tống Thái Tông - hoàng đế nhà Tống - sai Hầu Nhân Bảo làm tướng, mang 30 vạn quân (một số tài liệu nói 10 vạn) chia làm hai đường tiến vào Đại Cồ Việt:
- <em>Đường bộ:</em> Quân chủ lực do Hầu Nhân Bảo chỉ huy, đi từ phía Bắc qua các ải đường bộ.
- <em>Đường thủy:</em> Hạm đội tiến vào sông Bạch Đằng và các con sông ở miền Bắc.
Quân Tống trang bị tinh nhuệ, đông đảo, tưởng chừng có thể dễ dàng chinh phục Đại Cồ Việt non trẻ.

<strong>Chiến lược "tránh thực kích hư" của Lê Hoàn:</strong> Lê Đại Hành là một danh tướng xuất sắc, hiểu rõ địa hình và khí hậu Việt Nam. Ông áp dụng chiến lược:
- <em>Kiên bích thanh dã:</em> Sơ tán dân, di chuyển lương thực vào vùng an toàn, để quân Tống thiếu thốn.
- <em>Rút lui chiến thuật:</em> Không đánh chính diện ngay, để quân địch tiến sâu vào đất nước, xa căn cứ, mệt mỏi.
- <em>Đánh du kích:</em> Liên tục tập kích, quấy phá, làm địch bối rối, tiêu hao sinh lực.

<strong>Trận quyết chiến Chi Lăng - Như Nguyệt (981):</strong> Sau khi quân Tống tiến sâu vào Hoa Lư, mệt mỏi, thiếu lương thực, Lê Đại Hành quyết định phản công. Trận quyết chiến diễn ra ở vùng Chi Lăng (Lạng Sơn) và Như Nguyệt (Bắc Ninh). Lê Đại Hành chỉ huy quân ta đánh úp bất ngờ, tận dụng địa hình hiểm trở (núi rừng, đèo hẹp). Quân Tống hoảng loạn, chạy tán loạn. Hầu Nhân Bảo bị thương nặng, phải bỏ chạy. Đại quân Tống tan vỡ, thiệt hại nặng nề.

<strong>Thắng lợi hoàn toàn:</strong> Quân ta đuổi theo, tiêu diệt địch trên đường lui quân. Hầu Nhân Bảo chạy về biên giới Tống, thua thảm hại. Theo sử sách, quân Tống thiệt hại hàng vạn người, bỏ lại vô số vũ khí, áo giáp, lương thực. Chiến thắng vang dội, Đại Cồ Việt bảo vệ được độc lập.

<strong>Chính sách ngoại giao sau chiến thắng:</strong> Sau khi đánh bại quân Tống, Lê Đại Hành thực hiện chính sách ngoại giao khôn khéo: không tuyên bố đối đầu lâu dài, mà sai sứ sang nhà Tống xin hòa. Năm 990, Tống Thái Tông chấp nhận, công nhận Lê Đại Hành làm "Giao Chỉ Quận Vương". Quan hệ Đại Cồ Việt - Tống trở lại hòa bình, hai bên cùng có lợi.

<strong>Lê Đại Hành xây dựng đất nước:</strong> Sau chiến thắng, Lê Đại Hành tập trung xây dựng đất nước. Ông cai trị 25 năm (980-1005), đất nước yên ổn, phát triển. Lê Đại Hành là một vị vua tài giỏi, vừa có tài quân sự, vừa có tầm nhìn chính trị. Ông được dân chúng kính trọng.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Bảo vệ độc lập non trẻ:</em> Sau 30 năm giành độc lập (938-968), đất nước còn non trẻ, dễ bị xâm lược. Chiến thắng 981 khẳng định khả năng tự vệ, bảo vệ chủ quyền.
- <em>Thể hiện tài năng quân sự:</em> Lê Đại Hành sử dụng chiến thuật tránh thực kích hư, du kích, tận dụng địa hình rất xuất sắc.
- <em>Ổn định chính trị:</em> Nhà Tiền Lê được công nhận, đất nước yên ổn, phát triển.
- <em>Bài học lịch sử:</em> "Biết người biết ta, trăm trận trăm thắng" - Lê Đại Hành đã áp dụng nguyên tắc này rất tốt.

<strong>Di sản:</strong> Lê Đại Hành được tôn là một danh tướng, danh vương của dân tộc. Chiến thắng chống quân Tống là minh chứng cho ý chí và khả năng bảo vệ độc lập của dân tộc Việt Nam.`,
            significance: 'Bảo vệ thành quả độc lập non trẻ trước đế quốc Tống hùng mạnh. Khẳng định khả năng tự vệ và tài năng quân sự của dân tộc. Ổn định chính trị, mở đường cho sự phát triển lâu dài.',
            relatedFigures: ['Lê Đại Hành Lê Hoàn', 'Dương Vân Nga', 'Hầu Nhân Bảo', 'Tống Thái Tông'],
            location: 'Chi Lăng (Lạng Sơn), Như Nguyệt (Bắc Ninh), Hoa Lư'
        },
        {
            year: '1010',
            name: 'Dời đô Thăng Long',
            type: 'founding',
            icon: '🏛️',
            period: 'medieval',
            description: 'Lý Thái Tổ dời đô về Thăng Long (Hà Nội), mở đầu thời kỳ phát triển rực rỡ.',
            details: `<strong>Lý Công Uẩn và sự ra đời nhà Lý:</strong> Sau khi nhà Tiền Lê suy yếu (Lê Đại Hành mất, các con tranh giành ngôi vua), năm 1009, Lý Công Uẩn - một võ tướng tài ba, xuất thân từ chùa (theo học Phật giáo tại chùa Cổ Pháp, Bắc Ninh) - được triều thần và nhân dân ủng hộ lên ngôi, lập ra nhà Lý. Ông lấy hiệu là <em>Lý Thái Tổ</em>. Đây là khởi đầu của một triều đại hưng thịnh nhất trong lịch sử Việt Nam thời trung đại (1009-1225, tồn tại 216 năm).

<strong>Lý do dời đô từ Hoa Lư:</strong> Hoa Lư (Ninh Bình) là kinh đô của nhà Đinh và nhà Tiền Lê, có địa thế hiểm trở, dễ phòng thủ. Tuy nhiên, vùng đất này có những hạn chế:
- <em>Diện tích nhỏ hẹp:</em> Bị bao quanh bởi núi đá, không đủ không gian để phát triển thành một kinh đô lớn.
- <em>Khó giao thông:</em> Xa các vùng đồng bằng trù phú, giao thông đường thủy không thuận lợi.
- <em>Kinh tế hạn chế:</em> Không phải là trung tâm kinh tế, khó thu thuế và phát triển thương mại.
Trong khi đó, Đại La (tên cũ của Hà Nội) ở vị trí trung tâm đồng bằng Bắc Bộ, giao thông sông ngòi thuận lợi, đất đai màu mỡ, dân cư đông đúc, kinh tế phát triển.

<strong>Chiếu Thiên đô - bản tuyên ngôn lịch sử (1010):</strong> Mùa xuân năm 1010, Lý Thái Tổ quyết định dời đô từ Hoa Lư về Đại La. Trước khi dời đô, ông ban hành bản chiếu nổi tiếng <em>"Chiếu dời đô"</em> (Thiên đô chiếu), giải thích lý do dời đô. Bản chiếu này là văn bản chính trị quan trọng và cũng là tác phẩm văn học tuyệt vời, thể hiện tài năng và tầm nhìn của Lý Thái Tổ.

<strong>Nội dung chính của Chiếo Thiên đô:</strong> Lý Thái Tổ viết: <em>"짐 được trời ban cho, nối ngôi vàng đế vương... nhìn xét bốn phương, định đô ở giữa thiên hạ... Đất rồng cuộn, hổ ngồi, chiếm được địa thế tốt đẹp, núi cao sông đẹp, cảnh trí hùng vĩ. Chính là nơi đất trung tâm, có thể tụ tập bốn phương trong nước..."</em> (Tạm dịch). Ông nhấn mạnh Đại La có địa thế trung tâm, phong thủy tốt (rồng cuộn, hổ ngồi - chỉ núi non sông nước hùng vĩ), là nơi lý tưởng để xây dựng kinh đô lâu dài.

<strong>Đổi tên thành Thăng Long:</strong> Khi dời đô về, Lý Thái Tổ đổi tên Đại La thành <em>Thăng Long</em> (Rồng bay lên). Theo truyền thuyết, khi rời thuyền lên bờ, Lý Thái Tổ thấy một con rồng vàng bay lên trời, liền cho đây là điềm lành, đặt tên thành là Thăng Long. Tên gọi này mang ý nghĩa tốt đẹp, tượng trưng cho sự thịnh vượng, hưng thịnh của đất nước.

<strong>Xây dựng kinh thành Thăng Long:</strong> Sau khi dời đô, Lý Thái Tổ cho xây dựng cung điện, đền đài, thành quách theo quy mô lớn:
- <em>Hoàng thành:</em> Nơi vua và hoàng gia sinh sống, làm việc, với cung điện nguy nga, tráng lệ.
- <em>Kinh thành:</em> Bao quanh hoàng thành, là nơi sinh sống của quan lại, binh lính, thương nhân.
- <em>Chùa chiền:</em> Xây dựng nhiều ngôi chùa (như chùa Một Cột, chùa Trấn Quốc...) thể hiện sự phát triển của Phật giáo.
- <em>Hệ thống đường sá, chợ búa:</em> Phát triển giao thông, thương mại, biến Thăng Long thành trung tâm kinh tế, chính trị, văn hóa.

<strong>Thời kỳ phát triển rực rỡ của nhà Lý:</strong> Dưới triều Lý, Thăng Long trở thành một kinh đô phồn thịnh:
- <em>Chính trị ổn định:</em> Bộ máy nhà nước được tổ chức chặt chẽ, luật pháp hoàn thiện.
- <em>Kinh tế phát triển:</em> Nông nghiệp, thủ công nghiệp, thương mại phát triển mạnh. Dân cư đông đúc, chợ búa sầm uất.
- <em>Văn hóa hưng thịnh:</em> Phật giáo phát triển mạnh, nhiều ngôi chùa đẹp được xây dựng. Giáo dục phát triển, nhiều người tài xuất hiện. Văn học Hán, Nôm phát triển.
- <em>Đối ngoại tốt đẹp:</em> Nhà Lý duy trì quan hệ hòa bình với Tống, Chiêm Thành, Chân Lạp, thúc đẩy giao lưu văn hóa, thương mại.

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Đặt nền móng cho Hà Nội:</em> Từ năm 1010 đến nay, Thăng Long (nay là Hà Nội) đã trải qua hơn 1000 năm, là thủ đô lâu đời nhất Việt Nam. Quyết định dời đô của Lý Thái Tổ đã chọn được vị trí lý tưởng, đảm bảo sự phát triển lâu dài.
- <em>Khởi đầu thời kỳ hưng thịnh:</em> Dưới triều Lý, đất nước phát triển toàn diện về mọi mặt. Đây là thời kỳ vàng son của lịch sử Việt Nam.
- <em>Biểu tượng văn hóa:</em> Chiếu Thiên đô là một tác phẩm văn học - chính trị quý giá, thể hiện tầm nhìn chiến lược và tài năng của Lý Thái Tổ.

<strong>Di sản:</strong> Khu di tích Hoàng thành Thăng Long (nay tại Hà Nội) được UNESCO công nhận là Di sản văn hóa thế giới năm 2010, đúng dịp kỷ niệm 1000 năm Thăng Long - Hà Nội. Đây là minh chứng cho quyết định sáng suốt và tầm nhìn xa của Lý Thái Tổ.`,
            significance: 'Đặt nền móng cho kinh thành Hà Nội ngàn năm văn hiến. Khởi đầu thời kỳ hưng thịnh nhất của Việt Nam thời trung đại. Thăng Long trở thành trung tâm chính trị, kinh tế, văn hóa phát triển rực rỡ, kéo dài hơn 1000 năm cho đến ngày nay.',
            relatedFigures: ['Lý Thái Tổ Lý Công Uẩn'],
            location: 'Thăng Long (Hà Nội), Hoa Lư (Ninh Bình)'
        },
        {
            year: '1288',
            name: 'Trận Bạch Đằng (Trần Hưng Đạo)',
            type: 'battle',
            icon: '⚔️',
            period: 'medieval',
            description: 'Trần Hưng Đạo đại thắng quân Nguyên Mông lần thứ ba, bảo vệ độc lập dân tộc.',
            details: `<strong>Đế chế Mông Cổ - kẻ thù hùng mạnh nhất:</strong> Thế kỷ XIII, đế chế Mông Cổ dưới sự lãnh đạo của Thành Cát Tư Hãn và các kế thừa đã chinh phục gần toàn bộ Á - Âu, từ Trung Quốc đến Đông Âu. Quân Mông Cổ (sau này gọi là Nguyên Mông khi lập nhà Nguyên ở Trung Quốc) nổi tiếng với chiến thuật기마 quân (kỵ binh) nhanh như chớp, hung hãn và tàn bạo. Nhiều quốc gia hùng mạnh như Tống (Trung Quốc), Ba Tư, Nga... đều bị Mông Cổ chinh phục. Việt Nam (lúc đó là nhà Trần) là một trong số ít quốc gia nhỏ bé có thể đánh bại đế quốc này.

<strong>Ba lần xâm lược của Nguyên Mông:</strong> Nhà Nguyên xâm lược Đại Việt (nhà Trần) ba lần:
- <em>Lần 1 (1257-1258):</em> Do Ngột Lương Hợp Thai chỉ huy, bị quân dân Đại Việt đánh bại.
- <em>Lần 2 (1284-1285):</em> Hốt Tất Liệt (Thoát Hoan) và Ô Mã Nhi mang 50 vạn quân sang, bị đại tướng Trần Hưng Đạo đánh bại tại nhiều trận như Hàm Tử, Chương Dương.
- <em>Lần 3 (1287-1288):</em> Toa Đô (con Hốt Tất Liệt) mang đại quân trở lại, quyết tâm báo thù, nhưng gặp phải thất bại nặng nề nhất tại trận Bạch Đằng.

<strong>Chuẩn bị và tinh thần chiến đấu:</strong> Trước cuộc xâm lược lần thứ ba, Đại tướng Trần Hưng Đạo triệu tập các tướng lĩnh, phát biểu lời thề nổi tiếng trong <em>"Hịch tướng sĩ"</em>: <em>"Giặc đến nhà không giữ được nhà, đến nước không giữ được nước, thà chết còn hơn sống không làm tròn nghĩa vụ..."</em> Tinh thần quyết tử để bảo vệ Tổ quốc đã thấm nhuần trong mỗi người lính, tướng sĩ. Vua Trần Nhân Tông cũng sẵn sàng ra trận cùng quân dân, thể hiện tinh thần đồng cam cộng khổ.

<strong>Chiến lược "Vườn không nhà trống":</strong> Học từ kinh nghiệm hai lần kháng chiến trước, Trần Hưng Đạo tiếp tục áp dụng chiến lược:
- <em>Kiên bích thanh dã:</em> Sơ tán dân, di chuyển lương thực, để quân Nguyên thiếu thốn.
- <em>Đánh du kích:</em> Tập kích liên tục, quấy phá, làm quân địch mệt mỏi, tinh thần sa sút.
- <em>Chọn thời cơ phản công:</em> Khi quân địch kiệt sức, ta tổng phản công.

<strong>Trận quyết chiến Bạch Đằng (1288):</strong> Sau khi quân Nguyên bị đánh bại tại nhiều trận trên đất liền (như Chương Dương, Tây Kết), Toa Đô buộc phải rút quân về nước qua đường thủy sông Bạch Đằng (Quảng Ninh). Trần Hưng Đạo lập kế hoạch tái hiện chiến thắng lịch sử của Ngô Quyền năm 938.

<strong>Chiến thuật cọc ngầm:</strong> Trần Hưng Đạo cho đóng hàng nghìn cọc sắt, gỗ sắc nhọn xuống lòng sông Bạch Đằng. Cọc được tính toán kỹ: khi thủy triều lên cao, cọc chìm dưới nước; khi triều xuống, cọc lộ ra. Đây là chiến thuật kết hợp thiên thời (thủy triều), địa lợi (địa hình sông), nhân hòa (tinh thần quân dân).

<strong>Diễn biến trận chiến:</strong>
- <em>Dụ địch:</em> Ngày 9/4/1288 (Âm lịch), khi thủy triều lên cao, quân ta cho chiến thuyền nhỏ ra giả thua, dụ hạm đội Nguyên Mông đuổi theo.
- <em>Khi triều xuống:</em> Khi thủy triều xuống, cọc ngầm lộ ra, thuyền chiến Nguyên Mông bị cọc đâm thủng, mắc cạn.
- <em>Tổng tấn công:</em> Trần Hưng Đạo ra lệnh tổng tấn công. Quân ta từ hai bên bờ sông bắn tên, ném đá, đốt thuyền địch. Quân Nguyên hoảng loạn, rơi xuống nước chết đuối, bị bắt sống.
- <em>Toa Đô bỏ chạy:</em> Toa Đô vứt bỏ ấn tín, vũ khí, chạy thoát thân với vài thuyền nhỏ. Đại tướng Ô Mã Nhi và 400 chiến thuyền bị tiêu diệt hoàn toàn.

<strong>Thắng lợi vĩ đại:</strong> Chiến thắng Bạch Đằng 1288 là thắng lợi hoàn toàn, đánh dấu sự kết thúc của cuộc xâm lược thứ ba của Nguyên Mông. Sau trận này, nhà Nguyên không dám xâm lược Đại Việt nữa. Đại Việt và Nguyên thiết lập quan hệ ngoại giao bình đẳng.

<strong>Ý nghĩa lịch sử và quốc tế:</strong>
- <em>Chiến thắng vang dội:</em> Đánh bại đế quốc hùng mạnh nhất thời đại, khẳng định tinh thần bất khuất và tài năng quân sự của dân tộc Việt Nam.
- <em>Góp phần ngăn chặn sự bành trướng:</em> Việt Nam là một trong số ít quốc gia có thể đánh bại Mông Cổ, góp phần ngăn chặn sự bành trướng của đế chế này ở Đông Nam Á.
- <em>Khẳng định chiến tranh nhân dân:</em> Thắng lợi nhờ sức mạnh của toàn dân, tinh thần đoàn kết, ý chí quyết chiến quyết thắng.
- <em>Nghệ thuật quân sự xuất sắc:</em> Chiến thuật cọc ngầm kết hợp với triều cường là một sáng tạo quân sự tuyệt vời, được ghi vào lịch sử quân sự thế giới.

<strong>Di sản và tôn vinh:</strong> Trần Hưng Đạo (Trần Quốc Tuấn) được tôn là một trong những danh tướng vĩ đại nhất lịch sử Việt Nam. Ông được thờ phụng khắp cả nước như một vị thánh, bảo hộ đất nước. Chiến thắng Bạch Đằng 1288 là niềm tự hào dân tộc, là bài học về nghệ thuật quân sự và tinh thần yêu nước bất diệt.`,
            significance: 'Đánh bại đế quốc Mông Cổ hùng mạnh nhất thế giới thời bấy giờ. Khẳng định tài năng quân sự xuất sắc và tinh thần bất khuất của dân tộc. Góp phần ngăn chặn sự bành trương của Mông Cổ, bảo vệ Đông Nam Á. Là minh chứng sống động về sức mạnh chiến tranh nhân dân.',
            relatedFigures: ['Trần Hưng Đạo (Trần Quốc Tuấn)', 'Trần Nhân Tông', 'Toa Đô', 'Ô Mã Nhi'],
            location: 'Sông Bạch Đằng (Quảng Ninh), Chương Dương, Tây Kết'
        },
        {
            year: '1407',
            name: 'Nhà Minh xâm lược, bắt đầu Bắc thuộc lần 4',
            type: 'battle',
            icon: '⛓️',
            period: 'medieval',
            description: 'Nhà Minh tiêu diệt nhà Hồ, đô hộ Việt Nam lần thứ tư trong lịch sử.',
            details: `<strong>Nhà Hồ và cải cách gay gắt:</strong> Sau khi nhà Trần suy yếu, năm 1400, Hồ Quý Ly (Lê Quý Ly) cướp ngôi nhà Trần, lập nhà Hồ. Ông tiến hành nhiều cải cách táo bạo: cải cách ruộng đất (giới hạn điền địa), thay chữ Hán bằng chữ Nôm, cải cách thuế khóa, xây dựng thành Tây Đô (Thanh Hóa). Tuy nhiên, các cải cách diễn ra quá nhanh và gay gắt, gây bất bình trong tầng lớp quý tộc và nhân dân. Hồ Quý Ly còn giết nhiều người thuộc hoàng tộc Trần, gây oán giận.

<strong>Nhà Minh lợi dụng cớ "phục Trần":</strong> Năm 1406, một số quý tộc nhà Trần chạy sang Trung Quốc xin nhà Minh (vừa mới lập, 1368-1644) giúp đỡ "phục hưng nhà Trần". Minh Thành Tổ Chu Đệ - hoàng đế nhà Minh, một vị vua hùng tài đại lược - quyết định lợi dụng cớ này để xâm lược Đại Việt. Ông sai Trương Phụ và Mộc Thạnh mang 80 vạn quân (số khác: 21,5 vạn) tiến vào Đại Việt.

<strong>Cuộc xâm lược nhanh chóng (1407):</strong> Quân Minh tiến đánh với lực lượng hùng hậu, vũ khí tinh nhuệ. Nhà Hồ tuy chống trả quyết liệt nhưng lực lượng và nội bộ không vững. Năm 1407, quân Minh chiếm được Thăng Long và Tây Đô, bắt sống Hồ Quý Ly và con là Hồ Hán Thương, đem về Trung Quốc. Nhà Hồ diệt vong chỉ sau 7 năm tồn tại (1400-1407). Đại Việt mất độc lập, bắt đầu thời kỳ Bắc thuộc lần thứ tư.

<strong>Chính sách đô hộ khắc nghiệt của nhà Minh:</strong> Nhà Minh đặt <em>"Giao Chỉ Thừa Tuyên Bố Chính Sứ Ti"</em> (cơ quan cai trị) tại Đại Việt, thực hiện chính sách đồng hóa tàn bạo:
- <em>Cướp tài nguyên:</em> Lấy đi vàng, bạc, châu báu, sách vở, công cụ sản xuất về Trung Quốc.
- <em>Bắt người tài:</em> Bắt thợ giỏi, nghệ nhân về Minh, làm yếu đi nền kinh tế và văn hóa Việt Nam.
- <em>Đồng hóa văn hóa:</strong> Cấm sử dụng chữ Nôm, tiếng Việt, phong tục Việt. Bắt người Việt phải cắt tóc, mặc y phục theo kiểu Minh, theo phong tục Hán.
- <em>Đánh thuế nặng:</em> Thu thuế khắc nghiệt, bắt lao dịch, nhân dân khổ sở.

<strong>Kháng chiến liên tục:</strong> Dưới ách đô hộ của nhà Minh, tinh thần kháng chiến của nhân dân Việt Nam không bao giờ tắt. Nhiều cuộc khởi nghĩa nổ ra: Trần Ngỗi (1408), Trần Quý Khoáng (1409), Phạm Bật Đạt (1413)... Tuy nhiên, các cuộc khởi nghĩa này đều bị đàn áp do lực lượng còn nhỏ yếu và chưa có sự tổ chức chặt chẽ.

<strong>Sự ra đời của Lê Lợi và khởi nghĩa Lam Sơn:</strong> Trong bối cảnh đó, Lê Lợi - một hào trưởng ở Lam Sơn (Thanh Hóa) - nổi lên. Ông tập hợp dân chúng, xây dựng lực lượng, chuẩn bị kháng chiến lâu dài. Năm 1418, Lê Lợi nổi cờ khởi nghĩa Lam Sơn, kéo dài 10 năm (1418-1428), cuối cùng đuổi quân Minh, giành lại độc lập.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Thời kỳ Bắc thuộc lần thứ 4:</em> Sau gần 500 năm độc lập (từ 938), Việt Nam lại rơi vào tay Bắc thuộc. Tuy chỉ kéo dài 20 năm (1407-1427), nhưng đây là thời kỳ đau thương với chính sách đồng hóa tàn khốc.
- <em>Thử thách và tôi luyện:</em> Thời kỳ này thử thách ý chí độc lập của dân tộc, nhưng cũng tôi luyện tinh thần kháng chiến, chuẩn bị cho cuộc khởi nghĩa Lam Sơn vĩ đại.
- <em>Bài học:</em> Sự sụp đổ của nhà Hồ và cuộc xâm lược của Minh là bài học về việc cải cách phải phù hợp với tình hình thực tế, phải có sự ủng hộ của nhân dân.

<strong>Khởi nghĩa Lam Sơn và độc lập (1428):</strong> Sau 10 năm chiến đấu kiên cường, Lê Lợi và quân dân Đại Việt đánh bại quân Minh năm 1427-1428, giành lại độc lập. Lê Lợi lên ngôi hoàng đế, lập nhà Lê Sơ (Lê Dynasty), mở ra thời kỳ phát triển rực rỡ.`,
            significance: 'Thời kỳ Bắc thuộc lần thứ 4 và cũng là lần cuối cùng trong lịch sử. Mặc dù đau thương với chính sách đồng hóa khắc nghiệt, nhưng đã kích thích phong trào kháng chiến mạnh mẽ, dẫn đến khởi nghĩa Lam Sơn vĩ đại và giành lại độc lập lâu dài.',
            relatedFigures: ['Hồ Quý Ly', 'Hồ Hán Thương', 'Trương Phụ', 'Mộc Thạnh', 'Minh Thành Tổ Chu Đệ', 'Lê Lợi'],
            location: 'Toàn quốc, Thăng Long, Tây Đô (Thanh Hóa)'
        },
        {
            year: '1428',
            name: 'Lê Lợi dựng nghiệp, lập nhà Lê Sơ',
            type: 'founding',
            icon: '👑',
            period: 'medieval',
            description: 'Lê Lợi khởi nghĩa Lam Sơn thành công, đuổi quân Minh, lập nhà Lê.',
            details: `<strong>Xuất thân và khởi đầu:</strong> Lê Lợi sinh năm 1385 tại Lam Sơn, huyện Lam Sơn (nay là Thọ Xuân, Thanh Hóa), xuất thân từ gia đình hào trưởng giàu có. Ông có học thức, tài năng và tính cách anh hùng từ nhỏ. Chứng kiến cảnh đồng bào chịu đựng sự áp bức của nhà Minh (1407-1427), Lê Lợi quyết tâm nổi dậy giành độc lập.

<strong>Khởi nghĩa Lam Sơn (1418):</strong> Năm 1418, tại Lam Sơn, Lê Lợi cùng Nguyễn Trãi (một mưu sĩ tài ba), Lê Lai, Lê Sát, Trần Nguyên Hãn và hàng trăm người dân nông dân nổi cờ khởi nghĩa. Lê Lợi tự xưng là <em>"Bình Định Vương"</em>. Khẩu hiệu của khởi nghĩa: "Trừ bạo Minh, phục Đại Việt" (Đánh đuổi bạo quyền Minh, phục hồi nước Đại Việt). Lúc đầu, lực lượng chỉ vài trăm người, vũ khí đơn sơ, nhưng tinh thần quyết tâm cao độ.

<strong>10 năm kháng chiến gian khổ (1418-1428):</strong> Khởi nghĩa Lam Sơn trải qua 10 năm đầy gian khổ, thử thách:
- <em>Giai đoạn 1 (1418-1424):</em> Giai đoạn khó khăn nhất. Nghĩa quân ít ỏi, bị quân Minh truy đuổi gay gắt. Nhiều trận thua, nhiều người hy sinh. Lê Lai (nghĩa đệ của Lê Lợi) đã hy sinh anh dũng để cứu Lê Lợi thoát hiểm. Nghĩa quân rút vào rừng núi Lam Sơn, kiên trì kháng chiến du kích.
- <em>Giai đoạn 2 (1424-1426):</em> Nghĩa quân dần phục hồi, lực lượng tăng lên. Lê Lợi áp dụng chiến thuật "vườn không nhà trống", đánh du kích, tránh thực kích hư. Nghĩa quân giành được nhiều thắng lợi nhỏ, tinh thần dân chúng được khích lệ.
- <em>Giai đoạn 3 (1426-1428):</em> Nghĩa quân mạnh lên, chuyển sang tổng phản công. Nhiều trận thắng lớn như Tốt Động - Chúc Động (1426), Chi Lăng - Xương Giang (1427). Quân Minh sa sút, quân số giảm, tinh thần yếu kém.

<strong>Chiến thắng Chi Lăng - Xương Giang (1427):</strong> Tháng 10/1427, trận quyết chiến diễn ra tại Chi Lăng và Xương Giang (Lạng Sơn - Bắc Giang). Lê Lợi chỉ huy quân ta mai phục, đánh úp quân Minh do Vương Thông chỉ huy. Quân Minh thua to, Vương Thông bỏ chạy. Đây là chiến thắng quyết định, làm thay đổi cục diện chiến tranh.

<strong>Thắng lợi cuối cùng và giành độc lập (1427-1428):</strong> Sau trận Chi Lăng - Xương Giang, quân Minh tan rã. Vương Thông cùng quân còn lại rút về Thăng Long, bị quân Lê bao vây. Tình thế cùng cực, Vương Thông xin đầu hàng và xin rút quân về nước. Lê Lợi đồng ý, ký với Vương Thông <em>"Thệ ước Đông Quan"</em> (1427): quân Minh được an toàn rút về, Minh phải công nhận độc lập của Đại Việt. Đầu năm 1428, quân Minh rút hết khỏi Đại Việt. Đất nước giành lại độc lập sau 20 năm Bắc thuộc.

<strong>Lập nhà Lê và cai trị (1428):</strong> Năm 1428, Lê Lợi lên ngôi hoàng đế, lấy hiệu là <em>Lê Thái Tổ</em>, lập ra nhà Lê (còn gọi là nhà Lê Sơ hoặc Lê Trung흥, 1428-1527 và phục hưng 1533-1789). Ông đặt niên hiệu là "Thuận Thiên" (Thuận theo ý trời). Ông đóng đô tại Đông Kinh (Thăng Long), bắt đầu xây dựng lại đất nước sau chiến tranh.

<strong>Nguyễn Trãi và "Bình Ngô đại cáo":</strong> Nguyễn Trãi - mưu sĩ tài ba, "quân sư" của Lê Lợi - viết bản tuyên ngôn nổi tiếng <em>"Bình Ngô đại cáo"</em> (Bình định giặc Ngô - tức Minh - chiếu cáo thiên hạ). Bản cáo gồm 834 chữ Hán, là tác phẩm văn học xuất sắc, thể hiện khí phách, tinh thần độc lập tự chủ của dân tộc. Câu nổi tiếng: <em>"Vua tôi có phận, sông núi có vẻ" - đất nước ta vốn có vua tôi riêng, non sông riêng biệt, không chịu lệ thuộc.</em>

<strong>Chính sách cai trị và phát triển:</strong> Lê Thái Tổ cai trị 5 năm (1428-1433). Ông thực hiện nhiều chính sách tốt:
- <em>Giảm thuế, nhẹ tô:</em> Giảm thuế khóa cho nhân dân sau chiến tranh.
- <em>Khuyến khích sản xuất:</em> Khôi phục nông nghiệp, thủ công nghiệp.
- <em>Cải cách bộ máy nhà nước:</em> Tổ chức lại bộ máy quan lại, xây dựng luật pháp.
- <em>Chính sách nhân đạo:</em> Lê Thái Tổ nổi tiếng khoan dung, không trả thù. Ông ân xá cho những người đã theo Minh, dùng nhân tài.

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Chấm dứt Bắc thuộc lần cuối:</em> Lê Lợi đã kết thúc thời kỳ Bắc thuộc lần thứ tư và cũng là lần cuối cùng. Từ đó đến nay, Việt Nam không bao giờ bị Trung Quốc đô hộ nữa.
- <em>Chiến thắng chiến tranh nhân dân:</em> Khởi nghĩa Lam Sơn là mô hình điển hình của chiến tranh nhân dân: từ yếu đến mạnh, kết hợp du kích với chính quy, "dân là gốc".
- <em>Tinh thần dân tộc:</em> Lê Lợi và Nguyễn Trãi là biểu tượng của trí tuệ, dũng cảm, lòng yêu nước. "Bình Ngô đại cáo" là tuyên ngôn độc lập bất hủ.
- <em>Mở đầu thời kỳ hưng thịnh:</em> Nhà Lê Sơ (đặc biệt dưới thời Lê Thánh Tông, 1460-1497) là thời kỳ hưng thịnh nhất lịch sử Việt Nam phong kiến.

<strong>Di sản:</strong> Lê Thái Tổ Lê Lợi và Nguyễn Trãi được tôn là những anh hùng vĩ đại nhất lịch sử dân tộc. Lam Sơn (Thanh Hóa) là nơi khởi nghĩa lịch sử, được tôn vinh. Câu chuyện về Lê Lợi và khởi nghĩa Lam Sơn truyền cảm hứng cho các thế hệ sau về ý chí giành độc lập, không khuất phục trước ngoại xâm.`,
            significance: 'Chấm dứt Bắc thuộc lần thứ tư và cũng là lần cuối cùng trong lịch sử. Minh chứng cho chiến tranh nhân dân: từ yếu đến mạnh, kiên trì đấu tranh. Mở đầu thời kỳ Lê Sơ hưng thịnh. Khẳng định tinh thần độc lập tự chủ của dân tộc Việt Nam.',
            relatedFigures: ['Lê Thái Tổ Lê Lợi', 'Nguyễn Trãi', 'Lê Lai', 'Lê Sát', 'Trần Nguyên Hãn', 'Vương Thông'],
            location: 'Lam Sơn (Thanh Hóa), Chi Lăng - Xương Giang (Lạng Sơn - Bắc Giang), Thăng Long'
        },
        {
            year: '1527',
            name: 'Mạc Đăng Dung cướp ngôi, lập nhà Mạc',
            type: 'founding',
            icon: '⚔️',
            period: 'medieval',
            description: 'Mạc Đăng Dung cướp ngôi nhà Lê, lập nhà Mạc, bắt đầu thời kỳ Nam - Bắc triều.',
            details: `<strong>Sự suy yếu của nhà Lê sau Lê Thánh Tông:</strong> Sau khi Lê Thánh Tông (1460-1497) - vị vua anh minh nhất nhà Lê - mất, nhà Lê bắt đầu suy yếu. Các vua kế tiếp yếu kém, quyền lực rơi vào tay các gia đình đại thần. Triều đình rối loạn, tranh giành quyền lực gay gắt. Nhân dân phải chịu thuế khóa nặng nề, đời sống khổ cực.

<strong>Mạc Đăng Dung nắm quyền:</strong> Mạc Đăng Dung (1483-1541) xuất thân từ một gia đình thường dân ở Hải Dương. Ông thông minh, có tài cán, dần dần lên nắm quyền trong triều đình nhà Lê. Năm 1516, ông trở thành Thái úy (chức quan cao nhất), nắm toàn bộ quân quyền và chính quyền. Vua Lê chỉ còn là bù nhìn, mọi quyền hành đều do Mạc Đăng Dung quyết định.

<strong>Cướp ngôi và lập nhà Mạc (1527):</strong> Năm 1527, Mạc Đăng Dung ép vua Lê Cung Hoàng양 vị cho mình, tự lên ngôi hoàng đế, lập ra nhà Mạc, đặt niên hiệu là <em>"Minh Đức"</em>. Ông vẫn giữ quốc hiệu là Đại Việt, đóng đô tại Thăng Long. Điều này gây phẫn nộ trong nhiều tầng lớp, đặc biệt là những người trung thành với nhà Lê.

<strong>Cuộc khởi nghĩa phục Lê:</strong> Sau khi Mạc Đăng Dung cướp ngôi, nhiều người không phục. Năm 1533, Nguyễn Kim - một tướng lĩnh trung thành với nhà Lê - ở Thanh Hóa nổi cờ "phục Lê diệt Mạc" (phục hồi nhà Lê, tiêu diệt nhà Mạc). Ông tìm được Lê Trang Tông (một hoàng tử nhà Lê còn sống sót) lập lại nhà Lê ở Thanh Hóa (gọi là nhà Hậu Lê hoặc Lê Trung hưng).

<strong>Thời kỳ Nam - Bắc triều (1533-1592):</strong> Từ năm 1533, Việt Nam có hai triều đại cùng tồn tại:
- <em>Nhà Mạc:</em> Cai trị vùng Bắc (từ Thanh Hóa trở ra), đóng đô tại Thăng Long.
- <em>Nhà Lê (Hậu Lê):</em> Cai trị vùng Nam (từ Thanh Hóa trở vào), thực quyền do họ Trịnh (con rể Nguyễn Kim) và họ Nguyễn (dòng dõi Nguyễn Kim) nắm giữ.

Hai bên liên tục chiến tranh, đất nước chia cắt, nhân dân đau khổ.

<strong>Họ Trịnh tiến đánh nhà Mạc:</strong> Sau khi Nguyễn Kim bị ám sát (1545), con rể ông là Trịnh Kiểm nắm quyền. Họ Trịnh tiếp tục cuộc chiến "phục Lê". Năm 1592, Trịnh Tùng đánh bại nhà Mạc, chiếm lại Thăng Long. Nhà Mạc phải rút về Cao Bằng, tồn tại thêm vài chục năm nữa trước khi bị tiêu diệt hoàn toàn (1677).

<strong>Thời kỳ Trịnh - Nguyễn phân tranh (1600-1777):</strong> Sau khi đánh bại nhà Mạc, nhà Lê được "phục hưng", nhưng vua Lê chỉ là bù nhìn. Quyền lực thực sự do:
- <em>Họ Trịnh:</em> Cai trị Đàng Ngoài (Bắc Bộ), tước hiệu "Trịnh Vương" (Chúa Trịnh).
- <em>Họ Nguyễn:</em> Cai trị Đàng Trong (Trung và Nam Bộ), tước hiệu "Nguyễn Vương" (Chúa Nguyễn).

Hai họ chia cắt đất nước ở dòng sông Gianh (Quảng Bình), dựng Tường Đồng năm 1627 để phân định ranh giới. Thời kỳ này kéo dài gần 200 năm, cho đến khi Tây Sơn nổi dậy (1771-1802).

<strong>Đánh giá về Mạc Đăng Dung và nhà Mạc:</strong>
- <em>Mặt tiêu cực:</em> Mạc Đăng Dung cướp ngôi nhà Lê, phản bội lòng tin, gây nội chiến kéo dài hơn 60 năm. Đất nước chia cắt, nhân dân đau khổ.
- <em>Mặt tích cực:</em> Mạc Đăng Dung là người có tài cán, biết dùng người. Dưới thời nhà Mạc, một số chính sách kinh tế, giáo dục được cải thiện. Tuy nhiên, những mặt tích cực này không đủ để bù đắp cho tội lỗi cướp ngôi và gây chiến tranh.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Bắt đầu thời kỳ phân tranh:</em> Sự cướp ngôi của Mạc Đăng Dung mở đầu cho hơn 200 năm chia cắt đất nước (Lê - Mạc, rồi Trịnh - Nguyễn).
- <em>Suy yếu trung ương:</em> Quyền lực trung ương suy yếu, các thế lực địa phương nổi lên, đất nước mất đoàn kết.
- <em>Nhân dân đau khổ:</em> Chiến tranh liên miên làm kinh tế suy thoái, nhân dân nghèo khổ.
- <em>Bài học:</em> Sự tranh giành quyền lực cá nhân dẫn đến đau thương cho cả dân tộc. Cần có sự đoàn kết, đặt lợi ích quốc gia lên trên lợi ích cá nhân.

<strong>Kết thúc thời kỳ phân tranh:</strong> Thời kỳ phân tranh chỉ kết thúc khi Nguyễn Ánh (sau này là vua Gia Long) thống nhất đất nước năm 1802, lập ra nhà Nguyễn. Tuy nhiên, cái giá phải trả là sự can thiệp của thực dân Pháp, mở đường cho cuộc xâm lược sau này.`,
            significance: 'Bắt đầu thời kỳ phân tranh kéo dài hơn 200 năm (Lê-Mạc, Trịnh-Nguyễn), làm suy yếu đất nước. Quyền lực trung ương tan rã, các thế lực địa phương nổi lên. Nhân dân chịu đựng chiến tranh, đói khổ. Bài học về sự chia rẽ nội bộ và hậu quả của tranh giành quyền lực cá nhân.',
            relatedFigures: ['Mạc Đăng Dung', 'Lê Cung Hoàng', 'Nguyễn Kim', 'Trịnh Kiểm', 'Trịnh Tùng'],
            location: 'Thăng Long, Thanh Hóa'
        },
        {
            year: '1627',
            name: 'Dựng Tường Đồng (Bức tường Đồng Hới)',
            type: 'battle',
            icon: '🧱',
            period: 'medieval',
            description: 'Chúa Trịnh và Chúa Nguyễn dựng tường, chính thức chia cắt đất nước.',
            details: `<strong>Bối cảnh phân tranh Trịnh - Nguyễn:</strong> Sau khi họ Trịnh đánh bại nhà Mạc (1592), nhà Lê được "phục hưng" nhưng chỉ là bù nhìn. Quyền lực thực sự do họ Trịnh (ở Đàng Ngoài - Bắc Bộ) và họ Nguyễn (ở Đàng Trong - Trung và Nam Bộ) nắm giữ. Ban đầu, họ Nguyễn là thần phục của họ Trịnh, nhưng dần dần tự chủ hơn, không chịu vâng lời hoàn toàn.

<strong>Mâu thuẫn leo thang:</strong> Đầu thế kỷ XVII, mâu thuẫn giữa Trịnh và Nguyễn ngày càng gay gắt:
- <em>Nguyễn Hoàng:</em> Tổ họ Nguyễn, năm 1558 xin vào trấn thủ Thuận Hóa (Huế), dần xây dựng thế lực riêng ở miền Nam.
- <em>Nguyễn Phúc Nguyên:</em> Con trai Nguyễn Hoàng, kế vị năm 1613, công khai không chịu vâng lời họ Trịnh, không nộp thuế về Thăng Long.
- <em>Trịnh Tráng:</em> Chúa Trịnh thời bấy giờ, quyết tâm đánh Nguyễn để thống nhất quyền lực.

<strong>Cuộc chiến Trịnh - Nguyễn lần thứ nhất (1627-1672):</strong> Năm 1627, Trịnh Tráng mang quân vào đánh Đàng Trong. Cuộc chiến kéo dài 45 năm với 7 lần Trịnh tiến công. Tuy quân Trịnh đông hơn, vũ khí tốt hơn (có cả súng thần cơ và voi chiến), nhưng quân Nguyễn kiên cường phòng thủ, tận dụng địa hình hiểm trở. Các trận đánh ác liệt diễn ra ở vùng Quảng Bình - Quảng Trị.

<strong>Xây dựng Tường Đồng (Tường Đồng Hới):</strong> Để phòng thủ, Chúa Nguyễn cho xây hai bức tường kiên cố:
- <em>Tường thứ nhất (1631):</em> Dựng tại Đồng Hới (Quảng Bình), gần dòng sông Nhật Lệ. Tường cao 6 mét, dày 2-3 mét, dài khoảng 20 km, chạy từ biển vào núi. Tường được xây bằng đá, gạch, rất kiên cố. Phía trước tường là hào sâu, phía sau là trại quân.
- <em>Tường thứ hai (1633):</em> Dựng phía Nam dòng sông Gianh (Quảng Bình), tăng cường phòng thủ.

Hai bức tường này được gọi chung là <em>"Tường Đồng"</em> (Tường kiên cố như đồng), biểu tượng của sự chia cắt đất nước.

<strong>Ý nghĩa quân sự của Tường Đồng:</strong> Tường Đồng là công trình phòng thủ xuất sắc:
- <em>Lợi dụng địa hình:</em> Xây tại nơi có sông, núi, biển, tạo thành tuyến phòng thủ tự nhiên.
- <em>Kiên cố:</em> Quân Trịnh nhiều lần tấn công nhưng đều thất bại trước Tường Đồng.
- <em>Tâm lý:</em> Tường Đồng tạo niềm tin cho quân dân Đàng Trong, thể hiện quyết tâm bảo vệ quê hương.

<strong>Kết quả cuộc chiến Trịnh - Nguyễn lần 1:</strong> Sau 45 năm chiến tranh (1627-1672), cả hai bên kiệt sức, đồng ý đình chiến. Dòng sông Gianh trở thành ranh giới chính thức giữa Đàng Ngoài (Trịnh) và Đàng Trong (Nguyễn). Tường Đồng vẫn đứng vững, biểu tượng của sự chia cắt.

<strong>Cuộc sống hai miền sau chia cắt:</strong>
- <em>Đàng Ngoài (Trịnh):</em> Diện tích nhỏ hơn nhưng dân số đông đúc, kinh tế nông nghiệp phát triển. Chúa Trịnh cai trị nghiêm khắc, thuế khóa nặng. Chiến tranh thường xuyên làm nhân dân khổ sở.
- <em>Đàng Trong (Nguyễn):</em> Diện tích rộng lớn hơn, dân cư thưa thớt. Chúa Nguyễn khuyến khích người dân từ Bắc vào khai phá đất hoang. Chính sách cởi mở hơn, thu hút buôn bán với nước ngoài (Bồ Đào Nha, Hà Lan, Nhật Bản). Dần dần tiến đánh Chămpa và Campuchia, mở rộng lãnh thổ về phía Nam (Nam tiến).

<strong>Ý nghĩa lịch sử:</strong>
- <em>Biểu tượng chia cắt:</em> Tường Đồng là biểu tượng đau thương của sự chia cắt đất nước. Trong gần 150 năm (1627-1775), đất nước có hai chính quyền, nhân dân hai miền không thể tự do đi lại.
- <em>Suy yếu quốc gia:</em> Sự chia cắt làm suy yếu sức mạnh quốc gia, tạo cơ hội cho ngoại xâm (Tây Sơn, sau này là Pháp).
- <em>Bài học:</em> Sự chia rẽ nội bộ là nguy hiểm lớn nhất đối với dân tộc. Đoàn kết là sức mạnh.

<strong>Sự kết thúc:</strong> Thời kỳ chia cắt Trịnh - Nguyễn chỉ kết thúc khi phong trào Tây Sơn nổi dậy (1771), tiêu diệt cả Trịnh và Nguyễn. Sau đó, Nguyễn Ánh (con cháu Chúa Nguyễn) thống nhất đất nước năm 1802, lập nhà Nguyễn. Tường Đồng được phá bỏ, nhưng di tích vẫn còn, nhắc nhở thế hệ sau về hậu quả của chia rẽ.`,
            significance: 'Biểu tượng đau thương của sự chia cắt đất nước kéo dài gần 150 năm. Làm suy yếu sức mạnh quốc gia, nhân dân hai miền không thể tự do giao lưu. Bài học sâu sắc về nguy hiểm của chia rẽ nội bộ và tầm quan trọng của đoàn kết dân tộc.',
            relatedFigures: ['Trịnh Tráng', 'Nguyễn Phúc Nguyên', 'Nguyễn Hoàng'],
            location: 'Đồng Hới, Dòng sông Gianh, Dòng sông Nhật Lệ (Quảng Bình)'
        },
        {
            year: '1789',
            name: 'Chiến thắng Ngọc Hồi - Đống Đa',
            type: 'battle',
            icon: '🐉',
            period: 'modern',
            description: 'Quang Trung Nguyễn Huệ đánh tan 29 vạn quân Thanh trong 5 ngày Tết.',
            details: `<strong>Phong trào Tây Sơn và Nguyễn Huệ:</strong> Cuối thế kỷ XVIII, đất nước chia cắt, nhân dân đau khổ vì chiến tranh và thuế khóa nặng nề. Năm 1771, ba anh em họ Nguyễn ở Tây Sơn (Bình Định) - Nguyễn Nhạc, Nguyễn Lữ, Nguyễn Huệ - nổi dậy khởi nghĩa. Họ đánh đổ Chúa Nguyễn ở Đàng Trong (1777), sau đó tiến ra Bắc đánh Chúa Trịnh (1786). Nguyễn Huệ là anh hùng tài ba nhất, được phong làm Bắc Bình Vương.

<strong>Lê Chiêu Thống cầu viện nhà Thanh:</strong> Năm 1788, sau khi Tây Sơn đánh chiếm Thăng Long, vua Lê Chiêu Thống (vua bù nhìn của Trịnh) chạy sang Trung Quốc xin nhà Thanh (nhà Thanh lúc đó đang ở thời kỳ cực thịnh, Càn Long đế cai trị) giúp đỡ "phục hưng nhà Lê". Nhà Thanh quyết định lợi dụng để xâm lược Đại Việt.

<strong>Quân Thanh xâm lược (cuối 1788):</strong> Tháng 12/1788, Tôn Sĩ Nghị làm Tổng Tư lệnh, mang 29 vạn quân (một số tài liệu nói 20 vạn) chia nhiều đường kéo vào Đại Việt. Quân Thanh trang bị vũ khí hiện đại, hùng mạnh. Họ nhanh chóng chiếm Thăng Long (đầu tháng 1/1789), lập lại nhà Lê. Tôn Sĩ Nghị tưởng chiến thắng dễ dàng, cho quân nghỉ ngơi trong thành Thăng Long, chuẩn bị ăn Tết Kỷ Dậu.

<strong>Quang Trung quyết định phản công:</strong> Lúc này, Nguyễn Huệ đang ở Phú Xuân (Huế), vừa lên ngôi hoàng đế, lấy hiệu là <em>Quang Trung</em>. Nghe tin quân Thanh xâm lược, Quang Trung quyết định phản công ngay lập tức. Ông tuyên bố với quân sĩ: <em>"Quân Thanh đã chiếm Thăng Long, nếu ta chậm trễ sẽ khó lòng đuổi chúng đi. Ta quyết xuất quân ngay, đánh địch đang lơi là!"</em>

<strong>Tiến quân thần tốc:</strong> Quang Trung tập hợp 10 vạn quân tinh nhuệ (một số nguồn nói ít hơn), xuất phát từ Phú Xuân (Huế) ngày 22/12/1788 (Âm lịch). Quân ta đi đường núi hiểm trở, hành quân cực nhanh. Chỉ trong 6 ngày đêm (từ 22-28/12 Âm lịch), quân ta đi được gần 600 km, từ Phú Xuân đến Nghệ An, sau đó tiếp tục tiến về Thăng Long. Đây là kỳ tích hành quân trong lịch sử quân sự thế giới.

<strong>Đánh úp trong đêm 30 Tết:</strong> Đêm 30 Tết Kỷ Dậu (tức đêm giao thừa, 30/1/1789 Dương lịch), quân Quang Trung đột ngột xuất hiện tại Ngọc Hồi - Đống Đa (ngoại thành Thăng Long, nay là Hà Nội). Quân Thanh đang ăn Tết, say sưa, không ngờ bị tập kích. Quang Trung chia quân làm 3 đội, tấn công đồng loạt từ ba hướng.

<strong>Chiến thắng vang dội (5 ngày Tết, từ 30/12 đến 5/1):</strong>
- <em>Đêm 30 Tết:</em> Quân ta tấn công doanh trại Ngọc Hồi, tiêu diệt phần lớn quân Thanh ở đây. Quân địch hoảng loạn, chạy tán loạn.
- <em>Mùng 1 Tết:</em> Quân ta tiến đánh Đống Đa (trại chính của quân Thanh). Trận chiến ác liệt, quân Thanh kháng cự quyết liệt nhưng bị quân ta áp đảo. Quang Trung cầm cờ chỉ huy, tinh thần quân ta rất cao.
- <em>Mùng 2-3 Tết:</em> Quân Thanh tan vỡ, bỏ chạy về phía Bắc. Quân ta đuổi theo, tiêu diệt địch trên đường chạy.
- <em>Mùng 5 Tết:</em> Quang Trung giải phóng hoàn toàn Thăng Long. Quân Thanh bỏ lại vô số vũ khí, lương thực, bỏ chạy về nước. Tôn Sĩ Nghị và Lê Chiêu Thống cũng phải chạy theo.

<strong>Kết quả vĩ đại:</strong> Trong chỉ 5 ngày Tết, quân Quang Trung tiêu diệt và đánh tan 29 vạn quân Thanh. Địch chết và bị bắt hàng vạn, bỏ lại toàn bộ vũ khí, hậu cần. Đây là chiến thắng nhanh nhất, vang dội nhất trong lịch sử quân sự Việt Nam.

<strong>Chính sách ngoại giao khôn khéo:</strong> Sau chiến thắng, Quang Trung không tiến đánh sâu vào Trung Quốc mà sai sứ sang xin hòa với Thanh. Nhà Thanh (Càn Long đế) chấp nhận, phong Quang Trung làm "An Nam Quốc Vương". Quan hệ hai nước trở lại hòa bình.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Chiến thắng vĩ đại nhất:</em> Ngọc Hồi - Đống Đa là chiến thắng quân sự vĩ đại nhất lịch sử Việt Nam: đánh bại đế quốc Thanh hùng mạnh trong thời gian cực ngắn (5 ngày).
- <em>Nghệ thuật quân sự xuất sắc:</em> Hành quân thần tốc, đánh úp bất ngờ, chọn thời điểm tâm lý (đêm giao thừa) - tất cả thể hiện thiên tài quân sự của Quang Trung.
- <em>Tinh thần chiến đấu cao:</em> Quân ta tuy ít hơn nhưng tinh thần rất cao, quyết tâm đuổi giặc, giải phóng quê hương.
- <em>Bảo vệ độc lập:</em> Chiến thắng bảo vệ độc lập dân tộc, không để Việt Nam rơi vào tay Thanh.

<strong>Di sản:</strong> Quang Trung Nguyễn Huệ được tôn là một trong những anh hùng vĩ đại nhất lịch sử dân tộc. Chiến thắng Ngọc Hồi - Đống Đa là niềm tự hào dân tộc, được ghi vào lịch sử quân sự thế giới như một kỳ tích. Ngày nay, di tích Đống Đa (Hà Nội) vẫn được tôn vinh, là nơi tưởng niệm chiến công vĩ đại của Quang Trung và quân dân ta.`,
            significance: 'Chiến thắng quân sự vĩ đại nhất lịch sử Việt Nam. Đánh bại đế quốc Thanh hùng mạnh trong 5 ngày Tết với chiến thuật hành quân thần tốc và đánh úp bất ngờ. Thể hiện thiên tài quân sự của Quang Trung và tinh thần chiến đấu kiên cường của dân tộc. Được ghi vào lịch sử quân sự thế giới như một kỳ tích.',
            relatedFigures: ['Quang Trung Nguyễn Huệ', 'Tôn Sĩ Nghị', 'Lê Chiêu Thống', 'Càn Long đế'],
            location: 'Ngọc Hồi - Đống Đa (Hà Nội), Phú Xuân (Huế)'
        },
        {
            year: '1802',
            name: 'Nguyễn Ánh thống nhất đất nước, lập nhà Nguyễn',
            type: 'founding',
            icon: '👑',
            period: 'modern',
            description: 'Nguyễn Ánh đánh bại Tây Sơn, thống nhất đất nước, lên ngôi hoàng đế, lấy hiệu là Gia Long.',
            details: `<strong>Xuất thân và gian khổ ban đầu:</strong> Nguyễn Ánh (1762-1820) là con cháu Chúa Nguyễn ở Đàng Trong. Năm 1777, khi mới 15 tuổi, ông chứng kiến cả gia tộc bị Tây Sơn tiêu diệt. Ông trốn chạy vào rừng, sống lang thang, nhiều lần suýt bị giết. Nhờ sự giúp đỡ của các tướng lĩnh trung thành như Nguyễn Văn Thành, Đỗ Thanh Nhơn, ông sống sót và dần tập hợp lực lượng.

<strong>Gặp Bá Đa Lộc (Pigneau de Béhaine):</strong> Trong lúc trốn chạy, Nguyễn Ánh gặp Bá Đa Lộc (Pierre Pigneau de Béhaine, 1741-1799) - một giám mục người Pháp truyền giáo ở Việt Nam. Bá Đa Lộc trở thành cố vấn và người bạn thân thiết của Nguyễn Ánh. Năm 1787, Bá Đa Lộc sang Pháp xin viện trợ cho Nguyễn Ánh, ký <em>"Hiệp ước Versailles"</em> với vua Pháp Louis XVI, cam kết Việt Nam sẽ nhượng lại đảo Côn Đảo và Đà Nẵng để đổi lấy sự giúp đỡ quân sự. Tuy nhiên, do Cách mạng Pháp nổ ra (1789), chính phủ Pháp không thực hiện cam kết. Bá Đa Lộc tự tìm kiếm tư nhân Pháp hỗ trợ vũ khí, kỹ thuật và một số sĩ quan.

<strong>Tái chiếm đất đai và xây dựng lực lượng:</strong> Với sự giúp đỡ của Pháp (vũ khí, tàu chiến, kỹ thuật đóng thuyền và xây pháo đài), Nguyễn Ánh dần tái chiếm các vùng đất ở miền Nam. Năm 1788, ông chiếm lại Gia Định (Sài Gòn). Sau đó, ông xây dựng quân đội, đóng thuyền chiến, tổ chức bộ máy hành chính, chuẩn bị lực lượng để đánh Tây Sơn.

<strong>Tây Sơn suy yếu:</strong> Sau khi Quang Trung Nguyễn Huệ mất (1792), nhà Tây Sơn suy yếu nhanh chóng. Con ông là Nguyễn Quang Toản lên kế vị nhưng yếu kém, triều đình rối loạn, nội bộ mâu thuẫn. Quân Tây Sơn mất đi người lãnh đạo tài ba, sức mạnh giảm sút.

<strong>Chiến dịch Bắc tiến (1799-1802):</strong> Năm 1799, Nguyễn Ánh bắt đầu chiến dịch Bắc tiến. Quân Nguyễn Ánh tiến từ Nam ra Bắc, dần chiếm từng vùng đất. Các trận đánh chính:
- <em>1799:</em> Chiếm Quy Nhơn (cố đô Tây Sơn).
- <em>1801:</em> Chiếm Phú Xuân (Huế).
- <em>1802:</em> Tiến đánh Thăng Long (Hà Nội), tiêu diệt hoàn toàn nhà Tây Sơn.

<strong>Lên ngôi hoàng đế (1802):</strong> Ngày 1/6/1802 (Âm lịch), Nguyễn Ánh lên ngôi hoàng đế tại Phú Xuân (Huế), lấy hiệu là <em>Gia Long</em> (kết hợp Gia Định - Sài Gòn và Thăng Long - Hà Nội, tượng trưng cho sự thống nhất). Ông đặt quốc hiệu là <em>"Việt Nam"</em> (sau khi xin sự đồng ý của nhà Thanh), đóng đô tại Phú Xuân (Huế). Nhà Nguyễn chính thức được thành lập, là triều đại cuối cùng của Việt Nam phong kiến (1802-1945).

<strong>Xây dựng đất nước:</strong> Gia Long cai trị 18 năm (1802-1820). Ông thực hiện nhiều chính sách:
- <em>Thống nhất hành chính:</em> Chia đất nước thành 30 tỉnh, tổ chức bộ máy quan lại chặt chẽ theo mô hình Trung Hoa.
- <em>Xây dựng cơ sở hạ tầng:</em> Xây kinh thành Huế kiên cố, đường Quan lộ (từ Bắc vào Nam), hệ thống trạm đặt để liên lạc.
- <em>Phát triển kinh tế:</em> Khuyến khích nông nghiệp, khai hoang, giảm thuế cho nhân dân.
- <em>Quân đội:</em> Xây dựng quân đội hùng mạnh với sự tư vấn của người Pháp.

<strong>Vấn đề với Pháp:</strong> Mặc dù được Pháp giúp đỡ, Gia Long không thực hiện đầy đủ cam kết trong Hiệp ước Versailles (nhượng Côn Đảo và Đà Nẵng) vì biết đó là mối nguy hiểm lớn. Tuy nhiên, ông vẫn cho phép người Pháp truyền giáo tự do, mở cửa giao thương. Điều này vô tình tạo cơ hội cho Pháp thâm nhập vào Việt Nam, mở đường cho cuộc xâm lược sau này (1858).

<strong>Chính sách đối ngoại:</strong> Gia Long duy trì quan hệ tốt với nhà Thanh (Trung Quốc), được Thanh công nhận là "Việt Nam Quốc Vương". Ông cũng duy trì quan hệ với các nước láng giềng như Thái Lan, Campuchia.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Thống nhất đất nước:</em> Kết thúc hơn 200 năm chia cắt (từ thời Trịnh - Nguyễn đến Tây Sơn), đất nước được thống nhất hoàn toàn.
- <em>Đặt quốc hiệu Việt Nam:</em> Lần đầu tiên, đất nước có tên chính thức là "Việt Nam" (trước đó là Đại Việt, Đại Cồ Việt, Đại Ngu, An Nam...).
- <em>Lãnh thổ rộng lớn:</em> Đất nước có lãnh thổ từ Bắc đến Nam, bao gồm cả các vùng đất mới khai phá ở Nam Bộ.
- <em>Nguy cơ thực dân:</em> Tuy thống nhất nhưng việc nhờ Pháp giúp đỡ đã mở đường cho sự xâm lược của thực dân Pháp sau này. Đây là một cái giá đắt mà dân tộc phải trả.

<strong>Đánh giá:</strong> Gia Long là một nhà chính trị tài ba, kiên trì. Ông thống nhất đất nước sau nhiều năm gian khổ. Tuy nhiên, chính sách bảo thủ, phong kiến nghiêm ngặt và sự liên hệ với Pháp đã tạo ra những mâu thuẫn, mở đường cho sự suy yếu của triều đại Nguyễn và cuộc xâm lược của Pháp.`,
            significance: 'Thống nhất đất nước sau hơn 200 năm chia cắt. Đặt quốc hiệu chính thức là "Việt Nam". Mở đầu triều đại Nguyễn - triều đại cuối cùng của Việt Nam phong kiến. Tuy nhiên, việc nhờ Pháp giúp đỡ đã mở đường cho sự xâm lược của thực dân Pháp sau này.',
            relatedFigures: ['Gia Long Nguyễn Ánh', 'Pigneau de Béhaine (Bá Đa Lộc)', 'Nguyễn Văn Thành', 'Đỗ Thanh Nhơn'],
            location: 'Phú Xuân (Huế), Gia Định (Sài Gòn), Thăng Long (Hà Nội)'
        },
        {
            year: '1858',
            name: 'Pháp tấn công Đà Nẵng, bắt đầu xâm lược',
            type: 'battle',
            icon: '⚔️',
            period: 'modern',
            description: 'Thực dân Pháp tấn công Đà Nẵng, mở đầu cuộc xâm lược Việt Nam.',
            details: `<strong>Bối cảnh và lý do xâm lược:</strong> Giữa thế kỷ XIX, các nước tư bản phương Tây đang trong thời kỳ cách mạng công nghiệp, cần tìm kiếm thị trường tiêu thụ hàng hóa, nguồn nguyên liệu và địa bàn đầu tư. Pháp muốn xâm lược Việt Nam với nhiều mục đích: khai thác tài nguyên, thị trường, và mở đường vào Trung Quốc. Cớ trực tiếp là việc triều đình Nguyễn (vua Tự Đức, 1848-1883) đàn áp các giáo sĩ Công giáo và tín đồ Công giáo Việt Nam. Pháp lấy cớ "bảo vệ đạo Công giáo" để xâm lược.

<strong>Hạm đội Pháp tấn công Đà Nẵng (1/9/1858):</strong> Ngày 1/9/1858, hạm đội Pháp - Tây Ban Nha do Đô đốc Rigault de Genouilly chỉ huy (14 chiến hạm, hơn 2.500 lính) tấn công Đà Nẵng. Quân Pháp có vũ khí hiện đại (súng hỏa mai, đại bác), nhanh chóng chiếm được thành Đà Nẵng. Tuy nhiên, quân Pháp gặp khó khăn: khí hậu nóng ẩm, dịch bệnh hoành hành, quân sĩ chết nhiều. Quan trọng hơn, quân dân Việt Nam kiên cường kháng chiến, không chịu đầu hàng. Quân Pháp bao vây Đà Nẵng nhưng không tiến sâu được vào trong đất liền.

<strong>Pháp chuyển hướng chiếm Gia Định (1859):</strong> Thấy tình hình Đà Nẵng bế tắc, tháng 2/1859, Rigault de Genouilly chuyển hướng, đưa hạm đội vào Nam, tấn công Gia Định (Sài Gòn). Gia Định có vị trí chiến lược quan trọng, là trung tâm kinh tế miền Nam. Quân Pháp nhanh chóng chiếm được thành Gia Định. Triều đình Huế điều quân vào cứu viện nhưng yếu thế về vũ khí và chiến thuật.

<strong>Quân dân kháng chiến:</strong> Dù triều đình yếu kém, nhưng tinh thần kháng chiến của nhân dân rất mạnh mẽ. Nhiều nghĩa quân tự phát nổi dậy chống Pháp như: Nguyễn Trung Trực (đánh đắm tàu Pháp Espérance năm 1861), Trương Định (lãnh đạo nghĩa quân ở miền Tây Nam Bộ), Nguyễn Hữu Huân... Họ sử dụng chiến thuật du kích, đánh úp, gây nhiều thiệt hại cho quân Pháp.

<strong>Triều đình Huế yếu kém:</strong> Vua Tự Đức và triều đình không có quyết tâm kháng chiến đến cùng. Họ lo sợ mất ngôi, muốn "thương lượng" với Pháp. Quân triều đình thiếu vũ khí hiện đại, thiếu chiến lược, đánh thua nhiều trận.

<strong>Hiệp ước Nhâm Tuất (1862):</strong> Năm 1862, dưới áp lực quân sự, triều đình Huế buộc phải ký <em>"Hiệp ước Nhâm Tuất"</em> (Hòa ước Sài Gòn) với Pháp:
- <em>Nhượng 3 tỉnh miền Đông Nam Bộ:</em> Gia Định, Định Tường, Biên Hòa.
- <em>Bồi thường chiến phí:</em> 4 triệu quan tiền (một số tiền rất lớn).
- <em>Mở cửa 3 cảng:</em> Đà Nẵng, Quy Nhơn, Ba Lạc cho Pháp buôn bán tự do.
- <em>Tự do truyền giáo:</em> Cho phép Công giáo truyền giáo tự do.

Đây là hiệp ước bất bình đẳng, mở đầu cho sự mất nước từng phần.

<strong>Pháp chiếm dần toàn bộ Nam Kỳ (1862-1867):</strong> Năm 1867, Pháp tiếp tục chiếm thêm 3 tỉnh miền Tây Nam Bộ (Vĩnh Long, An Giang, Hà Tiên), hoàn tất việc chiếm toàn bộ Nam Kỳ (6 tỉnh miền Nam). Nam Kỳ trở thành "thuộc địa" của Pháp, bị cai trị trực tiếp.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Bắt đầu 80 năm đô hộ:</em> Cuộc tấn công Đà Nẵng 1858 mở đầu cho 80 năm đô hộ của Pháp ở Việt Nam (1858-1945).
- <em>Mất độc lập từng bước:</em> Việt Nam mất độc lập không phải trong một trận, mà qua nhiều hiệp ước bất bình đẳng, mất nước từng phần.
- <em>Tinh thần kháng chiến:</em> Mặc dù triều đình yếu kém, nhưng tinh thần kháng chiến của nhân dân không bao giờ tắt. Các phong trào kháng chiến liên tục nổ ra trong suốt 80 năm, cuối cùng giành lại độc lập năm 1945-1954.
- <em>Bài học:</em> Sự lạc hậu về khoa học kỹ thuật, sự bảo thủ của triều đình phong kiến là nguyên nhân dẫn đến mất nước. Dân tộc cần phải đoàn kết, tiến bộ, có ý thức bảo vệ Tổ quốc.`,
            significance: 'Bắt đầu 80 năm đô hộ của thực dân Pháp ở Việt Nam (1858-1945). Việt Nam mất độc lập từng bước qua các hiệp ước bất bình đẳng. Mặc dù triều đình yếu kém, nhưng tinh thần kháng chiến của nhân dân không bao giờ tắt, liên tục nổi dậy cho đến khi giành lại độc lập.',
            relatedFigures: ['Tự Đức', 'Rigault de Genouilly', 'Nguyễn Trung Trực', 'Trương Định', 'Nguyễn Hữu Huân'],
            location: 'Đà Nẵng, Gia Định (Sài Gòn), Nam Kỳ (Nam Bộ)'
        },
        {
            year: '1884',
            name: 'Ký Hòa ước Quý Mùi - Patenôtre',
            type: 'battle',
            icon: '📜',
            period: 'modern',
            description: 'Triều đình Huế ký hiệp ước Patenôtre, Việt Nam trở thành thuộc địa của Pháp.',
            details: `<strong>Bối cảnh sau khi Pháp chiếm Hà Nội (1882-1883):</strong> Sau khi chiếm được toàn bộ Nam Kỳ (6 tỉnh miền Nam, 1862-1867), thực dân Pháp tiếp tục đẩy mạnh xâm lược ra miền Bắc. Năm 1882, quân Pháp do Henri Rivière chỉ huy tiến đánh và chiếm Hà Nội. Năm 1883, Pháp tiếp tục chiếm Nam Định, Hải Phòng và nhiều tỉnh ở Bắc Kỳ. Triều đình Huế yếu kém, không có khả năng chống trả. Vua Tự Đức vừa mất (1883), triều đình rối loạn với các vua nối tiếp nhau trong thời gian ngắn (Dục Đức, Hiệp Hòa, Kiến Phước).

<strong>Pháp ép buộc ký hiệp ước:</strong> Sau khi kiểm soát được phần lớn lãnh thổ Việt Nam, Pháp muốn triều đình Huế chính thức công nhận quyền thống trị của họ. Tháng 8/1883, Pháp buộc triều đình Huế ký <em>"Hiệp ước Quý Mùi lần 1"</em> (còn gọi là Hòa ước Harmand). Tuy nhiên, hiệp ước này chưa rõ ràng và chưa hoàn chỉnh. Năm 1884, Pháp tiếp tục ép buộc ký một hiệp ước mới, chi tiết và khắc nghiệt hơn.

<strong>Ký Hòa ước Quý Mùi - Patenôtre (6/6/1884):</strong> Ngày 6/6/1884 (tháng 4 năm Giáp Thân, Quý Mùi theo can chi), tại Huế, triều đình nhà Nguyễn (lúc này vua Kiến Phước vừa mất, chưa có vua mới) buộc phải ký <em>"Hiệp ước Quý Mùi lần 2"</em> hay <em>"Hòa ước Patenôtre"</em> (do Patenôtre - Đại biện Pháp ở Huế - đại diện Pháp ký kết) với đại diện triều đình Huế. Đây là hiệp ước bất bình đẳng, đánh dấu Việt Nam hoàn toàn mất chủ quyền.

<strong>Nội dung chính của Hiệp ước:</strong> Hiệp ước Patenôtre bao gồm 19 điều, với những nội dung chính sau:

<em>1. Việt Nam công nhận chủ quyền của Pháp:</em>
- Bắc Kỳ (Bắc Bộ) và Trung Kỳ (Trung Bộ) trở thành "xứ bảo hộ" (protectorat) của Pháp.
- Nam Kỳ (Nam Bộ) đã là "thuộc địa" (colonie) của Pháp từ trước.
- Việt Nam không còn độc lập, chỉ còn là một quốc gia danh nghĩa dưới sự "bảo hộ" của Pháp.

<em>2. Quyền lực của triều đình Huế bị tước đoạt:</em>
- Vua Việt Nam chỉ còn quyền hành danh nghĩa. Tất cả quyền hành chính, quân sự, ngoại giao đều do người Pháp nắm giữ.
- Pháp đặt <em>"Khám sứ"</em> (Résident) tại các tỉnh để giám sát và cai trị. Khám sứ có quyền cao hơn cả quan lại triều đình.
- Pháp đặt <em>"Thống sứ"</em> (Résident Supérieur) tại Huế làm đầu não cai trị Trung Kỳ, và tại Hà Nội cai trị Bắc Kỳ.

<em>3. Ngoại giao và quốc phòng do Pháp nắm giữ:</em>
- Việt Nam không được tự quyết định quan hệ ngoại giao với nước ngoài.
- Quân đội Việt Nam bị giải tán hoặc đặt dưới sự chỉ huy của Pháp.

<em>4. Kinh tế bị bóc lột:</em>
- Pháp có quyền khai thác mỏ, xây dựng đường sá, đường sắt, cảng biển.
- Người Pháp được tự do buôn bán, mở công ty, xí nghiệp.
- Thuế khóa do Pháp quyết định và thu.

<em>5. Triều đình Huế phải trả tiền bồi thường chiến phí:</em> Triều đình phải trả một khoản tiền lớn cho Pháp (dù chính Pháp là kẻ xâm lược).

<strong>Phản ứng của triều đình và nhân dân:</strong> Nhiều quan lại yêu nước trong triều đình phản đối quyết liệt, cho rằng ký hiệp ước là "mất nước". Tuy nhiên, dưới áp lực quân sự của Pháp, triều đình không còn cách nào khác. Sau khi ký hiệp ước, một số quan lại như Tôn Thất Thuyết, Nguyễn Văn Tường kêu gọi vua trẻ Hàm Nghi (lên ngôi tháng 11/1884) thoát khỏi Huế để phát động kháng chiến.

<strong>Kháng chiến tiếp tục:</strong> Mặc dù triều đình đã đầu hàng Pháp, nhưng tinh thần kháng chiến của nhân dân không hề tắt. Năm 1885, vua Hàm Nghi cùng Tôn Thất Thuyết thoát khỏi Huế, phát động phong trào <em>"Cần Vương"</em> (Giúp vua), kêu gọi cả nước đứng lên chống Pháp. Phong trào kháng chiến nổ ra khắp cả nước, kéo dài nhiều năm.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Việt Nam hoàn toàn mất độc lập:</em> Sau Hiệp ước Patenôtre 1884, Việt Nam chính thức trở thành "xứ bảo hộ" và "thuộc địa" của Pháp. Đất nước mất hoàn toàn chủ quyền về chính trị, quân sự, ngoại giao, kinh tế.
- <em>Triều đại Nguyễn suy tàn:</em> Triều đình Huế chỉ còn là bù nhìn, phục vụ cho Pháp. Các vua sau này (Đồng Khánh, Thành Thái, Duy Tân, Khải Định, Bảo Đại) đều là những vua bù nhìn, không có quyền lực thực sự.
- <em>Mở đầu 60 năm đô hộ trực tiếp:</em> Từ 1884 đến 1945, Việt Nam chịu sự đô hộ trực tiếp của Pháp với chính sách bóc lột tàn khốc. Nhân dân lao động khổ sở, bị bóc lột về kinh tế, đàn áp về chính trị, văn hóa.
- <em>Nhưng tinh thần kháng chiến không tắt:</em> Hiệp ước có thể buộc triều đình đầu hàng, nhưng không thể dập tắt tinh thần kháng chiến của nhân dân. Từ phong trào Cần Vương (1885) đến các phong trào yêu nước sau này, nhân dân Việt Nam không ngừng đấu tranh, cuối cùng giành lại độc lập năm 1945.

<strong>So sánh với Hiệp ước Nhâm Tuất 1862:</strong> Nếu Hiệp ước Nhâm Tuất (1862) đánh mất 3 tỉnh miền Đông Nam Bộ, thì Hiệp ước Patenôtre (1884) đánh mất cả nước. Đây là bước ngoặt đau thương nhất trong lịch sử cận đại Việt Nam, đánh dấu sự sụp đổ hoàn toàn của nhà nước phong kiến và sự bắt đầu của thời kỳ thuộc địa nặng nề nhất.`,
            significance: 'Việt Nam chính thức hoàn toàn mất chủ quyền, trở thành "xứ bảo hộ" và "thuộc địa" của Pháp. Triều đình Huế chỉ còn danh nghĩa. Mở đầu 60 năm đô hộ trực tiếp với chính sách bóc lột tàn khốc. Tuy nhiên, tinh thần kháng chiến của nhân dân không hề tắt, dẫn đến phong trào Cần Vương và các phong trào yêu nước sau này.',
            relatedFigures: ['Kiến Phước', 'Hàm Nghi', 'Patenôtre', 'Tôn Thất Thuyết', 'Nguyễn Văn Tường'],
            location: 'Huế'
        },
        {
            year: '1885',
            name: 'Khởi nghĩa Cần Vương',
            type: 'battle',
            icon: '⚔️',
            period: 'modern',
            description: 'Vua Hàm Nghi phát động phong trào Cần Vương chống Pháp.',
            details: `<strong>Bối cảnh sau Hiệp ước Patenôtre 1884:</strong> Sau khi ký Hiệp ước Patenôtre (1884), Việt Nam chính thức trở thành xứ bảo hộ của Pháp. Triều đình Huế mất hết quyền lực, chỉ còn danh nghĩa. Tháng 11/1884, Hàm Nghi - một hoàng tử trẻ tuổi (13 tuổi) - được Tôn Thất Thuyết và các quan lại yêu nước đưa lên ngôi, với hy vọng có thể phát động kháng chiến. Tuy nhiên, Pháp kiểm soát chặt chẽ triều đình, không cho phép bất kỳ động thái chống đối nào.

<strong>Âm mưu đánh úp của Pháp (Đêm 4-5/7/1885):</strong> Tháng 7/1885, quân Pháp do Đô đốc Courbet chỉ huy bất ngờ tấn công Kinh thành Huế vào ban đêm. Mục đích là bắt vua Hàm Nghi, triệt phá hoàn toàn triều đình yêu nước, và đặt một vua bù nhìn nghe lời. Tôn Thất Thuyết - người lãnh đạo phái chủ chiến trong triều đình - đã chuẩn bị trước, liền đưa vua Hàm Nghi thoát khỏi Huế trong đêm. Họ đi về hướng Tây, vượt qua đèo Hải Vân, đến Quảng Trị và sau đó vào vùng núi rừng Quảng Nam - Quảng Ngãi.

<strong>Chiếu Cần Vương (13/7/1885 - Âm lịch):</strong> Ngày 13/7/1885 (Âm lịch), tại Tân Sở (Quảng Trị), vua Hàm Nghi chính thức phát động <em>"Chiếu Cần Vương"</em> (Chiếu kêu gọi giúp vua). Đây là văn bản lịch sử quan trọng, kêu gọi toàn thể quan lại, sĩ phu, nhân dân trong cả nước đứng lên đánh Pháp, giành lại độc lập.

Nội dung Chiếu Cần Vương (tóm tắt):
<em>"... Giặc Pháp xâm lăng, cướp đất nước ta, uy hiếp triều đình... Ta - Hàm Nghi - tuy tuổi còn non trẻ, nhưng quyết tâm hy sinh để báo thù nước... Kêu gọi các quan võ văn, sĩ dân trong cả nước, ai có lòng trung nghĩa, hãy mang quân đến cần vương (giúp vua), cùng nhau đánh đuổi giặc Pháp, giành lại giang san..."</em>

Chiếo Cần Vương được gửi đi khắp cả nước, kêu gọi mọi người cùng kháng chiến.

<strong>Phong trào Cần Vương bùng nổ khắp cả nước (1885-1896):</strong> Chiếu Cần Vương có sức lan tỏa mạnh mẽ. Khắp cả nước, đặc biệt là ở Trung Kỳ và Bắc Kỳ, nhiều nghĩa quân nổi dậy. Các vị lãnh đạo tiêu biểu:

<em>1. Phan Đình Phùng (Hà Tĩnh):</em> Cựu quan triều đình, người có uy tín lớn. Ông tổ chức nghĩa quân ở Hương Khê (Hà Tĩnh), xây dựng căn cứ vững chắc, chống Pháp kiên cường từ 1885 đến 1896. Pháp nhiều lần tiến đánh nhưng đều thất bại. Phan Đình Phùng nổi tiếng với tinh thần kiên trung, bất khuất, dù Pháp đào mồ mả tổ tiên ông để ép buộc đầu hàng.

<em>2. Nguyễn Thiện Thuật (Hưng Yên - Bắc Ninh):</em> Cử nhân, quan thời Tự Đức. Ông tổ chức nghĩa quân ở vùng Bắc Ninh, Hưng Yên, Hải Dương. Nghĩa quân của ông rất mạnh, nhiều lần đánh bại quân Pháp. Ông chiến đấu đến năm 1913.

<em>3. Hoàng Hoa Thám (Đề Thám) - Yên Thế, Bắc Giang:</em> Nghĩa quân của ông hoạt động ở vùng núi Yên Thế (Bắc Giang), sử dụng chiến thuật du kích rất hiệu quả. Ông kháng chiến từ 1885 đến 1913, là cuộc kháng chiến kéo dài nhất trong phong trào Cần Vương.

<em>4. Trương Quốc Dụng (Thanh Hóa, Nghệ An):</em> Tổ chức nghĩa quân, liên kết với các nghĩa quân khác, tấn công quân Pháp nhiều lần.

<em>5. Và hàng trăm nghĩa quân khác:</em> Ở khắp cả nước, từ Bắc đến Nam, đều có nghĩa quân nổi dậy. Dù không có sự phối hợp chặt chẽ, nhưng họ đều cùng chung mục tiêu: đánh Pháp, giải phóng đất nước.

<strong>Chiến thuật và tinh thần:</strong> Nghĩa quân Cần Vương sử dụng chiến thuật du kích: ẩn náu trong rừng núi, đánh úp quân Pháp, cướp vũ khí, phá đường giao thông. Họ được nhân dân ủng hộ, giúp đỡ. Tinh thần "Trung quân ái quốc" (trung với vua, yêu nước) thấm nhuần trong mỗi nghĩa quân. Họ sẵn sàng hy sinh vì lý tưởng độc lập.

<strong>Vua Hàm Nghi bị bắt (1888):</strong> Vua Hàm Nghi cùng Tôn Thất Thuyết ẩn náu trong rừng núi Quảng Nam - Quảng Ngãi, tiếp tục lãnh đạo phong trào kháng chiến. Tuy nhiên, do lực lượng yếu, thiếu vũ khí, lương thực, cuộc sống rất khó khăn. Năm 1888, do sự phản bội của một số người, Pháp bắt được vua Hàm Nghi tại Ba Thê (Quảng Ngãi). Hàm Nghi bị đày sang Algeria (Bắc Phi), không bao giờ được trở về nước. Tôn Thất Thuyết trốn sang Trung Quốc, qua đời ở đó.

<strong>Phong trào Cần Vương tiếp tục sau khi vua bị bắt:</strong> Mặc dù vua Hàm Nghi đã bị bắt, nhưng phong trào Cần Vương vẫn tiếp tục. Các nghĩa quân không ngừng chiến đấu. Phan Đình Phùng, Nguyễn Thiện Thuật, Hoàng Hoa Thám... tiếp tục lãnh đạo nghĩa quân đánh Pháp đến tận những năm 1890-1913. Pháp phải sử dụng hàng vạn quân, tốn nhiều tiền của, mất nhiều năm mới dập tắt dần phong trào.

<strong>Suy yếu và kết thúc:</strong> Phong trào Cần Vương dần suy yếu do nhiều nguyên nhân:
- <em>Thiếu vũ khí hiện đại:</em> Nghĩa quân chủ yếu dùng giáo mác, dao, cung tên, trong khi Pháp có súng đại bác hiện đại.
- <em>Thiếu sự phối hợp:</em> Các nghĩa quân hoạt động riêng rẽ, không có sự chỉ huy thống nhất.
- <em>Lực lượng Pháp hùng mạnh:</em> Pháp dùng chiến thuật "tảo thanh" (càn quét), thiêu rụi làng mạc, giết dân lành, cướp lương thực để cô lập nghĩa quân.
- <em>Hạn chế tư tưởng:</em> Phong trào Cần Vương vẫn mang tư tưởng phong kiến "trung quân" (trung với vua), chưa có chương trình chính trị rõ ràng, tiến bộ.

Đến đầu thế kỷ 20, phong trào Cần Vương dần lắng xuống. Hoàng Hoa Thám (Đề Thám) - người kháng chiến lâu nhất - bị Pháp ám sát năm 1913, đánh dấu sự kết thúc của phong trào.

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Phong trào kháng chiến đầu tiên có tổ chức:</em> Cần Vương là phong trào kháng chiến đầu tiên do triều đình phát động, có sự tham gia của các tầng lớp: sĩ phu, nông dân, quan lại.
- <em>Tinh thần yêu nước bất diệt:</em> Mặc dù thất bại về quân sự, nhưng phong trào Cần Vương thể hiện tinh thần yêu nước, bất khuất của dân tộc Việt Nam. Hàng vạn người đã hy sinh vì độc lập.
- <em>Bài học và kế thừa:</em> Phong trào Cần Vương để lại bài học: không thể chỉ dựa vào lòng yêu nước và tinh thần hy sinh, mà cần có tư tưởng tiến bộ, chương trình chính trị đúng đắn, vũ khí hiện đại, sự tổ chức chặt chẽ. Những bài học này được các thế hệ sau tiếp thu, dẫn đến các phong trào yêu nước mới như Đông Du, Duy Tân, và cuối cùng là Cách mạng tháng Tám 1945 thành công.
- <em>Các anh hùng dân tộc:</em> Phan Đình Phùng, Nguyễn Thiện Thuật, Hoàng Hoa Thám, Hàm Nghi, Tôn Thất Thuyết... trở thành những anh hùng dân tộc, tấm gương sáng về lòng yêu nước và tinh thần hy sinh.

<strong>Di sản:</strong> Phong trào Cần Vương là mốc son trong lịch sử kháng chiến chống thực dân Pháp. Dù thất bại, nhưng ngọn lửa yêu nước không bao giờ tắt, truyền lại cho các thế hệ sau, dẫn đến những phong trào cách mạng tiến bộ hơn, cuối cùng giành lại độc lập năm 1945.`,
            significance: 'Phong trào kháng chiến đầu tiên do triều đình phát động, kéo dài gần 30 năm (1885-1913). Thể hiện tinh thần yêu nước bất khuất của dân tộc. Mặc dù thất bại về quân sự, nhưng để lại di sản tinh thần to lớn, truyền cảm hứng cho các thế hệ sau. Các anh hùng như Phan Đình Phùng, Hoàng Hoa Thám trở thành biểu tượng của lòng trung nghĩa và tinh thần bất굴.',
            relatedFigures: ['Hàm Nghi', 'Tôn Thất Thuyết', 'Phan Đình Phùng', 'Nguyễn Thiện Thuật', 'Hoàng Hoa Thám (Đề Thám)', 'Trương Quốc Dụng'],
            location: 'Quảng Trị, Hà Tĩnh, Bắc Ninh, Yên Thế (Bắc Giang), Nghệ An, Thanh Hóa - Toàn quốc'
        },
        {
            year: '1890',
            name: 'Sinh ra Chủ tịch Hồ Chí Minh',
            type: 'founding',
            icon: '⭐',
            period: 'modern',
            description: 'Nguyễn Sinh Cung (sau này là Hồ Chí Minh) sinh ra tại làng Hoàng Trù, Nam Đàn, Nghệ An.',
            details: `<strong>Ngày sinh và quê hương:</strong> Ngày 19 tháng 5 năm 1890 (theo lịch Dương), tại làng Kim Liên (thôn Hoàng Trù, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An), một người con phi thường của dân tộc Việt Nam ra đời. Người có tên khai sinh là <em>Nguyễn Sinh Cung</em>, sau đổi tên là <em>Nguyễn Tất Thành</em>, và cuối cùng lấy bút danh <em>Hồ Chí Minh</em> - cái tên đi vào lịch sử như một vị lãnh tụ vĩ đại, một anh hùng giải phóng dân tộc, một danh nhân văn hóa thế giới.

<strong>Gia đình và môi trường sống:</strong> Hồ Chí Minh sinh ra trong một gia đình nho học nghèo nhưng có truyền thống yêu nước, cần cù và giản dị. Cha là <em>Nguyễn Sinh Sắc</em> (hiệu Nguyễn Sinh Huy), người đỗ Phó bảng (thi Hương) năm 1894, giữ chức Tri huyện (huyện ủy) nhưng có lòng yêu nước nồng nàn, ghét Pháp, sau này từ chối làm quan cho Pháp. Mẹ là Hoàng Thị Loan, người phụ nữ hiền lành, cần cù. Hồ Chí Minh có một chị (Nguyễn Thị Thanh) và một anh (Nguyễn Sinh Khiêm, sau đổi tên là Nguyễn Tất Đạt).

Nghệ An là vùng đất có truyền thống yêu nước, kháng chiến mạnh mẽ. Đây là quê hương của nhiều anh hùng dân tộc như Nguyễn Huệ (Quang Trung), Phan Đình Phùng. Môi trường này đã ảnh hưởng sâu sắc đến Hồ Chí Minh từ thuở nhỏ.

<strong>Thời niên thiếu và học vấn:</strong> Từ nhỏ, Nguyễn Sinh Cung đã thông minh, hiếu học. Người học chữ Hán với cha, sau đó học chữ Quốc ngữ. Năm 1905, người vào học tại trường Quốc học Huế - trường nổi tiếng đào tạo nhiều nhân tài yêu nước. Tại đây, người chứng kiến cảnh đất nước mất độc lập, nhân dân khổ sở dưới ách thống trị của Pháp. Người còn làm thông ngôn (phiên dịch) và thư ký cho một số quan lại, nhờ đó hiểu rõ chế độ thực dân tàn bạo.

<strong>Quyết định ra đi tìm đường cứu nước (1911):</strong> Năm 1911, khi mới 21 tuổi, Nguyễn Tất Thành quyết định rời bỏ quê hương, lên tàu Đô đốc Latouche Tréville ở cảng Nhà Rồng (Sài Gòn) đi ra nước ngoài. Mục đích không phải để kiếm sống hay du học đơn thuần, mà là để <em>"tìm đường cứu nước"</em>. Trước khi đi, người từ biệt cha và viết bài thơ nổi tiếng:

<em>"Con thuyền đưa Tất đi sang Pháp,
Biển rộng trời cao gió mới nguôi.
Dặn nhắn người thân trong nước,
Đừng buồn khi vắng một người con.
Cây cao lắm có ngày sẽ được làm cột nhà,
Người tài đâu chẳng có một mai vẻ vang"</em>

<strong>Du lịch khắp thế giới (1911-1923):</strong> Hồ Chí Minh đã đi qua nhiều nước trên thế giới: Pháp, Anh, Mỹ, Nga, Trung Quốc, các nước châu Phi, châu Á... Người làm nhiều nghề để kiếm sống: phụ bếp, làm vườn, rửa chén, báo cáo viên, phóng viên báo chí. Trong quá trình đó, người chứng kiến cảnh bóc lột, áp bức của chủ nghĩa thực dân, đế quốc đối với các dân tộc thuộc địa. Người tìm hiểu, học tập các học thuyết cách mạng, đọc các tác phẩm của Mác - Lênin, và dần hình thành tư tưởng cách mạng.

<strong>Tìm thấy con đường cứu nước - Chủ nghĩa Mác - Lênin (1920):</strong> Năm 1920, tại Pháp, Nguyễn Ái Quốc (tên người lúc này) đọc <em>"Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa"</em> của Lênin. Người vô cùng xúc động, nhận ra rằng chỉ có con đường cách mạng vô sản, theo Chủ nghĩa Mác - Lênin, mới có thể giải phóng dân tộc Việt Nam. Người quyết định theo Quốc tế Cộng sản (Quốc tế III), trở thành một trong những người cộng sản đầu tiên của Việt Nam. Năm 1920, người đồng sáng lập Đảng Cộng sản Pháp.

<strong>Hoạt động cách mạng và thành lập Đảng (1923-1930):</strong> Năm 1923, người sang Liên Xô học tập và làm việc tại Quốc tế Cộng sản. Sau đó, người đến Trung Quốc (1924-1927) để vận động, tập hợp, đào tạo thanh niên yêu nước Việt Nam, thành lập Hội Việt Nam Cách mạng Thanh niên (1925) - tiền thân của Đảng Cộng sản Việt Nam. Năm 1930, tại Hương Cảng (Trung Quốc), người chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam (3/2/1930), mở ra kỷ nguyên mới cho cách mạng Việt Nam.

<strong>Lãnh đạo cách mạng giành độc lập (1930-1945):</strong> Từ 1930 đến 1945, dưới sự lãnh đạo của Hồ Chí Minh và Đảng, phong trào cách mạng Việt Nam phát triển mạnh mẽ. Năm 1941, Người về nước sau 30 năm xa quê, lãnh đạo phong trào Việt Minh kháng chiến chống Pháp và Nhật. Tháng 8/1945, Cách mạng tháng Tám thành công, Người đọc Tuyên ngôn Độc lập (2/9/1945), tuyên bố thành lập nước Việt Nam Dân chủ Cộng hòa - nhà nước độc lập đầu tiên trong lịch sử Việt Nam hiện đại.

<strong>Lãnh đạo kháng chiến và xây dựng đất nước (1945-1969):</strong> Từ 1945 đến 1969, Chủ tịch Hồ Chí Minh lãnh đạo nhân dân Việt Nam vượt qua vô số gian khổ, hy sinh, chiến thắng thực dân Pháp (1945-1954), chiến thắng đế quốc Mỹ (1954-1975), xây dựng chủ nghĩa xã hội ở miền Bắc và giải phóng miền Nam. Người là biểu tượng của lòng yêu nước, trí tuệ, tình thương con người và phong cách giản dị, gần gũi.

<strong>Qua đời và di sản (2/9/1969):</strong> Ngày 2/9/1969, Chủ tịch Hồ Chí Minh qua đời tại Hà Nội, hưởng thọ 79 tuổi. Người không được nhìn thấy ngày thống nhất đất nước (30/4/1975), nhưng di nguyện của Người đã thành hiện thực. Người để lại di sản tinh thần vô giá: tư tưởng Hồ Chí Minh, tấm gương đạo đức, phong cách giản dị, tình thương con người, lòng yêu nước nồng nàn.

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Người anh hùng giải phóng dân tộc:</em> Hồ Chí Minh là lãnh tụ vĩ đại nhất của dân tộc Việt Nam, người đã lãnh đạo nhân dân giành độc lập, thống nhất, xây dựng chủ nghĩa xã hội.
- <em>Danh nhân văn hóa thế giới:</em> Năm 1987, UNESCO công nhận Hồ Chí Minh là "Anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới".
- <em>Tư tưởng Hồ Chí Minh:</em> Hệ thống tư tưởng của Người về độc lập dân tộc gắn liền với chủ nghĩa xã hội, về "dân là gốc", về xây dựng con người mới, về đạo đức cách mạng... là di sản quý báu của dân tộc.
- <em>Tấm gương đạo đức:</em> "Bác Hồ" là biểu tượng của đạo đức cách mạng: cần, kiệm, liêm, chính, chí công vô tư, sống giản dị, yêu thương con người.

<strong>Lời căn dặn của Bác:</strong> Trong Di chúc, Chủ tịch Hồ Chí Minh viết: <em>"Không có gì quý hơn độc lập, tự do"</em>. Câu nói này trở thành kim chỉ nam cho dân tộc Việt Nam trong sự nghiệp bảo vệ và xây dựng Tổ quốc.

<strong>Tưởng niệm:</strong> Lăng Chủ tịch Hồ Chí Minh tại Quảng trường Ba Đình, Hà Nội, là nơi tôn vinh công lao của Người. Hàng triệu người trong nước và quốc tế đến viếng mỗi năm. Ngày sinh của Người (19/5) được nhiều địa phương kỷ niệm. Người mãi mãi sống trong trái tim nhân dân Việt Nam.`,
            significance: 'Ra đời người lãnh tụ vĩ đại nhất của dân tộc Việt Nam - Chủ tịch Hồ Chí Minh. Người anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới. Người sáng lập Đảng Cộng sản Việt Nam, lãnh đạo cách mạng giành độc lập, thống nhất đất nước. Di sản tư tưởng và tấm gương đạo đức của Người là kim chỉ nam cho dân tộc.',
            relatedFigures: ['Hồ Chí Minh (Nguyễn Sinh Cung, Nguyễn Tất Thành, Nguyễn Ái Quốc)', 'Nguyễn Sinh Sắc (cha)', 'Hoàng Thị Loan (mẹ)'],
            location: 'Kim Liên (Hoàng Trù), Nam Đàn, Nghệ An'
        },
        {
            year: '1930',
            name: 'Thành lập Đảng Cộng sản Việt Nam',
            type: 'founding',
            icon: '🚩',
            period: 'contemporary',
            description: 'Chủ tịch Hồ Chí Minh thành lập Đảng, mở ra kỷ nguyên mới cho dân tộc.',
            details: `<strong>Bối cảnh lịch sử cuối những năm 1920:</strong> Sau Chiến tranh thế giới thứ nhất (1914-1918), phong trào cách mạng thế giới phát triển mạnh mẽ, đặc biệt sau Cách mạng tháng Mười Nga (1917) thành công. Ở Việt Nam, các phong trào kháng chiến theo lối cũ (Cần Vương, Đông Du, Duy Tân...) đều thất bại. Nhân dân khát khao tìm ra con đường cứu nước mới. Cuối những năm 1920, ở Việt Nam xuất hiện nhiều tổ chức cộng sản nhỏ lẻ, hoạt động riêng rẽ, chưa có sự thống nhất.

<strong>Ba tổ chức cộng sản trước năm 1930:</strong> Vào cuối những năm 1920, ở Việt Nam có ba tổ chức cộng sản chính, đều ra đời từ Hội Việt Nam Cách mạng Thanh niên (do Nguyễn Ái Quốc thành lập năm 1925):

<em>1. Đông Dương Cộng sản Đảng (6/1929):</em> Thành lập tại Bắc Kỳ (Hà Nội), do nhóm Trần Phú, Nông Đức Mạnh lãnh đạo. Họ chủ trương ngay lập tức thành lập Đảng cộng sản.

<em>2. An Nam Cộng sản Đảng (cuối 1929):</em> Thành lập tại Trung Kỳ (Huế, Vinh), do nhóm Nguyễn Ái Quốc trước đây huấn luyện từ Quảng Châu. Họ chủ trương cần chuẩn bị kỹ trước khi thành lập Đảng.

<em>3. Đông Dương Cộng sản Liên đoàn (1929):</em> Thành lập ở Nam Kỳ (Sài Gòn), chịu ảnh hưởng Tháp-pê-pê (Liên đoàn Thanh niên Cộng sản Pháp).

Ba tổ chức này hoạt động riêng rẽ, có những quan điểm khác nhau, thậm chí đấu tranh với nhau. Điều này làm suy yếu lực lượng cách mạng. Cần phải có một Đảng thống nhất, có cương lĩnh, chiến lược đúng đắn để lãnh đạo cách mạng.

<strong>Nguyễn Ái Quốc được Quốc tế Cộng sản giao nhiệm vụ:</strong> Quốc tế Cộng sản (Quốc tế III) nhận thấy tình hình Việt Nam cần phải có sự thống nhất. Họ giao nhiệm vụ cho Nguyễn Ái Quốc (Hồ Chí Minh) - người cộng sản Việt Nam uy tín nhất, có kinh nghiệm quốc tế phong phú - đến Đông Nam Á để hợp nhất các tổ chức cộng sản ở Việt Nam.

<strong>Hội nghị hợp nhất tại Hương Cảng (3/2/1930):</strong> Ngày 3 tháng 2 năm 1930, tại số 3, phố Vương Giác (Kowloon), Hương Cảng (Hồng Kông, Trung Quốc), Nguyễn Ái Quốc chủ trì <em>"Hội nghị hợp nhất các tổ chức cộng sản"</em>. Tham dự hội nghị có đại diện của ba tổ chức:
- <em>Đông Dương Cộng sản Đảng:</em> Trịnh Đình Cửu
- <em>An Nam Cộng sản Đảng:</em> Phan Đăng Lưu, Lê Mao
- <em>Đông Dương Cộng sản Liên đoàn:</em> (Không nhớ tên chính xác)

Với sự tài tình, uy tín và khả năng thuyết phục cao, Nguyễn Ái Quốc đã thuyết phục các đại biểu đồng ý hợp nhất ba tổ chức thành một Đảng thống nhất.

<strong>Ra đời Đảng Cộng sản Việt Nam:</strong> Hội nghị quyết định:
- <em>Tên Đảng:</em> <strong>Đảng Cộng sản Việt Nam</strong> (sau đổi tên thành Đảng Cộng sản Đông Dương vào tháng 10/1930 theo chỉ thị của Quốc tế Cộng sản, và đổi lại thành Đảng Cộng sản Việt Nam vào năm 1951).
- <em>Cương lĩnh chính trị:</em> Nguyễn Ái Quốc soạn thảo <strong>"Cương lĩnh chính trị tóm tắt"</strong> và <strong>"Sách lược vắn tắt"</strong>, nêu rõ nhiệm vụ, mục tiêu của cách mạng Việt Nam.

<strong>Nội dung Cương lĩnh chính trị tóm tắt:</strong>
<em>Mục tiêu ngắn hạn (cách mạng dân tộc dân chủ nhân dân):</em>
- Đánh đổ đế quốc Pháp và phong kiến tay sai
- Giành độc lập, tự do cho dân tộc
- Tiến hành cải cách dân chủ: tịch thu ruộng đất của địa chủ chia cho nông dân, giảm tô giảm tức, cải thiện đời sống nhân dân

<em>Mục tiêu dài hạn (cách mạng xã hội chủ nghĩa):</em>
- Sau khi giành độc lập, tiến lên xây dựng chủ nghĩa xã hội, làm cho dân giàu, nước mạnh, xã hội công bằng

<strong>Lực lượng cách mạng:</strong>
- Giai cấp công nhân lãnh đạo
- Liên minh công nông là nền tảng
- Đoàn kết các tầng lớp yêu nước: tiểu tư sản, tư sản dân tộc, trí thức...

<strong>Phương pháp cách mạng:</strong> Kết hợp đấu tranh chính trị với đấu tranh vũ trang khi cần thiết, huy động sức mạnh của quần chúng.

<strong>Ý nghĩa lịch sử to lớn của Đại hội:</strong>
- <em>Bước ngoặt vĩ đại:</em> Sự ra đời của Đảng Cộng sản Việt Nam là bước ngoặt vĩ đại nhất trong lịch sử dân tộc Việt Nam. Từ đây, cách mạng Việt Nam có đường lối đúng đắn, có người lãnh đạo sáng suốt.

- <em>Kết thúc khủng hoảng về đường lối:</em> Trước đây, các phong trào yêu nước thất bại vì không có con đường, chương trình đúng đắn. Đảng ra đời, đem lại con đường cách mạng vô sản, kết hợp độc lập dân tộc với chủ nghĩa xã hội.

- <em>Sự kết hợp sáng tạo:</em> Đảng Cộng sản Việt Nam kết hợp chủ nghĩa Mác - Lênin với thực tiễn Việt Nam, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu, sau đó tiến lên xã hội chủ nghĩa.

- <em>Lãnh đạo cách mạng thành công:</em> Dưới sự lãnh đạo của Đảng, cách mạng Việt Nam liên tục giành thắng lợi: Cách mạng tháng Tám 1945 giành chính quyền, Kháng chiến chống Pháp (1945-1954) thắng lợi, Kháng chiến chống Mỹ (1954-1975) thắng lợi, giải phóng miền Nam, thống nhất đất nước.

<strong>Phát triển sau khi thành lập:</strong> Sau khi thành lập, Đảng nhanh chóng phát triển chi bộ, đảng viên khắp cả nước. Năm 1930, Đảng lãnh đạo phong trào <em>Xô Viết Nghệ Tĩnh</em> - phong trào cách mạng đầu tiên dưới sự lãnh đạo của Đảng, thể hiện sức mạnh to lớn của giai cấp công nhân và nông dân. Mặc dù bị đàn áp dã man, nhưng phong trào đã khẳng định vai trò lãnh đạo của Đảng và con đường cách mạng đúng đắn.

<strong>Những năm gian khổ (1930-1935):</strong> Từ 1930-1935, Đảng phải hoạt động trong điều kiện vô cùng khó khăn. Thực dân Pháp truy lùng, bắt bớ, tra tấn, giết hại hàng nghìn đảng viên và quần chúng cách mạng. Nhiều đồng chí hy sinh anh dũng. Tuy nhiên, Đảng vẫn kiên cường tồn tại và phát triển.

<strong>Đại hội I toàn quốc (1935):</strong> Tháng 3/1935, Đảng tổ chức Đại hội đại biểu toàn quốc lần thứ nhất tại Ma Cao, tổng kết kinh nghiệm, đề ra đường lối mới phù hợp với tình hình. Từ đây, Đảng ngày càng trưởng thành, dẫn dắt cách mạng từ thắng lợi này đến thắng lợi khác.

<strong>Di sản:</strong> Ngày 3 tháng 2 hàng năm được chọn là <strong>Ngày thành lập Đảng Cộng sản Việt Nam</strong>, là ngày lễ trọng đại của Đảng, của dân tộc. Đảng Cộng sản Việt Nam do Chủ tịch Hồ Chí Minh sáng lập và rèn luyện, là đạo đài, là người lãnh đạo nhân dân ta trong sự nghiệp giải phóng dân tộc, xây dựng và bảo vệ Tổ quốc xã hội chủ nghĩa.`,
            significance: 'Bước ngoặt vĩ đại nhất trong lịch sử dân tộc Việt Nam. Kết thúc tình trạng khủng hoảng về đường lối cứu nước. Cách mạng Việt Nam có đường lối đúng đắn, có người lãnh đạo sáng suốt. Mở ra kỷ nguyên mới - kỷ nguyên độc lập, tự do, tiến lên chủ nghĩa xã hội. Dưới sự lãnh đạo của Đảng, cách mạng Việt Nam liên tục giành thắng lợi vĩ đại.',
            relatedFigures: ['Hồ Chí Minh (Nguyễn Ái Quốc)', 'Trịnh Đình Cửu', 'Phan Đăng Lưu', 'Lê Mao', 'Trần Phú', 'Nông Đức Mạnh'],
            location: 'Hương Cảng (Hồng Kông, Trung Quốc)'
        },
        {
            year: '1945',
            name: 'Cách mạng tháng Tám thành công',
            type: 'revolution',
            icon: '⭐',
            period: 'contemporary',
            description: 'Cách mạng tháng Tám thắng lợi, nước Việt Nam Dân chủ Cộng hòa ra đời.',
            details: `<strong>Bối cảnh Chiến tranh thế giới thứ II và cơ hội cách mạng:</strong> Từ 1940, Nhật Bản xâm chiếm Đông Dương (Việt Nam, Lào, Campuchia) nhưng vẫn để Pháp cai trị hộ. Tháng 3/1945, Nhật đảo chính Pháp, cướp toàn bộ chính quyền. Đến tháng 8/1945, Nhật bại trận, đầu hàng Đồng Minh (sau khi Mỹ ném bom nguyên tử xuống Hiroshima và Nagasaki ngày 6 và 9/8/1945). Chính quyền Nhật ở Việt Nam sụp đổ, Pháp chưa trở lại. Đất nước rơi vào tình trạng chân không quyền lực - đây là thời cơ thuận lợi để giành chính quyền.

<strong>Chuẩn bị của Đảng và Việt Minh (1941-1945):</strong> Năm 1941, Chủ tịch Hồ Chí Minh về nước sau 30 năm đi tìm đường cứu nước. Tại Pắc Bó (Cao Bằng), Đảng tổ chức Hội nghị Trung ương lần thứ 8, quyết định thành lập <em>Mặt trận Việt Minh</em> (Mặt trận Việt Nam độc lập đồng minh) - tập hợp mọi tầng lớp nhân dân yêu nước, không phân biệt giai cấp, tôn giáo, đảng phái, cùng đấu tranh giành độc lập. Từ 1941-1945, Việt Minh phát triển mạnh khắp cả nước, đặc biệt ở các vùng nông thôn và miền núi.

Năm 1944, Đảng thành lập <em>Đội Việt Nam Tuyên truyền Giải phóng quân</em> (tiền thân Quân đội nhân dân Việt Nam) do Võ Nguyên Giáp chỉ huy, chuẩn bị lực lượng vũ trang. Đầu năm 1945, các căn cứ kháng chiến được thiết lập ở Cao Bằng, Bắc Kạn, Lạng Sơn, Thái Nguyên.

<strong>Tháng 8/1945 - Thời cơ vàng xuất hiện:</strong> Ngày 15/8/1945, Nhật hoàng tuyên bố đầu hàng Đồng Minh vô điều kiện. Ngay lập tức, Đảng triệu tập <em>Hội nghị toàn quốc</em> tại Tân Trào (Tuyên Quang) từ 13-15/8/1945. Hội nghị quyết định:
- Phát động <em>Tổng khởi nghĩa</em> giành chính quyền trong cả nước
- Thành lập <em>Ủy ban Dân tộc Giải phóng Việt Nam</em> - chính phủ lâm thời, do Chủ tịch Hồ Chí Minh đứng đầu
- Phát động khẩu hiệu: <em>"Tất cả đứng lên đánh đổ ách Nhật - Pháp, giành độc lập cho tổ quốc!"</em>

<strong>Cuộc Tổng khởi nghĩa (14-28/8/1945):</strong> Từ ngày 14/8, cuộc tổng khởi nghĩa bùng nổ như vũ bão trên cả nước:

<em>Miền Bắc (14-19/8):</em>
- 14/8: Thái Nguyên khởi nghĩa, giành chính quyền đầu tiên
- Sau đó, các tỉnh Bắc Bộ lần lượt giành chính quyền: Cao Bằng, Bắc Kạn, Tuyên Quang, Lạng Sơn, Bắc Giang, Hà Giang...

<em>Hà Nội (19/8):</em> Sáng 19/8/1945, hàng chục vạn nhân dân Hà Nội tham gia mít tinh tại Nhà hát lớn (Opera), sau đó diễu hành khắp thành phố, chiếm các cơ quan quan trọng. Quân Nhật không dám can thiệp. Chính quyền Nhật và bù nhìn sụp đổ. Cờ đỏ sao vàng tung bay khắp Thủ đô. Hà Nội giải phóng.

<em>Huế (23/8):</em> Ngày 23/8, nhân dân Huế khởi nghĩa, bao vây Kinh thành. Ngày 25/8, vua Bảo Đại (vua cuối cùng triều Nguyễn, bù nhìn cho Nhật) tuyên bố thoái vị, giao ấn tín (quyền lực) cho chính phủ cách mạng. Đây là sự kiện có ý nghĩa lịch sử: chấm dứt chế độ phong kiến tồn tại hàng nghìn năm ở Việt Nam.

<em>Sài Gòn (25/8):</em> Ngày 25/8, nhân dân Sài Gòn khởi nghĩa, giành chính quyền. Cờ Việt Minh tung bay trên các tòa nhà quan trọng.

<em>Các tỉnh miền Nam và Trung (tháng 8-9/1945):</em> Các tỉnh khác lần lượt giành chính quyền. Đến cuối tháng 8/1945, cả nước đã nằm trong tay nhân dân.

<strong>Đặc điểm của Cách mạng tháng Tám:</strong>
- <em>Nhanh như chớp:</em> Chỉ trong 15 ngày (14-28/8), cả nước giành chính quyền, không tốn một viên đạn lớn.
- <em>Ít đổ máu:</em> Nhật đầu hàng, không chống trả. Bù nhìn yếu kém, tự động đầu hàng. Nhân dân giành chính quyền hòa bình.
- <em>Sức mạnh quần chúng:</em> Hàng triệu nhân dân tham gia, thể hiện sức mạnh to lớn của khối đại đoàn kết dân tộc.
- <em>Lãnh đạo sáng suốt:</em> Đảng và Hồ Chí Minh nắm bắt thời cơ chính xác, lãnh đạo tài tình.

<strong>Tuyên ngôn Độc lập (2/9/1945):</strong> Ngày 2/9/1945, tại Quảng trường Ba Đình, Hà Nội, trước 50 vạn đồng bào, Chủ tịch Hồ Chí Minh đọc <em>Tuyên ngôn Độc lập</em>, tuyên bố với thế giới: <em>"Nước Việt Nam Dân chủ Cộng hòa đã ra đời!"</em>.

Bản Tuyên ngôn bắt đầu bằng câu nổi tiếng:
<em>"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc."</em> (Trích Tuyên ngôn Độc lập của Mỹ 1776)

Và: <em>"Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy."</em>

Ngày 2/9/1945 trở thành <strong>Quốc khánh</strong> của nước Việt Nam Dân chủ Cộng hòa.

<strong>Thành lập Chính phủ và Quốc hội:</strong> Chủ tịch Hồ Chí Minh được bầu làm Chủ tịch nước. Chính phủ lâm thời được thành lập với sự tham gia của các đảng phái, tôn giáo, dân tộc. Tháng 1/1946, tổ chức tổng tuyển cử, bầu Quốc hội đầu tiên. Đây là cuộc bầu cử dân chủ đầu tiên trong lịch sử Việt Nam.

<strong>Khó khăn sau Cách mạng (cuối 1945):</strong> Sau ngày 2/9/1945, chính quyền cách mạng non trẻ phải đối mặt với vô số khó khăn:
- <em>Nạn đói:</em> Hơn 2 triệu người chết đói (1944-1945).
- <em>Nạn dốt:</em> 90% dân số mù chữ.
- <em>Kho không, két trống:</em> Không có tiền, không có vũ khí.
- <em>Quân Tưởng (Trung Quốc) tiến vào Bắc:</em> 20 vạn quân Tưởng Giới Thạch vào miền Bắc giải giáp quân Nhật, cư xử như quân chiếm đóng.
- <em>Quân Anh vào Nam:</em> Quân Anh vào miền Nam giải giáp Nhật, sau đó giúp Pháp trở lại.
- <em>Pháp muốn quay trở lại:</em> Thực dân Pháp không chấp nhận độc lập của Việt Nam, quyết tâm xâm lược lại.

Chủ tịch Hồ Chí Minh kêu gọi: <em>"Chống giặc đói, chống giặc dốt, chống giặc ngoại xâm!"</em>

<strong>Ý nghĩa lịch sử to lớn:</strong>
- <em>Độc lập lần đầu trong lịch sử hiện đại:</em> Kết thúc 80 năm đô hộ của Pháp (1858-1945), giành độc lập hoàn toàn.
- <em>Chấm dứt chế độ phong kiến:</em> Vua Bảo Đại thoái vị, kết thúc chế độ phong kiến tồn tại hàng nghìn năm.
- <em>Nhà nước mới:</em> Thành lập nước Việt Nam Dân chủ Cộng hòa - nhà nước công nhân - nông dân đầu tiên ở Đông Nam Á, do nhân dân làm chủ.
- <em>Thắng lợi của đường lối Đảng:</em> Cách mạng thành công là minh chứng cho đường lối đúng đắn của Đảng Cộng sản Việt Nam và tư tưởng Hồ Chí Minh.
- <em>Cổ vũ phong trào cách mạng thế giới:</em> Cách mạng tháng Tám cổ vũ mạnh mẽ phong trào giải phóng dân tộc ở châu Á, châu Phi, châu Mỹ La-tinh.

<strong>Di sản:</strong> Cách mạng tháng Tám là sự kiện vĩ đại nhất lịch sử dân tộc Việt Nam thế kỷ XX. Ngày 2/9 là ngày Quốc khánh, ngày lễ trọng đại nhất của dân tộc. Cách mạng tháng Tám mở ra kỷ nguyên độc lập, tự do - "Không có gì quý hơn độc lập, tự do".`,
            significance: 'Sự kiện vĩ đại nhất lịch sử dân tộc Việt Nam thế kỷ XX. Giành độc lập sau 80 năm đô hộ của Pháp. Chấm dứt chế độ phong kiến nghìn năm. Thành lập nước Việt Nam Dân chủ Cộng hòa - nhà nước dân chủ đầu tiên do nhân dân làm chủ. Mở ra kỷ nguyên độc lập, tự do. Ngày 2/9 là Quốc khánh.',
            relatedFigures: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Trường Chinh', 'Phạm Văn Đồng', 'Bảo Đại'],
            location: 'Toàn quốc - Tân Trào (Tuyên Quang), Hà Nội, Huế, Sài Gòn'
        },
        {
            year: '1954',
            name: 'Chiến thắng Điện Biên Phủ',
            type: 'battle',
            icon: '🎖️',
            period: 'contemporary',
            description: 'Đại thắng Điện Biên Phủ, lừng lẫy năm châu, chấn động địa cầu.',
            details: `<strong>Bối cảnh và âm mưu của Pháp:</strong> Sau 7 năm kháng chiến (1946-1953), quân dân ta giành được nhiều thắng lợi quan trọng. Để lật ngược tình thế, tướng Navarre (Tổng chỉ huy quân Pháp ở Đông Dương) đề ra "Kế hoạch Navarre" với trọng điểm là xây dựng tập đoàn cứ điểm Điện Biên Phủ thành "pháo đài bất khả xâm phạm". Pháp tập trung 16.000 quân tinh nhuệ, vũ khí hiện đại, máy bay, xe tăng, pháo binh ủng hộ từ Mỹ để biến Điện Biên Phủ thành "bẫy thép" nhằm tiêu diệt lực lượng chủ lực của ta.

<strong>Quyết định và chuẩn bị:</strong> Đảng và Bác Hồ quyết định mở chiến dịch Điện Biên Phủ với mục tiêu tiêu diệt tập đoàn cứ điểm này, tạo bước ngoặt chiến lược. Đại tướng Võ Nguyên Giáp được giao nhiệm vụ chỉ huy chiến dịch. Ta chuẩn bị công phu về mọi mặt: quân sự, chính trị, hậu cần. Hàng vạn dân công, thanh niên xung phong vận chuyển lương thực, đạn dược lên chiến trường qua những con đường hiểm trở.

<strong>Chiến thuật "đánh chắc, tiến chắc":</strong> Ban đầu, Bộ Tư lệnh định đánh nhanh, thắng nhanh nhưng sau khi khảo sát thực tế, Đại tướng Võ Nguyên Giáp mạnh dạn đề xuất thay đổi phương châm thành "đánh chắc, tiến chắc". Chiến thuật này tuy kéo dài thời gian nhưng giảm thiểu tổn thất, tăng sức mạnh tấn công và đảm bảo thắng lợi chắc chắn.

<strong>Diễn biến 56 ngày đêm:</strong>
- <em>Giai đoạn 1 (13/3 - 17/3/1954):</em> Bộ đội ta tấn công Him Lam, Độc Lập, Hồng Cúm - 3 cứ điểm quan trọng ở phía Bắc Điện Biên Phủ. Trong 5 ngày, 3 cứ điểm này bị xóa sổ, quân Pháp hoang mang.

- <em>Giai đoạn 2 (18/3 - 1/5/1954):</em> Bộ đội ta bao vây chặt chẽ, từng bước thu hẹp vòng vây. Ta sử dụng chiến thuật "đào hào tiến công" (mượn kinh nghiệm từ Triều Tiên), đào hào tiến sát cứ điểm địch. Pháp liên tục tăng viện nhưng đều bị ta đánh bại.

- <em>Giai đoạn 3 (1/5 - 7/5/1954):</em> Tổng công kích, ta tấn công đồng loạt toàn diện. Ngày 7/5/1954, trận quyết chiến diễn ra ác liệt. Chiều cùng ngày, cờ quyết thắng tung bay trên boong-ke chỉ huy của De Castries (Tư lệnh Pháp tại Điện Biên Phủ). De Castries và toàn bộ bộ tư lệnh đầu hàng.

<strong>Kết quả vĩ đại:</strong> Trong 56 ngày đêm, ta tiêu diệt và bắt sống 16.200 địch (trong đó có 1 tướng, 16 đại tá, 1.749 sĩ quan), bắn rơi và phá hủy 62 máy bay, thu nhiều vũ khí, đạn dược. Điện Biên Phủ hoàn toàn giải phóng.

<strong>Ý nghĩa lịch sử và quốc tế:</strong> Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu", buộc Pháp phải ký Hiệp định Genève (21/7/1954) công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia. Đây là lần đầu tiên trong lịch sử, một dân tộc thuộc địa đánh thắng một đế quốc thực dân phương Tây, mở đầu làn sóng giải phóng dân tộc trên toàn thế giới. Chiến thắng đi vào lịch sử quân sự thế giới như một kỳ tích, minh chứng cho sức mạnh của chiến tranh nhân dân.`,
            significance: 'Chiến thắng chấn động địa cầu, kết thúc 80 năm thống trị của thực dân Pháp ở Đông Dương. Mở ra thời đại mới của phong trào giải phóng dân tộc trên thế giới. Khẳng định "Không có gì quý hơn độc lập, tự do".',
            relatedFigures: ['Võ Nguyên Giáp', 'Hồ Chí Minh', 'Hoàng Văn Thái', 'De Castries', 'Navarre'],
            location: 'Điện Biên Phủ (Tây Bắc Việt Nam)'
        },
        {
            year: '1975',
            name: 'Giải phóng miền Nam, thống nhất đất nước',
            type: 'independence',
            icon: '🎊',
            period: 'contemporary',
            description: 'Chiến dịch Hồ Chí Minh thắng lợi hoàn toàn, đất nước hoàn toàn thống nhất.',
            details: `<strong>Bối cảnh cuối cuộc chiến tranh:</strong> Sau Hiệp định Paris năm 1973, Mỹ rút quân khỏi Việt Nam nhưng vẫn viện trợ vũ khí, tiền bạc cho chính quyền Sài Gòn. Quân Sài Gòn vẫn chiếm giữ nhiều vùng đất, gây khó khăn cho nhân dân miền Nam. Đầu năm 1975, Bộ Chính trị quyết định mở chiến dịch Tổng tiến công và nổi dậy mùa Xuân 1975 nhằm giải phóng hoàn toàn miền Nam.

<strong>Chiến dịch Tây Nguyên và Huế - Đà Nẵng (tháng 3/1975):</strong> Tháng 3/1975, quân ta mở chiến dịch Tây Nguyên, giải phóng Buôn Ma Thuột. Địch hoảng loạn, bỏ chạy. Liên tiếp đó, chiến dịch Huế - Đà Nẵng mở ra, hai thành phố quan trọng này được giải phóng chỉ trong vài ngày. Hàng chục vạn quân Sài Gọn tan rã, bỏ chạy. Tình thế chiến tranh thay đổi căn bản, ta chuyển sang thế chủ động toàn diện.

<strong>Quyết định mở Chiến dịch Hồ Chí Minh:</strong> Ngày 14/4/1975, Bộ Chính trị họp quyết định mở chiến dịch lớn nhất trong cuộc kháng chiến - Chiến dịch Hồ Chí Minh - nhằm giải phóng Sài Gòn. Đại tướng Văn Tiến Dũng làm Tổng Tư lệnh, Đại tướng Võ Nguyên Giáp giữ vai trò chỉ đạo chiến lược. Chiến dịch đặt tên theo Chủ tịch Hồ Chí Minh - Người đã hiến dâng cả cuộc đời cho sự nghiệp giải phóng dân tộc nhưng không còn sống để chứng kiến ngày thắng lợi.

<strong>Diễn biến Chiến dịch Hồ Chí Minh (26/4 - 30/4/1975):</strong>
- <em>26-29/4:</em> Quân ta từ 4 hướng Bắc - Nam - Đông - Tây tiến vào Sài Gòn. Các trận đánh ác liệt diễn ra ở Xuân Lộc, Long Thành, Biên Hòa, Củ Chi. Quân Sài Gòn kháng cự quyết liệt tại một số nơi nhưng không thể cứu vãn tình thế.

- <em>Sáng 30/4:</em> Quân ta tiến vào trung tâm Sài Gòn. 10h45, xe tăng 843 và 390 của Trung đoàn 203 húc đổ cổng Dinh Độc Lập (nay là Dinh Thống Nhất). Cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam tung bay trên nóc dinh.

- <em>11h30, 30/4/1975:</em> Tướng Dương Văn Minh - Tổng thống chính quyền Sài Gòn - tuyên bố đầu hàng vô điều kiện qua đài phát thanh Sài Gòn: "Chúng tôi chờ đợi quân Cách mạng để bàn giao chính quyền... Tôi xin mọi người giữ trật tự và kỷ luật..."

<strong>Ý nghĩa lịch sử vĩ đại:</strong>
1. <em>Thống nhất đất nước:</em> Sau gần 100 năm chia cắt (từ khi Pháp xâm lược 1858), đất nước Việt Nam hoàn toàn thống nhất, độc lập, miền Nam được giải phóng hoàn toàn.

2. <em>Kết thúc cuộc chiến tranh dai dài:</em> Kết thúc 30 năm kháng chiến chống Pháp và chống Mỹ (1945-1975), nhân dân Việt Nam đã chiến thắng hai đế quốc hùng mạnh nhất thế giới.

3. <em>Thắng lợi của chiến tranh nhân dân:</em> Chứng minh sức mạnh của chiến tranh nhân dân, của ý chí quyết tâm giành độc lập, tự do. "Không có gì quý hơn độc lập, tự do" - Di chúc của Chủ tịch Hồ Chí Minh đã thành hiện thực.

4. <em>Cống hiến cho phong trào cách mạng thế giới:</em> Thắng lợi của Việt Nam cổ vũ mạnh mẽ phong trào đấu tranh giải phóng dân tộc, chống chủ nghĩa đế quốc trên toàn thế giới.

<strong>Những ngày đầu giải phóng:</strong> Người dân Sài Gòn đổ ra đường chào đón quân giải phóng. Khắp nơi treo cờ, khẩu hiệu. Niềm vui vỡ òa của 50 triệu đồng bào Việt Nam. Ngày 30/4 trở thành ngày Thống nhất đất nước, ngày Giải phóng miền Nam - ngày lễ trọng đại của dân tộc.`,
            significance: 'Hoàn thành sự nghiệp giải phóng dân tộc, thống nhất đất nước. Kết thúc 30 năm chiến tranh, mở ra kỷ nguyên độc lập, thống nhất, xây dựng và phát triển đất nước. Thắng lợi của lòng yêu nước, của sức mạnh đại đoàn kết toàn dân tộc.',
            relatedFigures: ['Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Lê Duẩn', 'Phạm Hùng', 'Dương Văn Minh'],
            location: 'Sài Gòn (TP. Hồ Chí Minh)'
        },
        {
            year: '1976',
            name: 'Nước Việt Nam thống nhất chính thức ra đời',
            type: 'founding',
            icon: '🇻🇳',
            period: 'contemporary',
            description: 'Quốc hội họp, quyết định đổi tên nước thành Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
            details: `<strong>Bối cảnh sau ngày thống nhất 30/4/1975:</strong> Sau khi miền Nam được giải phóng hoàn toàn (30/4/1975), đất nước Việt Nam đã thống nhất về lãnh thổ, nhưng vẫn tồn tại hai chính quyền:
- <em>Miền Bắc:</em> Nước Việt Nam Dân chủ Cộng hòa (thành lập 2/9/1945), thủ đô Hà Nội
- <em>Miền Nam:</em> Cộng hòa Miền Nam Việt Nam (chính quyền lâm thời sau 30/4/1975)

Để hoàn thành sự nghiệp thống nhất, cần phải thống nhất về mặt chính trị, pháp lý, thành lập một nhà nước duy nhất cho cả nước.

<strong>Tổng tuyển cử thống nhất (25/4/1976):</strong> Ngày 25/4/1976, cả nước tổ chức <em>Tổng tuyển cử Quốc hội thống nhất</em>. Đây là cuộc bầu cử lịch sử, lần đầu tiên sau hơn 20 năm chia cắt, đồng bào hai miền cùng đi bỏ phiếu bầu Quốc hội chung. Gần 99% cử tri cả nước tham gia bỏ phiếu, thể hiện khí thế hân hoan của dân tộc. 492 đại biểu Quốc hội được bầu, đại diện cho cả hai miền Bắc và Nam.

<strong>Kỳ họp đầu tiên của Quốc hội khóa VI (24/6 - 3/7/1976):</strong> Từ ngày 24/6 đến 3/7/1976, Quốc hội khóa VI - Quốc hội thống nhất đầu tiên - họp tại Hà Nội. Đây là kỳ họp lịch sử, đánh dấu sự thống nhất hoàn toàn về chính trị và pháp lý của đất nước.

<strong>Các quyết định quan trọng:</strong>

<em>1. Đổi tên nước (2/7/1976):</em>
- Tên nước: <strong>Cộng hòa Xã hội Chủ nghĩa Việt Nam</strong> (viết tắt: CHXHCN Việt Nam hoặc Việt Nam)
- Thủ đô: <strong>Hà Nội</strong>
- Quốc ca: <strong>Tiến quân ca</strong>
- Quốc kỳ: <strong>Cờ đỏ sao vàng</strong>
- Quốc huy: Hình tròn, nền đỏ, có ngôi sao năm cánh màu vàng ở giữa, xung quanh có bông lúa, bên dưới có nửa bánh xe răng và dòng chữ "Cộng hòa Xã hội Chủ nghĩa Việt Nam"

<em>2. Phân chia hành chính:</em>
- Cả nước thống nhất thành một quốc gia duy nhất
- Bãi bỏ ranh giới vĩ tuyến 17 (ranh giới tạm thời chia cắt hai miền từ 1954)
- Sắp xếp lại đơn vị hành chính: 35 tỉnh và 3 thành phố trực thuộc trung ương (Hà Nội, Hải Phòng, TP. Hồ Chí Minh)
- Sài Gòn đổi tên thành <strong>Thành phố Hồ Chí Minh</strong> (từ 2/7/1976) để tưởng nhớ công lao to lớn của Chủ tịch Hồ Chí Minh

<em>3. Bầu lãnh đạo Nhà nước:</em>
- <em>Chủ tịch nước:</em> Tôn Đức Thắng (tái bầu, 86 tuổi)
- <em>Thủ tướng Chính phủ:</em> Phạm Văn Đồng
- <em>Chủ tịch Quốc hội:</em> Trường Chinh
- <em>Tổng Bí thư Đảng:</em> Lê Duẩn (do Ban Chấp hành Trung ương Đảng bầu)

<em>4. Phương hướng xây dựng đất nước:</em>
- Thống nhất đất nước về kinh tế, xã hội, văn hóa
- Xây dựng chủ nghĩa xã hội trên cả nước
- Phát triển kinh tế, cải thiện đời sống nhân dân
- Củng cố quốc phòng, an ninh

<strong>Ý nghĩa lịch sử:</strong>
- <em>Thống nhất hoàn toàn:</em> Sau hơn 100 năm chia cắt (từ khi Pháp xâm lược 1858), đất nước Việt Nam hoàn toàn thống nhất cả về lãnh thổ, chính trị, pháp lý. Không còn hai chính quyền, chỉ còn một nhà nước duy nhất.

- <em>Hoàn thành di nguyện Bác Hồ:</em> Chủ tịch Hồ Chí Minh mất ngày 2/9/1969, chưa kịp nhìn thấy ngày thống nhất (30/4/1975) và ngày thành lập nước Việt Nam thống nhất (2/7/1976). Nhưng di nguyện của Người: "Thống nhất đất nước, hoàn thành độc lập dân tộc" đã thành hiện thực.

- <em>Mở đầu thời kỳ xây dựng đất nước:</em> Sau 30 năm chiến tranh liên miên (1945-1975), đất nước bước vào thời kỳ hòa bình, xây dựng và phát triển. Nhiệm vụ trọng tâm là xây dựng kinh tế, cải thiện đời sống, xây dựng chủ nghĩa xã hội.

- <em>Niềm vui và tự hào dân tộc:</em> Ngày 2/7/1976 là ngày vui mừng của toàn dân tộc. Sau bao năm chia cắt, chiến tranh, đất nước đã hoàn toàn thống nhất, độc lập, tự chủ. Dân tộc Việt Nam tự hào là một trong số ít quốc gia nhỏ bé có thể đánh bại hai đế quốc hùng mạnh (Pháp và Mỹ), giành độc lập và thống nhất.

<strong>Khó khăn sau thống nhất:</strong> Tuy nhiên, sau thống nhất, đất nước phải đối mặt với nhiều khó khăn:
- Hậu quả chiến tranh nặng nề: Hàng triệu người hy sinh, thương tật, hàng triệu tấn bom đạn chưa nổ, môi trường bị phá hoại (chất độc da cam...)
- Kinh tế miền Nam và miền Bắc khác biệt lớn (Nam theo kinh tế thị trường, Bắc theo kế hoạch hóa tập trung)
- Khó khăn về lương thực, thực phẩm, hàng tiêu dùng
- Bị các nước phương Tây cấm vận kinh tế
- Xung đột biên giới với Trung Quốc (chiến tranh biên giới 1979)

Những khó khăn này đòi hỏi Đảng và Nhà nước phải có chính sách đúng đắn để vượt qua. Năm 1986, Đảng khởi xướng công cuộc Đổi mới, đưa đất nước phát triển mạnh mẽ.

<strong>Di sản:</strong> Ngày 2/7 trở thành một mốc son lịch sử, được nhắc đến như <em>"Ngày thống nhất đất nước về chính trị và pháp lý"</em>. Cùng với ngày 30/4 (ngày thống nhất về lãnh thổ), ngày 2/7/1976 là ngày vui của dân tộc, đánh dấu sự hoàn thành trọn vẹn sự nghiệp giải phóng và thống nhất Tổ quốc.`,
            significance: 'Đất nước chính thức thống nhất hoàn toàn về chính trị và pháp lý. Kết thúc hơn 100 năm chia cắt. Thành lập nước Cộng hòa Xã hội Chủ nghĩa Việt Nam với thủ đô Hà Nội. Hoàn thành di nguyện của Chủ tịch Hồ Chí Minh. Mở ra thời kỳ hòa bình, xây dựng và phát triển đất nước.',
            relatedFigures: ['Tôn Đức Thắng', 'Phạm Văn Đồng', 'Trường Chinh', 'Lê Duẩn'],
            location: 'Hà Nội'
        },
        {
            year: '1979',
            name: 'Chiến tranh biên giới Việt - Trung',
            type: 'battle',
            icon: '⚔️',
            period: 'contemporary',
            description: 'Trung Quốc xâm lược biên giới phía Bắc Việt Nam, quân dân ta anh dũng chiến đấu.',
            details: `<strong>Bối cảnh xung đột Việt - Trung:</strong> Sau khi thống nhất đất nước (1975-1976), Việt Nam đối mặt với nhiều khó khăn. Quan hệ Việt Nam - Trung Quốc xấu đi nhanh chóng do nhiều nguyên nhân:
- <em>Quan hệ Việt - Liên Xô thân thiết:</em> Việt Nam thân thiết với Liên Xô, trong khi Trung Quốc và Liên Xô đang trong giai đoạn đối đầu.
- <em>Vấn đề Campuchia:</em> Chế độ Khmer Đỏ (Pol Pot) ở Campuchia, được Trung Quốc ủng hộ, thực hiện chính sách diệt chủng (giết hại hàng triệu người dân Campuchia) và liên tục xâm phạm biên giới Việt Nam, giết hại dân lành. Tháng 12/1978, Việt Nam cử quân vào Campuchia, giải phóng nhân dân Campuchia khỏi chế độ diệt chủng Pol Pot (7/1/1979). Trung Quốc coi đây là hành động chống lại lợi ích của mình.
- <em>Vấn đề người Hoa ở Việt Nam:</em> Trung Quốc lợi dụng vấn đề người Hoa ở Việt Nam để gây sức ép.
- <em>Tranh chấp lãnh thổ:</em> Tranh chấp biên giới trên bộ và trên biển (Hoàng Sa, Trường Sa).

<strong>Trung Quốc tuyên bố "dạy cho Việt Nam một bài học":</strong> Tháng 2/1979, lãnh đạo Trung Quốc tuyên bố sẽ "dạy cho Việt Nam một bài học" vì đã "xâm lược" Campuchia và "bức hại người Hoa". Thực chất, Trung Quốc muốn trừng phạt Việt Nam vì không nghe lời, muốn áp đặt ý chí của mình lên Đông Nam Á.

<strong>Chiến tranh biên giới bùng nổ (17/2/1979):</strong> Sáng ngày 17/2/1979, quân Trung Quốc với lực lượng hơn 60 vạn quân, chia làm nhiều mũi, tấn công đồng loạt 6 tỉnh biên giới phía Bắc Việt Nam: Lai Châu, Lào Cai, Hà Giang, Cao Bằng, Lạng Sơn, Quảng Ninh. Họ sử dụng pháo binh, xe tăng, máy bay, chiến đấu theo kiểu "nhân hải chiến thuật" (biển người).

<strong>Quân dân ta kiên cường chiến đấu:</strong> Lực lượng Việt Nam tại biên giới lúc này chủ yếu là dân quân, du kích và một số bộ đội địa phương (lực lượng chủ lực đang ở Campuchia). Tuy yếu thế về số lượng và vũ khí, nhưng quân dân ta kiên cường chiến đấu, bảo vệ từng tấc đất, từng ngôi nhà:

<em>Lạng Sơn:</em> Trung Quốc tập trung lực lượng lớn nhất đánh Lạng Sơn. Quân và dân Lạng Sơn chiến đấu ác liệt, giữ vững thành phố và các trận địa quan trọng. Trung Quốc phải tốn nhiều lực lượng và thời gian.

<em>Cao Bằng:</em> Quân dân Cao Bằng kiên cường bảo vệ các cửa khẩu và thị xã Cao Bằng. Nhiều trận đánh ác liệt diễn ra tại Thông Nông, Trùng Khánh.

<em>Lào Cai, Lai Châu, Hà Giang, Quảng Ninh:</em> Quân dân các tỉnh đều chiến đấu dũng cảm, gây nhiều tổn thất cho địch.

<strong>Trung Quốc rút quân (5-16/3/1979):</strong> Sau gần một tháng chiến đấu, quân Trung Quốc không đạt được mục tiêu chiến lược (chiếm các thành phố lớn, uy hiếp Hà Nội). Họ gặp phải sức kháng cự mạnh mẽ của quân dân ta, tổn thất nặng nề về người và vũ khí. Ngày 5/3/1979, Trung Quốc tuyên bố rút quân. Đến 16/3/1979, quân Trung Quốc rút hết khỏi lãnh thổ Việt Nam, nhưng trước khi rút, họ phá hủy hạ tầng cơ sở (nhà cửa, trường học, bệnh viện, cầu đường...), cướp phá tài sản, gây thiệt hại to lớn cho các tỉnh biên giới.

<strong>Tổn thất và hậu quả:</strong>
- <em>Việt Nam:</em> Hàng nghìn chiến sĩ và dân thường hy sinh, thương tật. Các tỉnh biên giới bị tàn phá nặng nề. Tuy nhiên, ta giữ vững chủ quyền lãnh thổ, không để Trung Quốc chiếm được vùng đất nào.
- <em>Trung Quốc:</em> Theo thống kê của phía Việt Nam, Trung Quốc thiệt hại nặng nề về người (hàng chục nghìn người chết, bị thương) và vũ khí. Mục tiêu "dạy bài học" cho Việt Nam không đạt được.

<strong>Xung đột kéo dài đến 1989:</strong> Sau tháng 3/1979, mặc dù quân Trung Quốc rút khỏi sâu trong lãnh thổ Việt Nam, nhưng xung đột vẫn tiếp diễn ở biên giới trong suốt 10 năm (1979-1989). Trung Quốc liên tục pháo kích, xâm nhập, gây khó khăn cho nhân dân vùng biên. Quân dân ta kiên trì bảo vệ biên giới. Nhiều anh hùng, liệt sĩ hy sinh trong thời kỳ này.

<strong>Bình thường hóa quan hệ (1991):</strong> Đến đầu thập niên 1990, sau khi Liên Xô sụp đổ, tình hình quốc tế thay đổi. Việt Nam và Trung Quốc bắt đầu đàm phán bình thường hóa quan hệ. Năm 1991, hai nước chính thức bình thường hóa quan hệ. Vấn đề biên giới trên bộ được giải quyết qua đàm phán, ký Hiệp định phân định biên giới trên bộ năm 1999-2009.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Bảo vệ chủ quyền thành công:</em> Mặc dù ở thế yếu, nhưng quân dân Việt Nam đã kiên cường bảo vệ từng tấc đất, giữ vững chủ quyền lãnh thổ, không để Trung Quốc chiếm đóng lâu dài. Đây là minh chứng cho ý chí bảo vệ Tổ quốc của dân tộc Việt Nam.

- <em>Tinh thần "đánh giặc cứu nước" một lần nữa được phát huy:</em> Dù vừa mới kết thúc 30 năm chiến tranh (1945-1975), nhưng khi Tổ quốc gọi, quân dân ta sẵn sàng hy sinh để bảo vệ từng tấc đất thiêng liêng.

- <em>Bài học về độc lập tự chủ:</em> Việt Nam không thể dựa dẫm vào nước lớn. Phải tự lực tự cường, xây dựng đất nước vững mạnh, đồng thời có chính sách đối ngoại linh hoạt, kết bạn với nhiều nước, không phụ thuộc vào một nước lớn nào.

<strong>Di sản:</strong> Chiến tranh biên giới 1979 và 10 năm xung đột biên giới (1979-1989) là thời kỳ đau thương. Hàng vạn chiến sĩ, dân quân, dân thường hy sinh để bảo vệ Tổ quốc. Các nghĩa trang liệt sĩ ở Vị Xuyên (Hà Giang), Đồng Đăng (Lạng Sơn), Thất Khê (Lạng Sơn)... là nơi an nghỉ của các anh hùng. Thế hệ sau luôn ghi nhớ công lao của họ.`,
            significance: 'Bảo vệ chủ quyền lãnh thổ thành công trước cuộc xâm lược của Trung Quốc. Thể hiện ý chí bất khuất và tinh thần yêu nước của quân dân Việt Nam. Khẳng định độc lập tự chủ, không chịu sự áp đặt của nước lớn. Bài học về tự lực tự cường và chính sách đối ngoại đa phương hóa, đa dạng hóa.',
            relatedFigures: ['Lê Duẩn', 'Văn Tiến Dũng', 'Chu Huy Mân', 'Hoàng Văn Thái'],
            location: 'Biên giới phía Bắc: Lai Châu, Lào Cai, Hà Giang, Cao Bằng, Lạng Sơn, Quảng Ninh'
        },
        {
            year: '1986',
            name: 'Đại hội VI - Khởi đầu công cuộc Đổi mới',
            type: 'revolution',
            icon: '🔄',
            period: 'contemporary',
            description: 'Đảng Cộng sản Việt Nam khởi xướng công cuộc Đổi mới toàn diện đất nước.',
            details: `<strong>Bối cảnh khủng hoảng kinh tế - xã hội (đầu những năm 1980):</strong> Sau khi thống nhất đất nước (1976), Việt Nam gặp phải nhiều khó khăn, khủng hoảng nghiêm trọng:
- <em>Kinh tế kém hiệu quả:</em> Mô hình kinh tế kế hoạch hóa tập trung, quan liêu, bao cấp không phát huy được sức sản xuất. Nông nghiệp trì trệ, công nghiệp kém hiệu quả.
- <em>Thiếu lương thực:</em> Phải nhập khẩu hàng triệu tấn lương thực mỗi năm để nuôi dân.
- <em>Lạm phát cao:</em> Lạm phát lên đến hàng trăm phần trăm mỗi năm. Tiền mất giá, đời sống nhân dân khó khăn.
- <em>Cấm vận quốc tế:</em> Bị phương Tây cấm vận kinh tế sau sự kiện Campuchia (1978).
- <em>Chiến tranh biên giới:</em> Xung đột với Trung Quốc (1979-1989) tiêu tốn nhiều nguồn lực.
- <em>Khủng hoảng về nhận thức:</em> Một bộ phận cán bộ, đảng viên còn bảo thủ, giáo điều, không dám đổi mới.

Đất nước đứng trước nguy cơ tụt hậu, nghèo đói kéo dài. Cần phải có một sự thay đổi căn bản, quyết liệt.

<strong>Đại hội Đảng lần thứ VI (15-18/12/1986, Hà Nội):</strong> Tháng 12/1986, Đảng Cộng sản Việt Nam tổ chức <em>Đại hội đại biểu toàn quốc lần thứ VI</em> tại Hà Nội. Đây là Đại hội mang tính bước ngoặt lịch sử. Đại hội đã thẳng thắn nhìn nhận những yếu kém, sai lầm, và quyết tâm đổi mới.

<strong>Đường lối Đổi mới:</strong> Đại hội VI đề ra đường lối <strong>"Đổi mới toàn diện, đồng bộ"</strong> với những nội dung chính:

<em>1. Đổi mới tư duy kinh tế:</em>
- Chuyển từ kinh tế kế hoạch hóa tập trung, quan liêu, bao cấp sang <strong>kinh tế thị trường định hướng xã hội chủ nghĩa</strong>.
- Phát huy mọi nguồn lực, khuyến khích phát triển kinh tế nhiều thành phần (nhà nước, tập thể, tư nhân, tư bản nhà nước, tư bản tư nhân), miễn là vì lợi ích quốc gia, dân tộc.
- Công nhận vai trò của thị trường, nhưng Nhà nước vẫn giữ vai trò định hướng, quản lý vĩ mô.

<em>2. Cơ chế quản lý kinh tế mới:</em>
- Phân quyền cho doanh nghiệp, hợp tác xã, hộ gia đình tự chủ sản xuất, kinh doanh.
- Khoán 10 đối với nông dân: Giao đất cho nông dân sản xuất lâu dài, tự chủ sản xuất, nộp sản phẩm theo hợp đồng. Đây là đột phá lớn, giải phóng sức sản xuất nông nghiệp.

<em>3. Đổi mới chính trị - xã hội:</em>
- Xây dựng Nhà nước pháp quyền xã hội chủ nghĩa
- Phát huy dân chủ, tăng cường pháp chế
- Chống tham nhũng, quan liêu, lãng phí

<em>4. Đối ngoại đa phương hóa, đa dạng hóa:</em>
- Việt Nam muốn làm bạn với tất cả các nước, không phụ thuộc vào một nước lớn nào
- Mở cửa, hội nhập quốc tế
- Thu hút đầu tư nước ngoài

<strong>Nhân sự mới - Tổng Bí thư Nguyễn Văn Linh:</strong> Đại hội VI bầu <em>Nguyễn Văn Linh</em> làm Tổng Bí thư - người có tư tưởng cởi mở, dám nghĩ dám làm, quyết tâm đổi mới. Ông nổi tiếng với khẩu hiệu <em>"Dân biết, dân bàn, dân làm, dân kiểm tra"</em>. Ông cũng thúc đẩy báo chí, trí thức tham gia đóng góp ý kiến, tạo không khí cởi mở.

<strong>Kết quả của Đổi mới (từ 1986 đến nay):</strong> Đường lối Đổi mới đã đem lại những thành quả to lớn:

<em>Kinh tế:</em>
- Từ nước thiếu lương thực, Việt Nam trở thành nước xuất khẩu gạo lớn thứ 2-3 thế giới (từ đầu những năm 1990)
- Tăng trưởng kinh tế cao, GDP bình quân 6-7%/năm
- Công nghiệp, dịch vụ phát triển mạnh
- Thu hút được hàng trăm tỷ USD đầu tư nước ngoài
- Xuất khẩu tăng mạnh, hội nhập sâu rộng vào nền kinh tế thế giới

<em>Xã hội:</em>
- Đời sống nhân dân được cải thiện đáng kể, tỷ lệ hộ nghèo giảm mạnh (từ hơn 70% năm 1990 xuống dưới 5% năm 2020)
- Giáo dục, y tế phát triển
- Cơ sở hạ tầng được đầu tư mạnh (đường sá, cầu, cảng, sân bay...)

<em>Đối ngoại:</em>
- Việt Nam bình thường hóa quan hệ với hầu hết các nước
- Gia nhập ASEAN (1995), WTO (2007)
- Có quan hệ tốt đẹp với nhiều nước, không bị cô lập

<strong>Ý nghĩa lịch sử:</strong>
- <em>Bước ngoặt lịch sử:</em> Đại hội VI là bước ngoặt lịch sử, cứu Việt Nam thoát khỏi khủng hoảng kinh tế - xã hội.
- <em>Con đường đúng đắn:</em> Đường lối Đổi mới là con đường đúng đắn, phù hợp với thực tiễn Việt Nam và xu thế thời đại. Kết hợp kinh tế thị trường với định hướng xã hội chủ nghĩa là sáng tạo của Đảng.
- <em>Sự nghiệp đổi mới tiếp tục:</em> Từ 1986 đến nay, sự nghiệp Đổi mới vẫn tiếp tục được đẩy mạnh qua các Đại hội Đảng sau này (VII, VIII, IX, X, XI, XII, XIII), giúp Việt Nam phát triển mạnh mẽ.

<strong>Di sản:</strong> Đại hội VI và đường lối Đổi mới là một trong những quyết sách sáng suốt nhất của Đảng. Ngày nay, Việt Nam từ một nước nghèo nàn, lạc hậu đã trở thành nước có thu nhập trung bình, đang hướng tới trở thành nước phát triển. Đổi mới đã thay đổi diện mạo đất nước, mang lại cuộc sống ấm no, hạnh phúc cho nhân dân.`,
            significance: 'Bước ngoặt lịch sử, cứu Việt Nam thoát khỏi khủng hoảng kinh tế - xã hội. Chuyển sang kinh tế thị trường định hướng xã hội chủ nghĩa. Mở cửa, hội nhập quốc tế. Thúc đẩy phát triển mạnh mẽ, cải thiện đời sống nhân dân. Đường lối Đổi mới là một trong những quyết sách sáng suốt nhất của Đảng.',
            relatedFigures: ['Nguyễn Văn Linh', 'Trường Chinh', 'Phạm Văn Đồng', 'Võ Văn Kiệt'],
            location: 'Hà Nội'
        },
        {
            year: '1995',
            name: 'Việt Nam gia nhập ASEAN',
            type: 'founding',
            icon: '🤝',
            period: 'contemporary',
            description: 'Việt Nam chính thức trở thành thành viên thứ 7 của ASEAN.',
            details: `<strong>ASEAN là gì?</strong> ASEAN (Hiệp hội các quốc gia Đông Nam Á - Association of Southeast Asian Nations) được thành lập ngày 8/8/1967 tại Bangkok (Thái Lan) bởi 5 nước sáng lập: Thái Lan, Indonesia, Malaysia, Singapore, Philippines. Mục tiêu của ASEAN là thúc đẩy hòa bình, ổn định, hợp tác và phát triển kinh tế - xã hội ở khu vực Đông Nam Á. Sau đó, Brunei (1984) gia nhập, trước khi Việt Nam gia nhập năm 1995.

<strong>Bối cảnh trước khi gia nhập:</strong> Trước đây, do chiến tranh và xung đột ở Campuchia (1978-1989), Việt Nam và ASEAN đối đầu. Các nước ASEAN ủng hộ phe Khmer Đỏ (Pol Pot), trong khi Việt Nam hỗ trợ chính phủ Campuchia sau khi đánh đổ Khmer Đỏ. Việt Nam bị cô lập, cấm vận quốc tế. Tuy nhiên, sau khi vấn đề Campuchia được giải quyết (Hiệp định Paris 1991) và Việt Nam rút quân khỏi Campuchia, quan hệ Việt Nam - ASEAN dần cải thiện.

<strong>Chính sách Đổi mới và mở cửa (từ 1986):</strong> Sau Đại hội VI (1986), Việt Nam thực hiện chính sách Đổi mới, mở cửa, hội nhập quốc tế, đa phương hóa, đa dạng hóa quan hệ đối ngoại. Việt Nam mong muốn hòa nhập với khu vực và thế giới, phát triển kinh tế, thoát khỏi cô lập.

<strong>Quá trình gia nhập ASEAN (1992-1995):</strong>
- <em>1992:</em> Việt Nam ký <em>Hiệp ước Hữu nghị và Hợp tác</em> (TAC) với ASEAN, trở thành quan sát viên.
- <em>1993:</em> Việt Nam chính thức nộp đơn xin gia nhập ASEAN.
- <em>1994:</em> Các nước ASEAN xem xét, đánh giá, đàm phán với Việt Nam.
- <em>28/7/1995:</em> Tại Hội nghị Bộ trưởng Ngoại giao ASEAN lần thứ 28 tại Bandar Seri Begawan (Brunei), các nước ASEAN nhất trí chấp nhận Việt Nam gia nhập.

<strong>Lễ gia nhập ASEAN (28/7/1995, Brunei):</strong> Ngày 28 tháng 7 năm 1995, tại Brunei, Việt Nam chính thức gia nhập ASEAN, trở thành thành viên thứ 7. Phó Thủ tướng겸 Bộ trưởng Ngoại giao Nguyễn Mạnh Cầm đại diện Việt Nam ký Nghị định thư gia nhập. Đây là sự kiện lịch sử, đánh dấu Việt Nam kết thúc thời kỳ bị cô lập, bước vào giai đoạn hội nhập sâu rộng với khu vực.

<strong>Ý nghĩa của việc gia nhập ASEAN:</strong>

<em>1. Chính trị - Ngoại giao:</em>
- Chấm dứt thời kỳ cô lập, bị cấm vận. Việt Nam trở thành một phần của cộng đồng ASEAN gồm gần 700 triệu dân.
- Tăng cường quan hệ hữu nghị, hợp tác với các nước láng giềng.
- Nâng cao vị thế, uy tín của Việt Nam trên trường quốc tế.
- Có tiếng nói, vai trò trong các vấn đề khu vực và quốc tế.

<em>2. Kinh tế:</em>
- Mở rộng thị trường: Hàng hóa Việt Nam tiếp cận thị trường 10 nước ASEAN (khi Lào, Myanmar, Campuchia gia nhập sau).
- Thu hút đầu tư: Các doanh nghiệp ASEAN và quốc tế tin tưởng đầu tư vào Việt Nam.
- Hợp tác kinh tế: Tham gia các chương trình hợp tác như AFTA (Khu vực Mậu dịch Tự do ASEAN), AEC (Cộng đồng Kinh tế ASEAN).
- Tăng xuất khẩu, nhập khẩu, thương mại phát triển mạnh.

<em>3. Văn hóa - Xã hội:</em>
- Trao đổi văn hóa, giáo dục, du lịch với các nước ASEAN.
- Học hỏi kinh nghiệm phát triển từ các nước thành viên.
- Hợp tác về giáo dục, y tế, khoa học công nghệ.

<em>4. An ninh:</em>
- Cùng ASEAN duy trì hòa bình, ổn định ở Đông Nam Á.
- Hợp tác chống tội phạm xuyên quốc gia, khủng bố, ma túy.
- Tham gia các cơ chế an ninh khu vực (ARF, ADMM+...).

<strong>Kết quả sau 30 năm gia nhập (1995-2025):</strong> Sau gần 30 năm gia nhập ASEAN, Việt Nam đã đạt được nhiều thành tựu:
- Kim ngạch thương mại với ASEAN tăng hàng chục lần
- Thu hút hàng trăm tỷ USD đầu tư từ ASEAN
- Quan hệ chính trị, ngoại giao, văn hóa phát triển tốt đẹp
- Vai trò ngày càng quan trọng trong ASEAN (Việt Nam làm Chủ tịch ASEAN năm 1998, 2010, 2020)
- Góp phần xây dựng Cộng đồng ASEAN (2015)

<strong>ASEAN ngày nay (2025):</strong> ASEAN có 10 thành viên: Brunei, Campuchia, Indonesia, Lào, Malaysia, Myanmar, Philippines, Singapore, Thái Lan, Việt Nam. Tổng dân số khoảng 680 triệu người. ASEAN là một trong những khu vực kinh tế năng động nhất thế giới.

<strong>Ý nghĩa lịch sử:</strong>
- <em>Hội nhập thành công:</em> Việt Nam gia nhập ASEAN là bước đi chiến lược, thành công của chính sách đối ngoại đa phương hóa, đa dạng hóa. Đánh dấu Việt Nam chính thức hội nhập với khu vực.
- <em>Từ đối đầu đến hợp tác:</em> Việt Nam và ASEAN từng đối đầu vì vấn đề Campuchia, nhưng đã vượt qua, trở thành đối tác hợp tác toàn diện.
- <em>Động lực phát triển:</em> ASEAN là động lực quan trọng giúp Việt Nam phát triển kinh tế, nâng cao đời sống nhân dân, hội nhập sâu rộng vào nền kinh tế thế giới.

<strong>Di sản:</strong> Ngày 28/7 hàng năm, Việt Nam kỷ niệm ngày gia nhập ASEAN, nhắc nhở về quyết sách đúng đắn của Đảng và Nhà nước trong việc mở cửa, hội nhập. ASEAN là "ngôi nhà chung" của Việt Nam và các nước Đông Nam Á, cùng nhau xây dựng một khu vực hòa bình, ổn định, phát triển.`,
            significance: 'Chấm dứt thời kỳ cô lập, hội nhập sâu rộng với khu vực Đông Nam Á. Mở rộng thị trường, thu hút đầu tư, thúc đẩy phát triển kinh tế. Nâng cao vị thế quốc tế của Việt Nam. Đóng góp vào xây dựng Cộng đồng ASEAN hòa bình, ổn định, phát triển. Là bước đi chiến lược thành công của chính sách đối ngoại Việt Nam.',
            relatedFigures: ['Đỗ Mười', 'Võ Văn Kiệt', 'Nguyễn Mạnh Cầm', 'Lê Đức Anh'],
            location: 'Bandar Seri Begawan, Brunei'
        },
        {
            year: '2007',
            name: 'Việt Nam gia nhập WTO',
            type: 'founding',
            icon: '🌐',
            period: 'contemporary',
            description: 'Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới.',
            details: `<strong>WTO là gì?</strong> WTO (World Trade Organization - Tổ chức Thương mại Thế giới) được thành lập năm 1995, thay thế GATT (Hiệp định chung về Thuế quan và Thương mại). WTO là tổ chức quốc tế điều phối, quản lý thương mại toàn cầu, đảm bảo thương mại diễn ra công bằng, minh bạch, có lợi cho tất cả các nước thành viên. Hiện nay WTO có 164 thành viên (tính đến 2025), chiếm hơn 98% thương mại thế giới.

<strong>Tại sao Việt Nam muốn gia nhập WTO?</strong> Sau khi Đổi mới (1986), đặc biệt là sau khi gia nhập ASEAN (1995), Việt Nam nhận thấy cần phải hội nhập sâu rộng hơn vào kinh tế thế giới để:
- Mở rộng thị trường xuất khẩu (hưởng chế độ thuế quan ưu đãi)
- Thu hút đầu tư nước ngoài (FDI) mạnh mẽ hơn
- Học hỏi, tiếp cận công nghệ, kinh nghiệm quản lý tiên tiến
- Nâng cao năng lực cạnh tranh của nền kinh tế
- Tăng cường vị thế quốc tế

<strong>Quá trình đàm phán dài và khó khăn (1995-2006):</strong> Việt Nam nộp đơn xin gia nhập WTO năm 1995. Quá trình đàm phán kéo dài 11 năm (1995-2006), trải qua nhiều vòng đàm phán song phương và đa phương với các nước thành viên, đặc biệt là Mỹ, EU, Nhật Bản, Australia...

<em>Các vấn đề khó khăn trong đàm phán:</em>
- Cam kết mở cửa thị trường: Việt Nam phải cam kết giảm thuế nhập khẩu, mở cửa nhiều lĩnh vực (ngân hàng, bảo hiểm, viễn thông, phân phối...).
- Bảo hộ quyền sở hữu trí tuệ: Phải cam kết bảo vệ bản quyền, thương hiệu.
- Cải cách thể chế, pháp luật: Phải sửa đổi nhiều luật, quy định cho phù hợp với các cam kết WTO.
- Doanh nghiệp nhà nước: Phải minh bạch hóa hoạt động, không được bảo hộ bất hợp lý.

<strong>Đàm phán song phương quan trọng nhất - Việt Nam - Mỹ:</strong> Mỹ là nền kinh tế lớn nhất thế giới, có tiếng nói quyết định trong WTO. Việt Nam và Mỹ đàm phán rất khó khăn, kéo dài nhiều năm. Cuối cùng, tháng 5/2006, hai bên đạt được thỏa thuận song phương, mở đường cho Việt Nam gia nhập WTO.

<strong>Hội nghị Bộ trưởng WTO lần thứ 6 (11-12/11/2006, Geneva):</strong> Ngày 7/11/2006, Hội đồng chung WTO nhất trí chấp thuận Việt Nam trở thành thành viên. Ngày 11/11/2006, tại Hội nghị Bộ trưởng WTO lần thứ 6 ở Geneva (Thụy Sĩ), Việt Nam chính thức được mời gia nhập WTO.

<strong>Lễ ký Nghị định thư gia nhập (7/11/2006) và chính thức gia nhập (11/1/2007):</strong>
- <em>7/11/2006:</em> Thủ tướng Nguyễn Tấn Dũng ký Nghị định thư gia nhập WTO tại Geneva.
- <em>11/1/2007:</em> Việt Nam chính thức trở thành thành viên thứ 150 của WTO. Đây là ngày lịch sử, đánh dấu Việt Nam hội nhập chính thức và toàn diện vào nền kinh tế thế giới.

<strong>Ý nghĩa to lớn của việc gia nhập WTO:</strong>

<em>1. Kinh tế phát triển mạnh mẽ:</em>
- <em>Xuất khẩu tăng trưởng nhanh:</em> Kim ngạch xuất khẩu tăng từ khoảng 40 tỷ USD (2006) lên hơn 300 tỷ USD (2020), tăng gần 8 lần trong 14 năm.
- <em>Thu hút FDI kỷ lục:</em> Việt Nam trở thành điểm đến hấp dẫn cho đầu tư nước ngoài. FDI đổ vào mạnh mẽ, góp phần tạo việc làm, chuyển giao công nghệ.
- <em>GDP tăng trưởng cao:</em> Tốc độ tăng trưởng GDP bình quân 6-7%/năm, Việt Nam trở thành nền kinh tế có thu nhập trung bình.
- <em>Hội nhập chuỗi giá trị toàn cầu:</em> Việt Nam tham gia sâu vào chuỗi cung ứng toàn cầu, đặc biệt trong các ngành điện tử, dệt may, giày da, nông sản...

<em>2. Cải cách thể chế, pháp luật:</em>
- Việt Nam phải sửa đổi, hoàn thiện hệ thống pháp luật, quy định cho phù hợp với chuẩn mực quốc tế.
- Tăng cường minh bạch, pháp quyền, giảm quan liêu, tham nhũng.
- Doanh nghiệp hoạt động trong môi trường công bằng, cạnh tranh lành mạnh hơn.

<em>3. Năng lực cạnh tranh nâng cao:</em>
- Doanh nghiệp Việt Nam buộc phải nâng cao chất lượng, giảm giá thành để cạnh tranh.
- Học hỏi kinh nghiệm quản lý, công nghệ từ doanh nghiệp nước ngoài.
- Người lao động có nhiều cơ hội việc làm, thu nhập tăng.

<em>4. Đời sống nhân dân cải thiện:</em>
- Hàng hóa phong phú, chất lượng tốt hơn, giá cả hợp lý hơn.
- Thu nhập bình quân tăng, tỷ lệ nghèo giảm mạnh.
- Cơ hội học tập, làm việc ở nước ngoài tăng.

<em>5. Vị thế quốc tế nâng cao:</em>
- Việt Nam được cộng đồng quốc tế công nhận là nền kinh tế hội nhập sâu rộng.
- Tham gia các hiệp định thương mại tự do (FTA) như CPTPP, EVFTA...
- Có tiếng nói trong các vấn đề kinh tế, thương mại quốc tế.

<strong>Thách thức sau khi gia nhập WTO:</strong> Bên cạnh cơ hội, Việt Nam cũng đối mặt với nhiều thách thức:
- Cạnh tranh gay gắt, nhiều doanh nghiệp yếu kém bị đào thải.
- Cần cải cách mạnh mẽ, nâng cao năng lực cạnh tranh.
- Bảo vệ môi trường, phát triển bền vững.
- Đào tạo nguồn nhân lực chất lượng cao.

<strong>Kết quả sau 18 năm gia nhập (2007-2025):</strong> Sau 18 năm gia nhập WTO, Việt Nam đã đạt được nhiều thành tựu to lớn. Từ một nước nghèo, lạc hậu, Việt Nam đã trở thành nước có thu nhập trung bình, nền kinh tế năng động, hội nhập sâu rộng vào thế giới. Đời sống nhân dân được cải thiện rõ rệt. Việt Nam đang phấn đấu trở thành nước công nghiệp hiện đại vào năm 2030, nước phát triển có thu nhập cao vào năm 2045.

<strong>Ý nghĩa lịch sử:</strong> Việc gia nhập WTO là một trong những quyết sách chiến lược đúng đắn nhất của Đảng và Nhà nước. Đây là bước ngoặt quan trọng, giúp Việt Nam hội nhập toàn diện vào nền kinh tế thế giới, thúc đẩy phát triển mạnh mẽ, nâng cao đời sống nhân dân, củng cố vị thế quốc tế.`,
            significance: 'Hội nhập toàn diện vào nền kinh tế thế giới. Thúc đẩy tăng trưởng kinh tế mạnh mẽ, xuất khẩu và FDI tăng kỷ lục. Cải cách thể chế, pháp luật, nâng cao năng lực cạnh tranh. Cải thiện đời sống nhân dân. Nâng cao vị thế quốc tế. Là một trong những quyết sách chiến lược đúng đắn nhất.',
            relatedFigures: ['Nguyễn Tấn Dũng', 'Nguyễn Minh Triết', 'Vũ Khoan', 'Lương Văn Tự'],
            location: 'Geneva, Thụy Sĩ'
        },
        {
            year: '2020',
            name: 'Việt Nam chống dịch COVID-19 thành công',
            type: 'battle',
            icon: '🏥',
            period: 'contemporary',
            description: 'Việt Nam được quốc tế ghi nhận là một trong những nước chống dịch COVID-19 hiệu quả nhất.',
            details: `<strong>Đại dịch COVID-19 bùng phát:</strong> Cuối năm 2019, dịch bệnh COVID-19 (do virus SARS-CoV-2 gây ra) bùng phát tại Vũ Hán, Trung Quốc, sau đó lan rộng ra toàn thế giới. Tháng 3/2020, WHO (Tổ chức Y tế Thế giới) tuyên bố COVID-19 là đại dịch toàn cầu. Đến năm 2025, COVID-19 đã gây ra hàng triệu ca tử vong trên toàn thế giới, ảnh hưởng nghiêm trọng đến kinh tế, xã hội, đời sống của hàng tỷ người.

<strong>Ca bệnh đầu tiên tại Việt Nam (23/1/2020):</strong> Ngày 23/1/2020, Việt Nam ghi nhận 2 ca nhiễm COVID-19 đầu tiên (cha và con người Trung Quốc ở tại TP. Hồ Chí Minh). Đây là tín hiệu báo động đỏ. Chính phủ và ngành y tế Việt Nam ngay lập tức triển khai các biện pháp khẩn cấp để ngăn chặn dịch bệnh lây lan.

<strong>Phương châm "Chống dịch như chống giặc":</strong> Lãnh đạo Đảng và Nhà nước đặt ra phương châm <em>"Chống dịch như chống giặc"</em>, coi đây là cuộc chiến bảo vệ sức khỏe, tính mạng của nhân dân. Thủ tướng Nguyễn Xuân Phúc khẳng định: <em>"Chống dịch là nhiệm vụ chính trị quan trọng hàng đầu. Sức khỏe của nhân dân là trên hết, trước hết."</em>

<strong>Các biện pháp quyết liệt và kịp thời:</strong> Việt Nam áp dụng nhiều biện pháp mạnh mẽ, quyết liệt từ rất sớm (khi số ca bệnh còn rất ít):

<em>1. Phong tỏa, cách ly:</em>
- Ngay từ tháng 2/2020, Việt Nam phong tỏa xã Sơn Lôi (Vĩnh Phúc) - nơi có ổ dịch đầu tiên, cách ly hơn 10.000 người. Đây là quyết định táo bạo, ít nước làm được.
- Tháng 3-4/2020, thực hiện giãn cách xã hội toàn quốc (người dân ở nhà, đóng cửa các dịch vụ không thiết yếu).
- Cách ly tập trung tất cả người từ nước ngoài về.
- Truy vết chặt chẽ, cách ly F0, F1, F2... để ngăn chặn lây nhiễm cộng đồng.

<em>2. Đóng cửa biên giới, hạn chế nhập cảnh:</em>
- Việt Nam là một trong những nước đầu tiên đóng cửa biên giới với Trung Quốc (cuối tháng 1/2020), sau đó mở rộng với các nước khác.
- Dừng cấp thị thực, hạn chế người nước ngoài nhập cảnh.
- Dừng các chuyến bay quốc tế (chỉ giữ lại chuyến bay cứu trợ, đưa người Việt về nước).

<em>3. Kiểm tra y tế nghiêm ngặt:</em>
- Đo thân nhiệt tại sân bay, ga, bến, cửa khẩu.
- Khai báo y tế bắt buộc (qua app điện tử, tờ khai giấy).
- Xét nghiệm PCR miễn phí cho người nghi nhiễm.

<em>4. Tuyên truyền, nâng cao ý thức:</em>
- Tuyên truyền rộng rãi trên truyền hình, báo chí, mạng xã hội về cách phòng chống dịch.
- Khẩu hiệu 5K: Khẩu trang, Khử khuẩn, Khoảng cách, Không tụ tập, Khai báo y tế.
- Nghệ sĩ, ca sĩ tham gia sáng tác ca khúc, video tuyên truyền chống dịch (như "Ghen Cô Vy" - bản nhảy rửa tay lan tỏa toàn cầu).

<em>5. Huy động sức mạnh toàn dân:</em>
- Lực lượng y tế, quân đội, công an, dân quân tự vệ, tình nguyện viên... cùng tham gia chống dịch.
- Nhân dân tự giác ở nhà, đeo khẩu trang, thực hiện giãn cách xã hội.
- Doanh nghiệp, cá nhân ủng hộ trang thiết bị, kinh phí chống dịch.

<em>6. Hỗ trợ kinh tế - xã hội:</em>
- Chính phủ hỗ trợ người lao động mất việc làm, giảm thu nhập do dịch.
- Miễn, giảm thuế, hỗ trợ doanh nghiệp vượt khó.
- Phát gạo, tiền mặt cho người nghèo, người khó khăn.

<strong>Kết quả trong năm 2020:</strong> Đến cuối năm 2020, Việt Nam đã kiểm soát tốt dịch bệnh:
- Tổng số ca nhiễm: Khoảng 1.400 ca (rất thấp so với dân số gần 100 triệu)
- Tử vong: 35 ca (trong đó đa số là người già, có bệnh nền)
- Nhiều đợt dịch bùng phát nhưng đều được dập tắt nhanh chóng
- Kinh tế vẫn tăng trưởng dương (2,9%), trong khi nhiều nước tăng trưởng âm

<strong>Thế giới ghi nhận và ca ngợi:</strong> Việt Nam được quốc tế ca ngợi là một trong những nước chống dịch COVID-19 thành công nhất thế giới:
- <em>Bloomberg:</em> Xếp Việt Nam trong top nước chống dịch tốt nhất.
- <em>CNN, BBC, The Guardian:</em> Đưa tin ca ngợi mô hình chống dịch Việt Nam.
- <em>WHO:</em> Ghi nhận Việt Nam là hình mẫu chống dịch.
- <em>Các nước:</em> Nhiều nước học hỏi kinh nghiệm chống dịch từ Việt Nam.

<strong>Làn sóng dịch lớn (2021-2022):</strong> Từ tháng 4/2021, biến thể Delta xuất hiện, dịch bùng phát mạnh ở TP. Hồ Chí Minh và các tỉnh miền Nam. Đây là đợt dịch lớn nhất, số ca nhiễm tăng nhanh, hệ thống y tế quá tải. Tuy nhiên, với sự nỗ lực của toàn Đảng, toàn dân, Việt Nam đã vượt qua giai đoạn khó khăn nhất. Đến cuối năm 2021, Việt Nam bắt đầu chiến lược "Thích ứng an toàn, linh hoạt, kiểm soát hiệu quả dịch COVID-19", từng bước mở cửa trở lại hoạt động kinh tế, xã hội.

<strong>Tiêm chủng vaccine (2021-2023):</strong> Việt Nam triển khai chiến dịch tiêm chủng vaccine COVID-19 lớn nhất lịch sử. Đến năm 2023, hơn 90% dân số đã tiêm đủ liều cơ bản, giúp giảm tỷ lệ ca nặng, tử vong, dần kiểm soát dịch bệnh.

<strong>Ý nghĩa và bài học:</strong>
- <em>Sức mạnh của hệ thống chính trị:</em> Sự lãnh đạo quyết đoán của Đảng, sự điều hành linh hoạt của Chính phủ, sự phối hợp đồng bộ của các cấp, các ngành.
- <em>Tinh thần đại đoàn kết dân tộc:</em> "Chống dịch như chống giặc" - tinh thần này một lần nữa được phát huy. Mọi người dân, dù ở đâu, làm nghề gì, đều chung tay chống dịch.
- <em>Vai trò của lực lượng tuyến đầu:</em> Y bác sĩ, quân đội, công an, tình nguyện viên... đã hy sinh, cống hiến hết mình. Nhiều y bác sĩ hy sinh trong cuộc chiến chống dịch.
- <em>Ứng dụng công nghệ:</em> Việt Nam sử dụng công nghệ (app khai báo y tế, truy vết F0, F1...) rất hiệu quả.
- <em>Bài học về chuẩn bị, phòng ngừa:</em> Dịch bệnh có thể xuất hiện bất cứ lúc nào, cần luôn chuẩn bị sẵn sàng.

<strong>Di sản:</strong> Cuộc chiến chống COVID-19 là một trong những sự kiện lớn nhất thế kỷ 21. Việt Nam đã thể hiện được năng lực tổ chức, tinh thần đoàn kết, ý chí quyết tâm bảo vệ sức khỏe nhân dân. Những bài học kinh nghiệm, tinh thần chống dịch sẽ là di sản quý báu cho các thế hệ sau. Việt Nam một lần nữa khẳng định: Dù có khó khăn, thử thách nào, dân tộc ta cũng vượt qua và chiến thắng.`,
            significance: 'Khẳng định năng lực tổ chức, sức mạnh của hệ thống chính trị, tinh thần đại đoàn kết dân tộc. Bảo vệ thành công sức khỏe, tính mạng của nhân dân. Được quốc tế ghi nhận là hình mẫu chống dịch. Tinh thần "chống dịch như chống giặc" một lần nữa được phát huy, thể hiện ý chí vượt qua mọi khó khăn của dân tộc Việt Nam.',
            relatedFigures: ['Nguyễn Xuân Phúc', 'Nguyễn Phú Trọng', 'Nguyễn Thanh Long', 'Vũ Đức Đam'],
            location: 'Toàn quốc'
        }
    ];
}

// ==================== FILTER EVENTS ====================
function filterEvents() {
    if (currentPeriod === 'all') {
        filteredEvents = [...timelineEvents];
    } else {
        filteredEvents = timelineEvents.filter(event => event.period === currentPeriod);
    }

    console.log(`🔍 Filtering by period: ${currentPeriod}, found ${filteredEvents.length} events`);
    displayTimeline();
    updateMinimap();
}

// ==================== DISPLAY TIMELINE ====================
function displayTimeline() {
    // Remove only event markers, keep timeline line and glow
    const existingMarkers = timelineEventsContainer.querySelectorAll('.event-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Sort events by year - handle BCE (TCN) years
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const yearA = parseYear(a.year);
        const yearB = parseYear(b.year);
        return yearA - yearB;
    });

    // Debug: log sorted order
    console.log('📅 Timeline sorted order:');
    sortedEvents.forEach((event, i) => {
        console.log(`${i + 1}. ${event.year} - ${event.name} (parsed: ${parseYear(event.year)})`);
    });

    sortedEvents.forEach((event, index) => {
        const eventMarker = createEventMarker(event, index);
        timelineEventsContainer.appendChild(eventMarker);
    });

    // Update timeline line width to span all events
    setTimeout(() => {
        const timelineLine = timelineEventsContainer.querySelector('.timeline-line');
        const timelineLineGlow = timelineEventsContainer.querySelector('.timeline-line-glow');
        if (timelineLine && timelineLineGlow) {
            const containerWidth = timelineEventsContainer.scrollWidth;
            timelineLine.style.width = containerWidth + 'px';
            timelineLineGlow.style.width = containerWidth + 'px';
        }
        updateMinimap();
    }, 100);
}

// Parse year handling BCE (TCN - Trước Công Nguyên)
function parseYear(yearStr) {
    const isBCE = yearStr.includes('TCN');
    const yearNum = parseInt(yearStr.replace(/[^\d]/g, ''));
    // BCE years are negative for proper sorting
    return isBCE ? -yearNum : yearNum;
}

// ==================== CREATE EVENT MARKER ====================
function createEventMarker(event, index) {
    const marker = document.createElement('div');
    marker.className = `event-marker ${event.type}`;
    marker.dataset.period = event.period;
    marker.dataset.eventData = JSON.stringify(event);
    marker.dataset.index = index;

    marker.innerHTML = `
        <div class="event-label">
            <div class="event-year">${escapeHtml(event.year)}</div>
            <div class="event-name">${escapeHtml(event.name)}</div>
        </div>
        <div class="event-dot"></div>
        <div class="event-icon">${event.icon}</div>
    `;

    marker.addEventListener('click', () => {
        currentEventIndex = index;
        marker.classList.add('selected');
        if (selectedEventMarker && selectedEventMarker !== marker) {
            selectedEventMarker.classList.remove('selected');
        }
        selectedEventMarker = marker;
        showEventModal(event);
    });

    return marker;
}

// ==================== FILTER EVENTS ====================
function filterEvents() {
    const markers = document.querySelectorAll('.event-marker');

    filteredEvents = timelineEvents.filter(event => {
        if (currentPeriod === 'all') return true;
        return event.period === currentPeriod;
    });

    markers.forEach(marker => {
        const period = marker.dataset.period;
        if (currentPeriod === 'all' || period === currentPeriod) {
            marker.style.display = 'block';
            marker.classList.remove('filtered-out');
        } else {
            marker.style.display = 'none';
            marker.classList.add('filtered-out');
        }
    });

    updateMinimap();
}

// ==================== SEARCH FUNCTIONALITY ====================
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
        searchResults.classList.remove('active');
        searchOverlay.classList.remove('active');
        return;
    }

    const results = timelineEvents.filter(event => {
        return event.name.toLowerCase().includes(query) ||
               event.year.toLowerCase().includes(query) ||
               event.description.toLowerCase().includes(query) ||
               (event.relatedFigures && event.relatedFigures.some(fig => fig.toLowerCase().includes(query)));
    });

    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-gray);">Không tìm thấy kết quả</div>';
        searchResults.classList.add('active');
        searchOverlay.classList.add('active');
        return;
    }

    searchResults.innerHTML = results.map(event => {
        const highlightedName = highlightMatch(event.name, query);
        const highlightedYear = highlightMatch(event.year, query);

        return `
            <div class="search-result-item" data-event='${JSON.stringify(event).replace(/'/g, "&#39;")}'>
                <div class="search-result-year">${highlightedYear} ${event.icon}</div>
                <div class="search-result-name">${highlightedName}</div>
            </div>
        `;
    }).join('');

    searchResults.classList.add('active');
    searchOverlay.classList.add('active');

    // Add click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const event = JSON.parse(this.dataset.event);
            searchResults.classList.remove('active');
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            jumpToEvent(event);
        });
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<span class="search-result-match">$1</span>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== ZOOM FUNCTIONALITY ====================
function changeZoom(delta) {
    currentZoomLevel = Math.max(50, Math.min(150, currentZoomLevel + delta));
    applyZoom();
}

function resetZoom() {
    currentZoomLevel = 100;
    applyZoom();
}

function applyZoom() {
    // Remove all zoom classes
    timelineScroll.className = timelineScroll.className.replace(/zoom-\d+/g, '').trim();

    // Add new zoom class
    timelineScroll.classList.add(`zoom-${currentZoomLevel}`);

    // Update minimap
    updateMinimap();
}

// ==================== VIEW TOGGLE ====================
let isCompactView = false;

function toggleView() {
    isCompactView = !isCompactView;
    const markers = document.querySelectorAll('.event-marker');

    markers.forEach(marker => {
        if (isCompactView) {
            marker.style.margin = '0 50px';
        } else {
            marker.style.margin = '0 100px';
        }
    });

    setTimeout(() => updateMinimap(), 100);
}

// ==================== YEAR JUMP ====================
function jumpToYear() {
    const year = yearInput.value.trim();
    if (!year) return;

    const event = timelineEvents.find(e => e.year.includes(year));

    if (event) {
        jumpToEvent(event);
        yearInput.value = '';
    } else {
        if (window.showNotification) {
            showNotification('Không tìm thấy sự kiện trong năm ' + year, 'warning');
        }
    }
}

function jumpToEvent(event) {
    const markers = document.querySelectorAll('.event-marker');
    let targetMarker = null;

    markers.forEach(marker => {
        const markerData = JSON.parse(marker.dataset.eventData);
        if (markerData.year === event.year && markerData.name === event.name) {
            targetMarker = marker;
        }
    });

    if (targetMarker) {
        // Scroll to marker
        const markerLeft = targetMarker.offsetLeft;
        const containerWidth = timelineScroll.clientWidth;
        timelineScroll.scrollLeft = markerLeft - (containerWidth / 2);

        // Highlight marker
        targetMarker.classList.add('selected');
        if (selectedEventMarker && selectedEventMarker !== targetMarker) {
            selectedEventMarker.classList.remove('selected');
        }
        selectedEventMarker = targetMarker;

        // Show event
        setTimeout(() => showEventModal(event), 300);
    }
}

// ==================== SCROLL TIMELINE ====================
function scrollTimeline(amount) {
    timelineScroll.scrollBy({ left: amount, behavior: 'smooth' });
}

// ==================== UPDATE SCROLL INDICATORS ====================
function updateScrollIndicators() {
    const scrollLeft = timelineScroll.scrollLeft;
    const scrollWidth = timelineScroll.scrollWidth - timelineScroll.clientWidth;
    const scrollPercent = (scrollLeft / scrollWidth) * 100;

    // Update progress bar
    progressFill.style.width = scrollPercent + '%';

    // Update progress indicator
    const indicatorPos = (scrollPercent / 100) * (timelineScroll.clientWidth - 100);
    progressIndicator.style.left = indicatorPos + 'px';

    // Find nearest event
    const markers = document.querySelectorAll('.event-marker:not(.filtered-out)');
    let nearestMarker = null;
    let minDistance = Infinity;

    markers.forEach(marker => {
        const markerLeft = marker.offsetLeft;
        const distance = Math.abs(markerLeft - scrollLeft - (timelineScroll.clientWidth / 2));
        if (distance < minDistance) {
            minDistance = distance;
            nearestMarker = marker;
        }
    });

    if (nearestMarker) {
        const eventData = JSON.parse(nearestMarker.dataset.eventData);
        progressIndicator.querySelector('.progress-year').textContent = eventData.year;
    }

    // Update minimap viewport
    updateMinimapViewport();
}

// ==================== MINIMAP ====================
function initMinimap() {
    if (!minimapCanvas) return;

    // Canvas will be updated when events are loaded
    updateMinimap();
}

function updateMinimap() {
    if (!minimapCanvas) return;

    const ctx = minimapCanvas.getContext('2d');
    const width = minimapCanvas.width;
    const height = minimapCanvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Get visible events
    const visibleMarkers = document.querySelectorAll('.event-marker:not(.filtered-out)');
    if (visibleMarkers.length === 0) return;

    // Calculate positions
    const markerWidth = 6;
    const spacing = width / visibleMarkers.length;

    visibleMarkers.forEach((marker, index) => {
        const eventData = JSON.parse(marker.dataset.eventData);
        const x = spacing * index + spacing / 2;

        // Get color based on type
        let color;
        switch (eventData.type) {
            case 'battle':
                color = '#ef4444';
                break;
            case 'founding':
                color = '#FFD700';
                break;
            case 'revolution':
                color = '#f97316';
                break;
            case 'independence':
                color = '#fbbf24';
                break;
            default:
                color = '#00E0FF';
        }

        // Draw marker
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, height / 2, markerWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    updateMinimapViewport();
}

function updateMinimapViewport() {
    if (!minimapViewport || !minimapCanvas) return;

    const scrollLeft = timelineScroll.scrollLeft;
    const scrollWidth = timelineScroll.scrollWidth;
    const clientWidth = timelineScroll.clientWidth;

    const viewportWidth = (clientWidth / scrollWidth) * 100;
    const viewportLeft = (scrollLeft / scrollWidth) * 100;

    minimapViewport.style.width = viewportWidth + '%';
    minimapViewport.style.left = viewportLeft + '%';
}

// ==================== PARTICLES ====================
function initParticles() {
    if (!particlesContainer) return;

    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        createParticle(i);
    }
}

function createParticle(index) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.background = Math.random() > 0.5 ? 'var(--gold)' : 'var(--electric-blue)';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px currentColor';
    particle.style.pointerEvents = 'none';

    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    // Random animation delay
    particle.style.animationDelay = (index * 0.5) + 's';

    particlesContainer.appendChild(particle);

    // Animate particle
    animateParticle(particle);
}

function animateParticle(particle) {
    const duration = 15000 + Math.random() * 10000;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const endX = Math.random() * window.innerWidth;
    const endY = -100;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.opacity = '0';

    particle.animate([
        {
            left: startX + 'px',
            top: startY + 'px',
            opacity: 0
        },
        {
            opacity: 1,
            offset: 0.1
        },
        {
            opacity: 1,
            offset: 0.9
        },
        {
            left: endX + 'px',
            top: endY + 'px',
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => {
        animateParticle(particle);
    };
}

// ==================== SHOW EVENT MODAL ====================
function showEventModal(event) {
    // Close search results when opening modal
    searchResults.classList.remove('active');
    searchOverlay.classList.remove('active');
    searchInput.value = '';

    const relatedFiguresHtml = event.relatedFigures
        ? `<p><strong>🎭 Nhân vật liên quan:</strong> ${event.relatedFigures.join(', ')}</p>`
        : '';

    const locationHtml = event.location
        ? `<p><strong>📍 Địa điểm:</strong> ${event.location}</p>`
        : '';

    const significanceHtml = event.significance
        ? `<p><strong>⭐ Ý nghĩa lịch sử:</strong> ${event.significance}</p>`
        : '';

    modalBody.innerHTML = `
        <div class="modal-event-header">
            <div class="modal-event-icon">${event.icon}</div>
            <div class="modal-event-year">${escapeHtml(event.year)}</div>
            <h2 class="modal-event-name">${escapeHtml(event.name)}</h2>
        </div>

        <div class="modal-event-description">
            <p>${escapeHtml(event.description)}</p>
        </div>

        ${event.details ? `
            <div class="modal-event-details">
                <h3>📚 Chi tiết lịch sử</h3>
                <div class="details-content">${event.details}</div>
                <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid rgba(255, 215, 0, 0.2);">
                ${significanceHtml}
                ${locationHtml}
                ${relatedFiguresHtml}
            </div>
        ` : ''}

        <div class="modal-actions">
            <a href="chatbot.html" class="btn btn-gold">💬 Trò chuyện với nhân vật</a>
            <a href="map.html" class="btn btn-secondary">🗺️ Xem trên bản đồ</a>
        </div>
    `;

    // Update navigation buttons
    updateModalNavigation();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add XP for exploring event
    if (window.UserData && window.UserData.exploreEvent) {
        UserData.exploreEvent(event.name);
    }
}

// ==================== MODAL NAVIGATION ====================
function updateModalNavigation() {
    const visibleMarkers = Array.from(document.querySelectorAll('.event-marker:not(.filtered-out)'));
    const currentIndex = visibleMarkers.findIndex(m => m === selectedEventMarker);

    prevEventBtn.disabled = currentIndex <= 0;
    nextEventBtn.disabled = currentIndex >= visibleMarkers.length - 1;
}

function showPreviousEvent() {
    const visibleMarkers = Array.from(document.querySelectorAll('.event-marker:not(.filtered-out)'));
    const currentIndex = visibleMarkers.findIndex(m => m === selectedEventMarker);

    if (currentIndex > 0) {
        const prevMarker = visibleMarkers[currentIndex - 1];
        selectedEventMarker = prevMarker;
        const eventData = JSON.parse(prevMarker.dataset.eventData);
        showEventModal(eventData);
    }
}

function showNextEvent() {
    const visibleMarkers = Array.from(document.querySelectorAll('.event-marker:not(.filtered-out)'));
    const currentIndex = visibleMarkers.findIndex(m => m === selectedEventMarker);

    if (currentIndex < visibleMarkers.length - 1) {
        const nextMarker = visibleMarkers[currentIndex + 1];
        selectedEventMarker = nextMarker;
        const eventData = JSON.parse(nextMarker.dataset.eventData);
        showEventModal(eventData);
    }
}

// ==================== CLOSE MODAL ====================
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== CONSOLE LOG ====================
console.log('✨ Timeline Enhanced - Ready!');
