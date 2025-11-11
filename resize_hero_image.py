#!/usr/bin/env python3
"""
Script để resize ảnh hero từ 1:1 (768x768) sang 16:9 (1920x1080)
với background hologram xanh mở rộng hai bên.

Yêu cầu: pip install Pillow
"""

from PIL import Image, ImageFilter, ImageDraw
import os

def create_hero_banner(input_path, output_path, target_size=(1920, 1080)):
    """
    Tạo hero banner 16:9 từ ảnh vuông 1:1

    Args:
        input_path: Đường dẫn ảnh gốc
        output_path: Đường dẫn ảnh output
        target_size: Kích thước mục tiêu (width, height)
    """

    print(f"🎨 Đang xử lý ảnh: {input_path}")

    # Mở ảnh gốc
    img = Image.open(input_path).convert('RGBA')
    original_width, original_height = img.size
    print(f"   Kích thước gốc: {original_width}x{original_height}")

    # Tạo canvas mới với kích thước target
    target_width, target_height = target_size
    canvas = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))

    # Tính toán vị trí để paste ảnh gốc vào giữa
    # Giữ tỷ lệ ảnh gốc, scale để fit chiều cao
    scale_factor = target_height / original_height * 0.85  # 85% chiều cao
    new_width = int(original_width * scale_factor)
    new_height = int(original_height * scale_factor)

    # Resize ảnh gốc
    img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Vị trí paste (giữa canvas)
    paste_x = (target_width - new_width) // 2
    paste_y = (target_height - new_height) // 2

    # Tạo background hologram gradient
    print("   ✨ Tạo background hologram xanh...")

    # Layer 1: Gradient xanh neon bên trái
    gradient_left = Image.new('RGBA', (target_width // 2, target_height), (0, 0, 0, 0))
    draw_left = ImageDraw.Draw(gradient_left)
    for x in range(target_width // 2):
        # Gradient từ xanh neon sang trong suốt
        alpha = int(100 * (1 - x / (target_width // 2)))  # 100 -> 0
        color = (0, 224, 255, alpha)  # Cyan hologram
        draw_left.line([(x, 0), (x, target_height)], fill=color)

    # Layer 2: Gradient vàng bên phải
    gradient_right = Image.new('RGBA', (target_width // 2, target_height), (0, 0, 0, 0))
    draw_right = ImageDraw.Draw(gradient_right)
    for x in range(target_width // 2):
        alpha = int(80 * (x / (target_width // 2)))  # 0 -> 80
        color = (255, 215, 0, alpha)  # Gold
        draw_right.line([(x, 0), (x, target_height)], fill=color)

    # Paste gradient vào canvas
    canvas.paste(gradient_left, (0, 0), gradient_left)
    canvas.paste(gradient_right, (target_width // 2, 0), gradient_right)

    # Blur gradient để mượt hơn
    canvas = canvas.filter(ImageFilter.GaussianBlur(radius=100))

    # Paste ảnh chính vào giữa
    print(f"   📐 Paste ảnh vào vị trí: ({paste_x}, {paste_y})")
    canvas.paste(img_resized, (paste_x, paste_y), img_resized)

    # Convert sang RGB để export
    final_image = Image.new('RGB', (target_width, target_height), (11, 15, 25))  # Background đen xanh
    final_image.paste(canvas, (0, 0), canvas)

    # Lưu file
    print(f"   💾 Lưu file: {output_path}")

    # Xuất .webp (tối ưu web)
    webp_path = output_path.replace('.png', '.webp')
    final_image.save(webp_path, 'WEBP', quality=85, method=6)
    print(f"   ✅ WebP saved: {webp_path} (size: {os.path.getsize(webp_path) / 1024:.1f} KB)")

    # Cũng lưu .png để backup
    final_image.save(output_path, 'PNG', optimize=True)
    print(f"   ✅ PNG saved: {output_path} (size: {os.path.getsize(output_path) / 1024:.1f} KB)")

    print("✨ Hoàn thành!")
    return webp_path, output_path


if __name__ == "__main__":
    # Đường dẫn file
    input_image = "Gemini_Generated_Image_6bsx846bsx846bsx.png"
    output_image_png = "frontend/hero-character-16-9.png"
    output_image_webp = "frontend/hero-character-16-9.webp"

    # Kiểm tra file input tồn tại
    if not os.path.exists(input_image):
        print(f"❌ Không tìm thấy file: {input_image}")
        print("   Vui lòng đặt ảnh gốc trong cùng thư mục với script này.")
        exit(1)

    # Tạo thư mục output nếu chưa có
    os.makedirs("frontend", exist_ok=True)

    print("=" * 60)
    print("🎨 HERO IMAGE RESIZER - 1:1 → 16:9")
    print("=" * 60)

    # Xử lý ảnh
    webp_path, png_path = create_hero_banner(
        input_image,
        output_image_png,
        target_size=(1920, 1080)
    )

    print("\n" + "=" * 60)
    print("🎉 XỬ LÝ HOÀN TẤT!")
    print("=" * 60)
    print(f"\n📁 File output:")
    print(f"   • WebP (recommend): {webp_path}")
    print(f"   • PNG (backup):     {png_path}")
    print(f"\n💡 Cập nhật HTML:")
    print(f'   <img src="{os.path.basename(webp_path)}" alt="Hero" />')
    print("\n🚀 Giờ bạn có thể sử dụng ảnh mới trong website!")
