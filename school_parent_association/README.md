# Okul Aile Birliği Yönetimi (`school_parent_association`)

Türkiye'deki anaokulu, ilkokul ve lise seviyesindeki kurumların **Okul Aile Birliği** süreçlerini yönetmek için geliştirilmiş Odoo 18 modülüdür.

## Özellikler
- Kurumsal yapı, dönem ve kurul yönetimi
- Toplantı, gündem ve karar kayıtları
- Bağış ve gider iş akışları
- İhtiyaç talebinden gidere dönüşüm
- Etkinlik ve duyuru yönetimi
- Denetim notları ve TEFBİS dışa aktarım yardımcısı
- QWeb PDF raporları
- Roller, erişim hakları, kayıt kuralları

## Kurulum
1. Modülü Odoo addons yoluna ekleyin.
2. Uygulamalar listesini güncelleyin.
3. `Okul Aile Birliği Yönetimi` modülünü kurun.
4. Kullanıcıları uygun güvenlik gruplarına atayın.

## Kullanım Önerisi
1. Önce **Okul**, **Akademik Yıl** ve **Birlik Dönemi** tanımlayın.
2. Kurul üyelerini ve rollerini girin.
3. Toplantı ve karar süreçlerini işletin.
4. Mali işlemlerde bağış/gider akışlarını kullanın.
5. İhtiyaç taleplerini inceleyip uygun olanları gidere dönüştürün.
6. Raporlar menüsünden çıktı alın.

## Notlar
- Demo veri içermez.
- Toplantı, karar, bağış ve gider için otomatik sıra numarası kullanır.
- Cron görevleri ile duyuru arşivleme, denetim takibi ve dönem bitiş uyarıları sağlanır.
