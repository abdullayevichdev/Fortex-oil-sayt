import { Order, Booking, Review } from '../types';

// SIZNING BOT TOKENINGIZ
const BOT_TOKEN = '7854422433:AAGpX1AjPOYDChjfIUV3bC3J6IX_ZDaArm4';

// DIQQAT: BU YERGA TELEGRAM ID RAQAMLARINI YOZING
// Xabar shu 3 ta ID ga boradi
const CHAT_IDS = ['5940982588', '7032656', '6464089189'];

// HTML maxsus belgilarini xavfsiz qilish (parse_mode: HTML xatolarini oldini oladi)
const escapeHtml = (unsafe: string) => {
  return String(unsafe ?? '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export const sendOrderToTelegram = async (order: Order) => {
  if (!CHAT_IDS || CHAT_IDS.length === 0) {
    console.error("Telegram CHAT_IDS kiritilmagan! services/telegram.ts faylini tekshiring.");
    return;
  }

  // 1. Umumiy buyurtma ma'lumotlari (Matn)
  let message = `🆕 <b>YANGI BUYURTMA</b>\n`;
  message += `🆔 ID: #${order.id}\n`;
  message += `📅 Sana: ${new Date(order.date).toLocaleString()}\n\n`;

  message += `👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}\n`;
  message += `📞 <b>Tel:</b> ${escapeHtml(order.phone)}\n`;
  message += `💳 <b>To'lov turi:</b> ${order.paymentMethod === 'card' ? 'Karta (Click/Payme)' : 'Naqd pul'}\n\n`;

  message += `🛒 <b>Mahsulotlar:</b>\n`;
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${escapeHtml(item.product.name)} (${escapeHtml(item.selectedLiter)}) x ${item.quantity} ta\n`;
  });

  message += `\n💰 <b>JAMI: ${order.totalAmount.toLocaleString()} UZS</b>`;

  try {
    // Har bir admin ID uchun sikl (loop)
    for (const chatId of CHAT_IDS) {
      // 1-qadam: Asosiy chek matnini yuborish
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      // 2-qadam: Har bir mahsulot rasmini alohida yuborish
      for (const item of order.items) {
        const caption = `<b>${escapeHtml(item.product.name)}</b>\n` +
          `Hajm: ${escapeHtml(item.selectedLiter)}\n` +
          `Soni: ${item.quantity} ta\n` +
          `Narx: ${(item.selectedPrice * item.quantity).toLocaleString()} UZS`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: item.product.image_url,
            caption: caption,
            parse_mode: 'HTML'
          })
        });
      }
    }

  } catch (error) {
    console.error("Telegramga yuborishda xatolik:", error);
    // Xatolik bo'lsa ham foydalanuvchiga buyurtma ketdi deb ko'rsatilaveradi, 
    // chunki bu orqa fonda ishlaydi.
  }
};

export const sendBookingToTelegram = async (booking: Booking) => {
  if (!CHAT_IDS || CHAT_IDS.length === 0) return;

  const serviceNames: Record<string, string> = {
    'oil_change': 'Moy Almashtirish',
    'filter_replace': 'Filtrlarni Almashtirish',
    'diagnostics': 'Diagnostika'
  };

  let message = `📝 <b>YANGI QABUL (BOOKING)</b>\n\n`;
  message += `👤 <b>Mijoz:</b> ${escapeHtml(booking.name)}\n`;
  message += `📞 <b>Tel:</b> ${escapeHtml(booking.phone)}\n`;
  message += `🚘 <b>Avto:</b> ${escapeHtml(booking.carModel)}\n`;
  message += `🛠 <b>Xizmat:</b> ${escapeHtml(serviceNames[booking.serviceType] || booking.serviceType)}\n`;
  message += `📅 <b>Vaqt:</b> ${new Date(booking.date).toLocaleString()}\n`;

  try {
    for (const chatId of CHAT_IDS) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
    }
  } catch (error) {
    console.error("Booking telegramga yuborilmadi:", error);
  }
};

export const sendReviewToTelegram = async (review: Review, productName: string) => {
  if (!CHAT_IDS || CHAT_IDS.length === 0) return;

  let message = `⭐ <b>YANGI IZOH (REVIEW)</b>\n\n`;
  message += `📦 <b>Mahsulot:</b> ${escapeHtml(productName)}\n`;
  message += `👤 <b>Mijoz:</b> ${escapeHtml(review.userName)}\n`;
  message += `⭐️ <b>Baho:</b> ${'⭐️'.repeat(review.rating)}\n`;
  message += `💬 <b>Izoh:</b> ${escapeHtml(review.comment)}\n`;
  message += `📅 <b>Sana:</b> ${new Date(review.date).toLocaleString()}`;

  console.log("Telegramga yuborilayotgan xabar:", message);

  try {
    for (const chatId of CHAT_IDS) {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      if (!data.ok) {
        console.error("Telegram API Error:", data);
        alert(`Telegram Xatosi (${data.error_code}): ${data.description}`);
      } else {
        console.log("Telegramga muvaffaqiyatli yuborildi:", chatId);
      }
    }
  } catch (error: any) {
    console.error("Izoh telegramga yuborilmadi:", error);
    alert(`Xatolik: ${error.message}`);
    throw error;
  }
};