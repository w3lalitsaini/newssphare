import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
            Have a scoop? Feedback? Or just want to say hi? We'd love to hear from you. 
            Fill out the form or use our contact details below.
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email', value: 'contact@newssphere.com' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
              { icon: MapPin, label: 'Office', value: '123 Media Plaza, New York, NY 10001' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-gray-900 dark:text-white font-bold">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Name</label>
                <input type="text" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" placeholder="Your email" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
              <input type="text" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message</label>
              <textarea rows={5} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium resize-none" placeholder="Write your message here..."></textarea>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 active:scale-[0.98]">
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
