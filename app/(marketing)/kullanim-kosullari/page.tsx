export default function KullanimKosullariPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Kullanım Koşulları</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Temmuz 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">1. Taraflar</h2>
          <p>
            Bu koşullar, Visuimo hizmetini sunan <strong>Visuimo</strong> ile hizmeti kullanan kişi veya kuruluş
            (&quot;Kullanıcı&quot;) arasındaki sözleşmeyi oluşturur.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">2. Hizmet Kapsamı</h2>
          <p>
            Visuimo, emlak ilanı fotoğraflarını yapay zeka ile iyileştirme, sanal staging ve tanıtım videosu üretme hizmetleri sunar.
            Hizmetler kredi sistemi üzerinden sunulur; her işlem belirli sayıda kredi tüketir.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">3. Kullanıcı Yükümlülükleri</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Yüklenen fotoğrafların telif hakkına sahip olduğunuzu veya kullanım iznine sahip olduğunuzu beyan edersiniz.</li>
            <li>Üretilen görsellerin sanal staging içerdiğini alıcılara açıkça bildirmeniz gerekir.</li>
            <li>Hizmetleri yasadışı amaçlarla veya yanıltıcı içerik üretmek için kullanamazsınız.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">4. Fikri Mülkiyet</h2>
          <p>
            Yüklediğiniz orijinal fotoğrafların ve üretilen çıktıların mülkiyeti size aittir.
            Visuimo, bu içerikleri yalnızca hizmetin sunulması amacıyla işler.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">5. Ödeme ve İptal</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Ücretli planlar aylık olarak faturalandırılır.</li>
            <li>Abonelik istediğiniz zaman bir sonraki fatura döneminden önce iptal edilebilir.</li>
            <li>İptal edilen abonelikte mevcut dönem sonuna kadar erişim devam eder.</li>
            <li>Kullanılmayan krediler iade edilmez.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">6. Sorumluluk Sınırlaması</h2>
          <p>
            Visuimo, yapay zeka ile üretilen görsellerin her kullanım için uygun olacağını garanti etmez.
            Üretilen içeriklerin yasal uyumluluğunu sağlamak Kullanıcı&apos;nın sorumluluğundadır.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">7. İletişim</h2>
          <p>
            Sorularınız için: <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Ana sayfaya dön</a>
      </div>
    </div>
  );
}
