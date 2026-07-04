export default function GizlilikPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Gizlilik Politikası</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Temmuz 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">1. Veri Sorumlusu</h2>
          <p>
            Bu politika, Visuimo hizmetini sunan şirkete aittir.<br />
            Şirket: <strong>Visuimo</strong><br />
            E-posta: <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">2. Toplanan Veriler</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Hesap açarken verdiğiniz e-posta adresi ve şifre</li>
            <li>Yüklediğiniz mülk fotoğrafları ve üretilen görseller</li>
            <li>Servis kullanımına ait teknik log verileri (IP adresi, tarayıcı bilgisi)</li>
            <li>Abonelik ve ödeme bilgileri (Stripe aracılığıyla işlenir; kart numarası Visuimo sunucularında saklanmaz)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">3. Verilerin Kullanım Amacı</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Hesabınızı oluşturmak ve yönetmek</li>
            <li>Fotoğraf iyileştirme, sanal staging ve video üretim hizmetlerini sunmak</li>
            <li>Abonelik ve faturalandırma işlemlerini gerçekleştirmek</li>
            <li>Güvenlik ve hizmet kalitesini sağlamak</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">4. Veri Paylaşımı</h2>
          <p>
            Verileriniz üçüncü taraflarla yalnızca hizmetin işleyişi için gerekli olduğunda paylaşılır:
          </p>
          <ul className="list-disc space-y-1 pl-5 mt-2">
            <li><strong>Veritabanı altyapısı</strong> — hesap ve görsel verilerini güvenli biçimde saklar</li>
            <li><strong>Görsel işleme sağlayıcısı</strong> — iyileştirme ve sanal staging işlemleri için yüklenen fotoğrafları işler</li>
            <li><strong>Video üretim sağlayıcısı</strong> — tanıtım videosu oluşturmak için görselleri işler</li>
            <li><strong>Stripe</strong> — ödeme işlemleri (kart numarası Visuimo sunucularında saklanmaz)</li>
          </ul>
          <p className="mt-2">Bu sağlayıcılar kendi gizlilik politikalarına tabidir. Verileriniz pazarlama amaçlı üçüncü taraflarla paylaşılmaz.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">5. Haklarınız (RGPD)</h2>
          <p>Avrupa Genel Veri Koruma Tüzüğü (RGPD) kapsamında şu haklara sahipsiniz:</p>
          <ul className="list-disc space-y-1 pl-5 mt-2">
            <li>Verilerinize erişim hakkı</li>
            <li>Yanlış verilerin düzeltilmesini talep etme hakkı</li>
            <li>Verilerinizin silinmesini talep etme hakkı (&quot;unutulma hakkı&quot;)</li>
            <li>İşleme itiraz etme hakkı</li>
            <li>Veri taşınabilirliği hakkı</li>
          </ul>
          <p className="mt-2">Talepleriniz için: <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a></p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">6. Veri Saklama Süresi</h2>
          <p>
            Hesap verileriniz hesabınız aktif olduğu sürece saklanır. Hesap silme talebinde verileriniz 30 gün içinde silinir.
            Yasal yükümlülükler gerektirdiğinde bazı veriler daha uzun süre saklanabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">7. İletişim</h2>
          <p>
            Gizlilik konularında: <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Ana sayfaya dön</a>
      </div>
    </div>
  );
}
