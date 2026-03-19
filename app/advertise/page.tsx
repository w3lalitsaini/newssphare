export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Partner with Us
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
          Advertise with <span className="text-red-600">NewsSphere</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Reach a global audience of tech-savvy, informed readers through our 
          premium advertising solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { title: 'Wide Reach', value: '1M+', desc: 'Monthly unique visitors from around the world.' },
          { title: 'Engagement', value: '4m', desc: 'Average time spent per session on our platforms.' },
          { title: 'Audience', value: '70%', desc: 'Readers are in the 18-35 age demographic.' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <div className="text-4xl font-black text-red-600 mb-2">{stat.value}</div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs mb-3">{stat.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-20">
        <h2>Advertising Options</h2>
        <p>We offer a variety of ways to connect your brand with our audience, including:</p>
        <ul>
          <li><strong>Display Ads:</strong> High-impact banners in premium placements.</li>
          <li><strong>Sponsored Content:</strong> Custom articles written by our world-class editorial team.</li>
          <li><strong>Newsletter Sponsorship:</strong> Direct access to our most engaged readers' inboxes.</li>
          <li><strong>Video Integration:</strong> Feature your product in our original video content.</li>
        </ul>
      </div>

      <div className="bg-red-600 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl shadow-red-500/20">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Ready to launch?</h2>
        <p className="text-lg text-red-100 mb-8 max-w-xl mx-auto">
          Contact our advertising team today to receive our full media kit and discussing custom solutions for your brand.
        </p>
        <a href="mailto:advertise@newssphere.com" className="inline-flex items-center justify-center px-10 py-5 bg-white text-red-600 font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-xl">
          Request Media Kit
        </a>
      </div>
    </div>
  );
}
